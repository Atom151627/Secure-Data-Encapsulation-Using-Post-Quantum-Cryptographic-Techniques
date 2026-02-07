import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Upload, Download, File, CheckCircle2, XCircle, FileText, Image as ImageIcon, Video } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import type { AlgorithmType } from "./algorithm-selector";

interface EncryptedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "encrypting" | "encrypted" | "failed";
  progress: number;
}

interface FileEncryptionProps {
  algorithm: AlgorithmType;
  onFileEncrypt: () => void;
}

export function FileEncryption({ algorithm, onFileEncrypt }: FileEncryptionProps) {
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    Array.from(selectedFiles).forEach((file) => {
      const newFile: EncryptedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "encrypting",
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);

      // Simulate encryption progress
      simulateEncryption(newFile.id);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateEncryption = async (fileId: string) => {
    const updateProgress = async () => {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: "encrypted" as const, progress: 100 } : f
      ));

      onFileEncrypt();
      toast.success("File encrypted successfully with " + algorithm);
    };

    updateProgress();
  };

  const downloadEncryptedFile = (file: EncryptedFile) => {
    // Simulate download
    const content = `[ENCRYPTED WITH ${algorithm}]\nOriginal: ${file.name}\nSize: ${formatFileSize(file.size)}\nEncrypted on: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.pqc.encrypted`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Encrypted file downloaded");
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info("File removed from list");
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
                        {file.status === "encrypted" && (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => downloadEncryptedFile(file)}
                            >
                              <Download className="h-4 w-4" />
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

                    {file.status === "encrypting" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Encrypting...</span>
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

        {files.length === 0 && (
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mb-2">
              No files selected
            </p>
            <p className="text-xs text-muted-foreground">
              Click the button above to select files for encryption
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
