import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Lock, Unlock, Copy, Check, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import type { AlgorithmType } from "./algorithm-selector";

interface EncryptionPanelProps {
  algorithm: AlgorithmType;
  onEncrypt: (data: string) => void;
}

export function EncryptionPanel({ algorithm, onEncrypt }: EncryptionPanelProps) {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [copied, setCopied] = useState(false);

  const simulateEncryption = (text: string): string => {
    // Simulate post-quantum encryption with base64 encoding and padding
    const encoded = btoa(text);
    const prefix = `PQC-${algorithm.toUpperCase().replace(/[^A-Z]/g, '')}-`;
    const randomPadding = Array.from({ length: 64 }, () => 
      Math.random().toString(36).charAt(2)
    ).join('');
    return `${prefix}${encoded}${randomPadding}`;
  };

  const simulateDecryption = (text: string): string => {
    try {
      // Extract the base64 part from the simulated ciphertext
      const match = text.match(/PQC-[A-Z]+-(.+?)([a-z0-9]{64})$/);
      if (match && match[1]) {
        return atob(match[1]);
      }
      return "Invalid ciphertext format";
    } catch {
      return "Decryption failed";
    }
  };

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      toast.error("Please enter text to encrypt");
      return;
    }

    setIsEncrypting(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const encrypted = simulateEncryption(plaintext);
    setCiphertext(encrypted);
    onEncrypt(plaintext);
    setIsEncrypting(false);
    
    toast.success("Data encrypted successfully with " + algorithm);
  };

  const handleDecrypt = async () => {
    if (!ciphertext.trim()) {
      toast.error("Please enter ciphertext to decrypt");
      return;
    }

    setIsDecrypting(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const decrypted = simulateDecryption(ciphertext);
    setPlaintext(decrypted);
    setIsDecrypting(false);
    
    toast.success("Data decrypted successfully");
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
    a.download = `encrypted-${Date.now()}.pqc`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Encrypted file downloaded");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Plaintext Data
          </CardTitle>
          <CardDescription>Enter data to encrypt using {algorithm}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your sensitive data here..."
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
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
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Lock className="h-4 w-4" />
                  </motion.div>
                  Encrypting...
                </motion.span>
              ) : (
                <motion.span
                  key="encrypt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Encrypt Data
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Encrypted Data
          </CardTitle>
          <CardDescription>Quantum-resistant ciphertext output</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Encrypted output will appear here..."
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              rows={8}
              className="font-mono text-sm pr-10"
            />
            {ciphertext && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(ciphertext)}
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
              disabled={isDecrypting || !ciphertext.trim()}
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
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Unlock className="h-4 w-4" />
                    </motion.div>
                    Decrypting...
                  </motion.span>
                ) : (
                  <motion.span
                    key="decrypt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Unlock className="h-4 w-4" />
                    Decrypt Data
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
