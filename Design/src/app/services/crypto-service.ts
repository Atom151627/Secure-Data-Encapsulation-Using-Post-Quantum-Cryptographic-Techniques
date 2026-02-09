import { MlKem768 } from 'mlkem';
// import dilithiumPromise from 'dilithium-crystals-js';
import { sha256 } from '@noble/hashes/sha2.js';
import { hkdf } from '@noble/hashes/hkdf.js';

// Types
export type AlgorithmType = "CRYSTALS-Kyber" | "CRYSTALS-Dilithium" | "SPHINCS+" | "NTRU" | "SABER" | "FrodoKEM";

export interface KeyPair {
    publicKey: string; // Hex string
    privateKey: string; // Hex string
    algorithm: AlgorithmType;
}

export interface EncryptionResult {
    ciphertext: string; // Base64 (iv + authTag + cipher)
    encapsulation?: string; // Hex string (for KEM)
    signature?: string; // Hex string (for Signatures/SPHINCS+)
}

// Helpers for Hex/Bytes (Browser compatible)
const toHex = (bytes: Uint8Array): string => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex: string): Uint8Array => new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
const toBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));
const fromBase64 = (base64: string): Uint8Array => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

// Dilithium Module Cache
let dilithium: any = null;
async function getDilithium() {
    if (!dilithium) {
        // dilithium = await dilithiumPromise;
        throw new Error("Dilithium not loaded");
    }
    return dilithium;
}

// Crypto Service
export const CryptoService = {
    // Key Generation
    async generateKeyPair(algorithm: AlgorithmType): Promise<KeyPair> {
        try {
            let publicKey: Uint8Array;
            let privateKey: Uint8Array;

            switch (algorithm) {
                case "CRYSTALS-Kyber":
                case "NTRU":
                case "SABER":
                case "FrodoKEM":
                    {
                        // MlKem768 from 'mlkem'
                        const recipient = new MlKem768();
                        const [pk, sk] = await recipient.generateKeyPair();
                        publicKey = pk;
                        privateKey = sk;
                        break;
                    }
                case "CRYSTALS-Dilithium":
                case "SPHINCS+":
                    {
                        // throw new Error("Dilithium/SPHINCS+ temporarily disabled due to build issues.");

                        const lib = await getDilithium();
                        const keys = lib.generateKeys(3);
                        publicKey = keys.publicKey;
                        privateKey = keys.privateKey;
                        break;

                    }
                default:
                    throw new Error(`Unsupported algorithm: ${algorithm}`);
            }

            return {
                publicKey: toHex(publicKey),
                privateKey: toHex(privateKey),
                algorithm,
            };
        } catch (e) {
            console.error("Key generation failed:", e);
            throw e;
        }
    },

    // Encryption (KEM + AES-GCM)
    async encrypt(data: string | Uint8Array, publicKeyHex: string, algorithm: AlgorithmType): Promise<EncryptionResult> {
        const dataBytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
        const publicKey = fromHex(publicKeyHex);

        // 1. KEM Encapsulation (Get Shared Secret)
        let sharedSecret: Uint8Array;
        let encapsulation: Uint8Array | undefined;

        switch (algorithm) {
            case "CRYSTALS-Kyber":
            case "NTRU":
            case "SABER":
            case "FrodoKEM":
                {
                    const sender = new MlKem768();
                    const [ct, ss] = await sender.encap(publicKey);
                    encapsulation = ct;
                    sharedSecret = ss;
                    break;
                }
            case "CRYSTALS-Dilithium":
            case "SPHINCS+":
                throw new Error("Cannot encrypt with a Signature scheme (Dilithium/SPHINCS+). Use Sign/Verify instead.");
            default:
                throw new Error(`Unsupported algorithm for encryption: ${algorithm}`);
        }

        // 2. Derive AES Key from Shared Secret using HKDF-SHA256
        // correct usage: hkdf(hash, ikm, salt, info, length)
        const aesKey = hkdf(sha256, sharedSecret, undefined, new TextEncoder().encode("PQC-Encryption"), 32);

        // 3. Encrypt Data using AES-256-GCM
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
        const key = await crypto.subtle.importKey("raw", aesKey as any, "AES-GCM", false, ["encrypt"]);
        const encryptedContent = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            dataBytes as any
        );

        // Combine IV + Ciphertext
        const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedContent), iv.length);

        return {
            ciphertext: toBase64(combined),
            encapsulation: encapsulation ? toHex(encapsulation) : undefined,
        };
    },

    // Decryption (KEM + AES-GCM)
    async decrypt(
        encryptedData: EncryptionResult,
        privateKeyHex: string,
        algorithm: AlgorithmType
    ): Promise<string> { // Returns string (UTF-8)
        const privateKey = fromHex(privateKeyHex);

        // 1. Recover Shared Secret
        let sharedSecret: Uint8Array;

        switch (algorithm) {
            case "CRYSTALS-Kyber":
            case "NTRU":
            case "SABER":
            case "FrodoKEM":
                {
                    if (!encryptedData.encapsulation) throw new Error("Missing encapsulation");
                    const encap = fromHex(encryptedData.encapsulation);
                    const recipient = new MlKem768();
                    // decapsulate(cipherText, secretKey)
                    const ss = await recipient.decap(encap, privateKey);
                    sharedSecret = ss;
                    break;
                }
            default:
                throw new Error(`Unsupported algorithm for decryption: ${algorithm}`);
        }

        // 2. Derive AES Key
        const aesKey = hkdf(sha256, sharedSecret, undefined, new TextEncoder().encode("PQC-Encryption"), 32);

        // 3. Decrypt AES
        const combined = fromBase64(encryptedData.ciphertext);
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const key = await crypto.subtle.importKey("raw", aesKey as any, "AES-GCM", false, ["decrypt"]);

        try {
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                ciphertext as any
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            throw new Error("Decryption failed (MAC mismatch or wrong key).");
        }
    },

    // Signing (Dilithium)
    async sign(_data: string, _privateKeyHex: string, _algorithm: AlgorithmType): Promise<string> {
        /*
        const dataBytes = new TextEncoder().encode(data);
        const privateKey = fromHex(privateKeyHex);
        
        switch (algorithm) {
          case "CRYSTALS-Dilithium":
          case "SPHINCS+":
          {
            const lib = await getDilithium();
            // sign(message, privateKey, kind) - kind 3 for Dilithium3
            const signature = lib.sign(dataBytes, privateKey, 3); 
            return toHex(signature);
          }
          default:
            throw new Error(`Algorithm ${algorithm} does not support signing.`);
        }
        */
        throw new Error("Signing temporarily disabled.");
    },

    // Verify (Dilithium)
    async verify(_data: string, _signatureHex: string, _publicKeyHex: string, _algorithm: AlgorithmType): Promise<boolean> {
        /*
        const dataBytes = new TextEncoder().encode(data);
        const signature = fromHex(signatureHex);
        const publicKey = fromHex(publicKeyHex);
        
        switch (algorithm) {
          case "CRYSTALS-Dilithium":
          case "SPHINCS+":
          {
            const lib = await getDilithium();
            // verify(signature, message, publicKey, kind)
            return lib.verify(signature, dataBytes, publicKey, 3);
          }
          default:
            return false;
        }
        */
        return false;
    }
};
