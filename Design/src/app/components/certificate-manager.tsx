import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Award, Plus, Download, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import type { AlgorithmType } from "./algorithm-selector";

interface CertificateData {
  id: string;
  commonName: string;
  organization: string;
  algorithm: AlgorithmType;
  validFrom: Date;
  validUntil: Date;
  serialNumber: string;
  status: "valid" | "expiring" | "expired";
}

interface CertificateManagerProps {
  algorithm: AlgorithmType;
}

export function CertificateManager({ algorithm }: CertificateManagerProps) {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    commonName: "",
    organization: "",
    validityDays: "365"
  });

  const generateSerialNumber = () => {
    return Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("").toUpperCase();
  };

  const getCertificateStatus = (validUntil: Date): CertificateData["status"] => {
    const now = new Date();
    const daysUntilExpiry = Math.floor((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry < 30) return "expiring";
    return "valid";
  };

  const createCertificate = async () => {
    if (!formData.commonName || !formData.organization) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(formData.validityDays));

    const newCert: CertificateData = {
      id: `cert-${Date.now()}`,
      commonName: formData.commonName,
      organization: formData.organization,
      algorithm,
      validFrom,
      validUntil,
      serialNumber: generateSerialNumber(),
      status: "valid"
    };

    setCertificates(prev => [newCert, ...prev]);
    setFormData({ commonName: "", organization: "", validityDays: "365" });
    setIsCreating(false);
    
    toast.success(`Post-quantum certificate created with ${algorithm}`);
  };

  const exportCertificate = (cert: CertificateData) => {
    const certContent = `-----BEGIN CERTIFICATE-----
Certificate Details:
Common Name: ${cert.commonName}
Organization: ${cert.organization}
Algorithm: ${cert.algorithm}
Serial Number: ${cert.serialNumber}
Valid From: ${cert.validFrom.toISOString()}
Valid Until: ${cert.validUntil.toISOString()}
Status: ${cert.status.toUpperCase()}

Signature Algorithm: ${cert.algorithm}
Public Key Algorithm: ${cert.algorithm}
-----END CERTIFICATE-----`;

    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.commonName}-pqc.crt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Certificate exported");
  };

  const revokeCertificate = (certId: string) => {
    setCertificates(prev => prev.filter(c => c.id !== certId));
    toast.success("Certificate revoked");
  };

  const getStatusColor = (status: CertificateData["status"]) => {
    switch (status) {
      case "valid": return "default";
      case "expiring": return "secondary";
      case "expired": return "destructive";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Post-Quantum Certificate Manager
        </CardTitle>
        <CardDescription>
          Create and manage quantum-resistant X.509 certificates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Certificate Creation Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Certificate
          </h4>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="commonName">Common Name (CN)</Label>
              <Input
                id="commonName"
                placeholder="example.com"
                value={formData.commonName}
                onChange={(e) => setFormData(prev => ({ ...prev, commonName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="ACME Corp"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="validity">Validity (Days)</Label>
              <Input
                id="validity"
                type="number"
                placeholder="365"
                value={formData.validityDays}
                onChange={(e) => setFormData(prev => ({ ...prev, validityDays: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Algorithm</Label>
              <div className="h-10 flex items-center">
                <Badge variant="outline">{algorithm}</Badge>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={createCertificate} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Award className="h-4 w-4" />
                </motion.div>
                Generating Certificate...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Generate PQC Certificate
              </>
            )}
          </Button>
        </div>

        {/* Certificates List */}
        {certificates.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">
              Active Certificates ({certificates.length})
            </h4>
            
            <AnimatePresence mode="popLayout">
              {certificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{cert.commonName}</h5>
                        <Badge variant={getStatusColor(cert.status)}>
                          {cert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cert.organization}
                      </p>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => exportCertificate(cert)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => revokeCertificate(cert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Algorithm</p>
                      <p className="font-medium">{cert.algorithm}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Serial Number</p>
                      <p className="font-mono">{cert.serialNumber.substring(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid From</p>
                      <p>{cert.validFrom.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p>{cert.validUntil.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {cert.status === "valid" && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Certificate is valid and quantum-resistant
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              No certificates generated yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first post-quantum certificate above
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}