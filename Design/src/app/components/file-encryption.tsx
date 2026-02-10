import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Upload, Download, File, CheckCircle2, XCircle, FileText, Image as ImageIcon, Video, Key, RefreshCw, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { AlgorithmType } from "./algorithm-selector";
import { CryptoService, KeyPair } from "../services/crypto-service";

interface EncryptedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "encrypting" | "encrypted" | "failed" | "decrypting" | "decrypted";
  progress: number;
  encryptedData?: string; // JSON string of EncryptionResult
  decryptedData?: string; // Base64 or Blob URL
}

interface FileEncryptionProps {
  algorithm: AlgorithmType;
  onFileEncrypt: () => void;
}

export function FileEncryption({ algorithm, onFileEncrypt }: FileEncryptionProps) {
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset keys when algorithm changes
  useEffect(() => {
    setFiles([]);
    // Don't reset keyPair immediately - let user know they need new keys
    if (keyPair && keyPair.algorithm !== algorithm) {
      setKeyPair(null);
      toast.info(`Algorithm changed to ${algorithm}. Please generate new keys.`);
    }
  }, [algorithm]);

  const generateKeys = async () => {
    setIsGeneratingKeys(true);
    try {
      await new Promise(r => setTimeout(r, 100));
      const keys = await CryptoService.generateKeyPair(algorithm);
      setKeyPair(keys);
      toast.success(`Generated new ${algorithm} keys used for file encryption`);
    } catch (e) {
      toast.error("Failed to generate keys");
      console.error(e);
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon;
    if (type.startsWith("video/")) return Video;
    if (type.startsWith("text/")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    if (!keyPair) {
      toast.error("Generate keys first!");
      return;
    }

    const newFiles: EncryptedFile[] = Array.from(selectedFiles).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "encrypting",
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileObj = newFiles[i];
      await processFileEncryption(file, fileObj.id);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFileEncryption = async (file: File, fileId: string) => {
    if (!keyPair) return;

    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f =>
          f.id === fileId && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
        ));
      }, 100);

      const dataUrl = await readFileAsBase64(file);

      let encryptedDataStr = "";

      if (algorithm === "CRYSTALS-Dilithium" || algorithm === "SPHINCS+") {
        // Sign the file content
        const signature = await CryptoService.sign(dataUrl, keyPair.privateKey, algorithm);
        encryptedDataStr = JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          data: dataUrl,
          signature: signature,
          algorithm,
          timestamp: new Date().toISOString()
        }, null, 2);
      } else {
        // Encrypt
        const result = await CryptoService.encrypt(dataUrl, keyPair.publicKey, algorithm);
        encryptedDataStr = JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          ...result,
          algorithm,
          timestamp: new Date().toISOString()
        }, null, 2);
      }

      clearInterval(interval);

      setFiles(prev => prev.map(f =>
        f.id === fileId ? {
          ...f,
          status: "encrypted",
          progress: 100,
          encryptedData: encryptedDataStr
        } : f
      ));

      onFileEncrypt();
      toast.success(`Encrypted ${file.name}`);

    } catch (e) {
      console.error(e);
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: "failed", progress: 0 } : f));
      toast.error(`Failed to encrypt ${file.name}`);
    }
  };

  const decryptFile = async (file: EncryptedFile) => {
    if (!keyPair) {
      toast.error("Generate keys first!");
      return;
    }
    if (!file.encryptedData) {
      toast.error("No encrypted data available");
      return;
    }

    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "decrypting", progress: 0 } : f));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f =>
          f.id === file.id && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
        ));
      }, 100);

      const parsed = JSON.parse(file.encryptedData);

      // Check if algorithm matches
      if (parsed.algorithm && parsed.algorithm !== algorithm) {
        clearInterval(progressInterval);
        toast.error(`File was encrypted with ${parsed.algorithm}. Please switch to that algorithm.`);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "encrypted", progress: 100 } : f));
        return;
      }

      if (algorithm === "CRYSTALS-Dilithium" || algorithm === "SPHINCS+") {
        const valid = await CryptoService.verify(parsed.data, parsed.signature, keyPair.publicKey, algorithm);
        clearInterval(progressInterval);
        if (valid) {
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: 100 } : f));
          toast.success("Signature Verified! Downloading original file...");
          downloadDataUrl(parsed.data, file.name);
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "decrypted" } : f));
        } else {
          toast.error("Signature Verification Failed!");
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "failed" } : f));
        }
      } else {
        // Decrypt
        const decryptedDataUrl = await CryptoService.decrypt(parsed, keyPair.privateKey, algorithm);
        clearInterval(progressInterval);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: 100 } : f));
        toast.success("Decrypted successfully! Downloading...");
        downloadDataUrl(decryptedDataUrl, file.name);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "decrypted" } : f));
      }
    } catch (e) {
      console.error(e);
      toast.error("Decryption failed: " + (e instanceof Error ? e.message : "Unknown error"));
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "failed" } : f));
    }
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename; // Download result
    a.click();
  };

  const downloadEncryptedFile = (file: EncryptedFile) => {
    if (!file.encryptedData) return;
    const blob = new Blob([file.encryptedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.encrypted.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Encrypted file downloaded");
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const encryptAll = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Encryption
        </CardTitle>
        <CardDescription>
          Encrypt files using {algorithm} post-quantum algorithm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!keyPair ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
            <Key className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-center text-muted-foreground mb-4">
              Generate {algorithm} keys to start file encryption
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
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button onClick={encryptAll} className="w-full" size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Select Files to Encrypt
            </Button>

            {files.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Processing {files.length} file(s)</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                  >
                    Clear All
                  </Button>
                </div>

                <AnimatePresence mode="popLayout">
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {(file.status === "encrypted" || file.status === "decrypted") && (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => downloadEncryptedFile(file)}
                                  title="Download Encrypted JSON"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                {/* Decrypt Button */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => decryptFile(file)}
                                  title="Decrypt & Download Original"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {file.status === "failed" && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFile(file.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {(file.status === "encrypting" || file.status === "decrypting") && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                {file.status === "encrypting" ? "Encrypting..." : "Decrypting..."}
                              </span>
                              <span className="font-medium">{file.progress}%</span>
                            </div>
                            <Progress value={file.progress} className="h-1" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
