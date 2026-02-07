import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Key, Plus, Trash2, RefreshCw, Eye, EyeOff, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import type { AlgorithmType } from "./algorithm-selector";

interface KeyPair {
  id: string;
  algorithm: AlgorithmType;
  publicKey: string;
  privateKey: string;
  created: Date;
}

interface KeyManagementProps {
  algorithm: AlgorithmType;
}

export function KeyManagement({ algorithm }: KeyManagementProps) {
  const [keys, setKeys] = useState<KeyPair[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const generateRandomKey = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const generateKeyPair = async () => {
    setIsGenerating(true);
    
    // Simulate key generation time
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newKeyPair: KeyPair = {
      id: `key-${Date.now()}`,
      algorithm,
      publicKey: `PQC-PUB-${algorithm.replace(/[^A-Z]/g, '')}-${generateRandomKey(128)}`,
      privateKey: `PQC-PRV-${algorithm.replace(/[^A-Z]/g, '')}-${generateRandomKey(256)}`,
      created: new Date()
    };

    setKeys(prev => [newKeyPair, ...prev]);
    setIsGenerating(false);
    toast.success(`Key pair generated with ${algorithm}`);
  };

  const deleteKey = (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast.success("Key pair deleted");
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const exportKeys = (keyPair: KeyPair) => {
    const keyData = {
      algorithm: keyPair.algorithm,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      created: keyPair.created.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pqc-keypair-${keyPair.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Keys exported successfully");
  };

  const truncateKey = (key: string, visible: boolean): string => {
    if (visible) return key;
    return `${key.substring(0, 20)}...${key.substring(key.length - 20)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Key Management
            </CardTitle>
            <CardDescription>Generate and manage quantum-resistant key pairs</CardDescription>
          </div>
          <Button onClick={generateKeyPair} disabled={isGenerating}>
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.span
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  Generating...
                </motion.span>
              ) : (
                <motion.span
                  key="generate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Generate Keys
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {keys.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No key pairs generated yet</p>
            <p className="text-sm">Click "Generate Keys" to create a new quantum-resistant key pair</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {keys.map((keyPair) => {
                const isVisible = visibleKeys.has(keyPair.id);
                return (
                  <motion.div
                    key={keyPair.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>{keyPair.algorithm}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {keyPair.created.toLocaleDateString()} {keyPair.created.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(keyPair.id)}
                        >
                          {isVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => exportKeys(keyPair)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteKey(keyPair.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Public Key</p>
                        <code className="text-xs bg-muted p-2 rounded block break-all">
                          {truncateKey(keyPair.publicKey, isVisible)}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Private Key</p>
                        <code className="text-xs bg-muted p-2 rounded block break-all">
                          {isVisible ? keyPair.privateKey : '••••••••••••••••••••••••••••••••••••••'}
                        </code>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
