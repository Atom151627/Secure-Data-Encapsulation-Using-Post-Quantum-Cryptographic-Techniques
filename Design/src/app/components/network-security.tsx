import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Network, Shield, AlertTriangle, CheckCircle, Wifi, Server } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  type: "server" | "router" | "endpoint";
  encryption: "classical" | "pqc" | "hybrid";
  status: "secure" | "vulnerable" | "scanning";
  threatLevel: number;
}

export function NetworkSecurity() {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      id: "node-1",
      name: "Web Server",
      ip: "192.168.1.100",
      type: "server",
      encryption: "classical",
      status: "vulnerable",
      threatLevel: 85
    },
    {
      id: "node-2",
      name: "API Gateway",
      ip: "192.168.1.101",
      type: "server",
      encryption: "hybrid",
      status: "secure",
      threatLevel: 30
    },
    {
      id: "node-3",
      name: "Database Server",
      ip: "192.168.1.102",
      type: "server",
      encryption: "pqc",
      status: "secure",
      threatLevel: 15
    },
    {
      id: "node-4",
      name: "Edge Router",
      ip: "192.168.1.1",
      type: "router",
      encryption: "classical",
      status: "vulnerable",
      threatLevel: 75
    },
    {
      id: "node-5",
      name: "Client Endpoint",
      ip: "192.168.1.200",
      type: "endpoint",
      encryption: "pqc",
      status: "secure",
      threatLevel: 10
    }
  ]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          setIsScanning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    setNodes(prev => prev.map(node => ({
      ...node,
      status: "scanning" as const
    })));

    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        status: node.encryption === "classical" ? "vulnerable" as const : "secure" as const
      })));
    }, 4000);
  };

  const upgradeNode = (nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId
        ? { ...node, encryption: "pqc", status: "secure" as const, threatLevel: 15 }
        : node
    ));
  };

  const getNodeIcon = (type: NetworkNode["type"]) => {
    switch (type) {
      case "server": return Server;
      case "router": return Wifi;
      case "endpoint": return Network;
    }
  };

  const getEncryptionBadge = (encryption: NetworkNode["encryption"]) => {
    switch (encryption) {
      case "classical":
        return <Badge variant="destructive">Classical</Badge>;
      case "pqc":
        return <Badge variant="default">Post-Quantum</Badge>;
      case "hybrid":
        return <Badge variant="secondary">Hybrid</Badge>;
    }
  };

  const getStatusIcon = (status: NetworkNode["status"]) => {
    switch (status) {
      case "secure":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "vulnerable":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "scanning":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="h-5 w-5 text-blue-500" />
          </motion.div>
        );
    }
  };

  const secureNodes = nodes.filter(n => n.status === "secure").length;
  const vulnerableNodes = nodes.filter(n => n.status === "vulnerable").length;
  const avgThreatLevel = Math.round(nodes.reduce((acc, n) => acc + n.threatLevel, 0) / nodes.length);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Network Security Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Secure Nodes</span>
              <span className="font-bold text-green-500">{secureNodes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Vulnerable Nodes</span>
              <span className="font-bold text-red-500">{vulnerableNodes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Threat Level</span>
              <span className="font-bold">{avgThreatLevel}%</span>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={startScan} 
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Network className="h-4 w-4" />
                  </motion.div>
                  Scanning Network...
                </>
              ) : (
                <>
                  <Network className="h-4 w-4 mr-2" />
                  Scan Network
                </>
              )}
            </Button>

            {isScanning && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Network Nodes */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Topology
          </CardTitle>
          <CardDescription>
            Quantum threat assessment for network infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {nodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        node.status === "secure" ? "bg-green-500/10" :
                        node.status === "vulnerable" ? "bg-red-500/10" :
                        "bg-blue-500/10"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{node.name}</h4>
                          {getEncryptionBadge(node.encryption)}
                          {getStatusIcon(node.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="font-mono">{node.ip}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {node.type}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Quantum Threat Level</span>
                            <span className={`font-medium ${
                              node.threatLevel > 60 ? "text-red-500" :
                              node.threatLevel > 30 ? "text-yellow-500" :
                              "text-green-500"
                            }`}>
                              {node.threatLevel}%
                            </span>
                          </div>
                          <Progress 
                            value={node.threatLevel} 
                            className={`h-1 ${
                              node.threatLevel > 60 ? "[&>div]:bg-red-500" :
                              node.threatLevel > 30 ? "[&>div]:bg-yellow-500" :
                              "[&>div]:bg-green-500"
                            }`}
                          />
                        </div>
                      </div>

                      {node.encryption === "classical" && (
                        <Button
                          size="sm"
                          onClick={() => upgradeNode(node.id)}
                          className="shrink-0"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Upgrade to PQC
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
