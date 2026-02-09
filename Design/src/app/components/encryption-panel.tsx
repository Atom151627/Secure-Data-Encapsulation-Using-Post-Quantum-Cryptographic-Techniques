import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Lock, Unlock, Copy, Check, Download, RefreshCw, Key } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { AlgorithmType } from "./algorithm-selector";
import { CryptoService, KeyPair } from "../services/crypto-service";

interface EncryptionPanelProps {
  algorithm: AlgorithmType;
  onEncrypt: (data: string) => void;
}

export function EncryptionPanel({ algorithm, onEncrypt }: EncryptionPanelProps) {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [copied, setCopied] = useState(false);

  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);

  // Reset keys when algorithm changes
  useEffect(() => {
    setKeyPair(null);
    setCiphertext("");
    setDecryptedText("");
  }, [algorithm]);

  const generateKeys = async () => {
    setIsGeneratingKeys(true);
    try {
      // Small delay to allow UI to update
      await new Promise(r => setTimeout(r, 100));
      const keys = await CryptoService.generateKeyPair(algorithm);
      setKeyPair(keys);
      toast.success(`Generated new ${algorithm} keys`);
    } catch (e) {
      toast.error("Failed to generate keys. See console.");
      console.error(e);
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      toast.error("Please enter text to encrypt");
      return;
    }
    if (!keyPair) {
      toast.error("Please generate keys first");
      return;
    }

    setIsEncrypting(true);
    try {
      // Simulate slight delay for visual feedback if instant
      await new Promise(resolve => setTimeout(resolve, 300));

      let resultString = "";

      if (algorithm === "CRYSTALS-Dilithium" || algorithm === "SPHINCS+") {
        // Signature Mode
        const signature = await CryptoService.sign(plaintext, keyPair.privateKey, algorithm);
        resultString = JSON.stringify({
          data: plaintext,
          signature: signature,
          algorithm: algorithm
        }, null, 2);
        toast.success(`Data signed with ${algorithm}`);
      } else {
        // Encryption Mode
        const result = await CryptoService.encrypt(plaintext, keyPair.publicKey, algorithm);
        resultString = JSON.stringify(result, null, 2);
        toast.success(`Data encrypted with ${algorithm}`);
      }

      setCiphertext(resultString);
      setDecryptedText(""); // Clear any previous decrypted text
      onEncrypt(plaintext);
    } catch (e) {
      toast.error("Encryption failed");
      console.error(e);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext.trim()) {
      toast.error("Please enter ciphertext to decrypt");
      return;
    }
    if (!keyPair) {
      toast.error("Please generate keys first");
      return;
    }

    setIsDecrypting(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 300));

      if (algorithm === "CRYSTALS-Dilithium" || algorithm === "SPHINCS+") {
        // Verify Mode
        const parsed = JSON.parse(ciphertext);
        const isValid = await CryptoService.verify(parsed.data, parsed.signature, keyPair.publicKey, algorithm);
        if (isValid) {
          setPlaintext(parsed.data + "\n\n[✓ Verified Signature]");
          toast.success("Signature Verified! Data is authentic.");
        } else {
          toast.error("Signature Verification Failed!");
          setPlaintext("[INVALID SIGNATURE] " + parsed.data);
        }
      } else {
        // Decrypt Mode
        const parsed = JSON.parse(ciphertext);
        const decrypted = await CryptoService.decrypt(parsed, keyPair.privateKey, algorithm);
        setDecryptedText(decrypted);
        toast.success("Data decrypted successfully");
      }
    } catch (e: any) {
      console.error("Decryption error:", e);
      toast.error(e?.message || "Operation failed. Check console for details.");
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCiphertext = () => {
    const blob = new Blob([ciphertext], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Encrypted file downloaded");
  };

  const isSignatureScheme = algorithm === "CRYSTALS-Dilithium" || algorithm === "SPHINCS+";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Input Data
          </CardTitle>
          <CardDescription>
            {isSignatureScheme ? "Enter data to sign" : `Enter data to encrypt using ${algorithm}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          {!keyPair ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
              <Key className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-center text-muted-foreground mb-4">
                Generate {algorithm} keys to start secure communication
              </p>
              <Button onClick={generateKeys} disabled={isGeneratingKeys}>
                {isGeneratingKeys ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Keys...
                  </>
                ) : (
                  "Generate Keys"
                )}
              </Button>
            </div>
          ) : (
            <>
              <Textarea
                placeholder="Enter your sensitive data here..."
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                className="font-mono text-sm flex-1 min-h-[200px]"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleEncrypt}
                  disabled={isEncrypting || !plaintext.trim()}
                  className="w-full"
                >
                  <AnimatePresence mode="wait">
                    {isEncrypting ? (
                      <motion.span
                        key="encrypting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processing...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="encrypt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        {isSignatureScheme ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        {isSignatureScheme ? "Sign Data" : "Encrypt Data"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
                <Button variant="outline" onClick={() => setKeyPair(null)}>
                  Clear Keys
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {decryptedText ? "Decrypted Data" : (isSignatureScheme ? "Signature / Output" : "Encrypted Data")}
          </CardTitle>
          <CardDescription>
            {decryptedText ? "Successfully decrypted plaintext" : (isSignatureScheme ? "Digital signature output" : "Quantum-resistant ciphertext output")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="relative flex-1">
            <Textarea
              placeholder="Output will appear here..."
              value={decryptedText || ciphertext}
              onChange={(e) => {
                if (decryptedText) {
                  setDecryptedText(e.target.value);
                } else {
                  setCiphertext(e.target.value);
                }
              }}
              className="font-mono text-sm pr-10 h-full min-h-[200px] resize-none"
            />
            {ciphertext && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(decryptedText || ciphertext)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDecrypt}
              disabled={isDecrypting || !ciphertext.trim() || !keyPair}
              className="flex-1"
              variant="secondary"
            >
              <AnimatePresence mode="wait">
                {isDecrypting ? (
                  <motion.span
                    key="decrypting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </motion.span>
                ) : (
                  <motion.span
                    key="decrypt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {isSignatureScheme ? <Check className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    {isSignatureScheme ? "Verify Signature" : "Decrypt Data"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button
              onClick={downloadCiphertext}
              disabled={!ciphertext}
              variant="outline"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

