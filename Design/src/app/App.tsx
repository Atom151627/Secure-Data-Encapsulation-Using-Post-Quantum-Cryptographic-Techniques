import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { CryptoDashboard } from "./components/crypto-dashboard";
import { AlgorithmSelector, type AlgorithmType } from "./components/algorithm-selector";
import { EncryptionPanel } from "./components/encryption-panel";
import { KeyManagement } from "./components/key-management";
import { SecurityVisualization } from "./components/security-visualization";
import { ActivityLog } from "./components/activity-log";
import { QuantumThreatMeter } from "./components/quantum-threat-meter";
import { FileEncryption } from "./components/file-encryption";
import { QuantumSimulator } from "./components/quantum-simulator";
import { CertificateManager } from "./components/certificate-manager";
import { NetworkSecurity } from "./components/network-security";
import { LoginPage } from "./components/login-page";
import { Shield, Lock, Key, Activity, BarChart3, AlertTriangle, Upload, Cpu, Award, Network, LogOut } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { motion } from "motion/react";

interface Activity {
  id: string;
  type: "encryption" | "decryption" | "keygen" | "verify";
  algorithm: string;
  timestamp: Date;
  status: "success" | "failed";
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("CRYSTALS-Kyber");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalEncryptions: 0,
    activeKeys: 0,
    dataEncapsulated: "0 MB",
    securityLevel: 99
  });

  const addActivity = (type: Activity["type"]) => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type,
      algorithm: selectedAlgorithm,
      timestamp: new Date(),
      status: "success"
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  };

  const handleEncrypt = (data: string) => {
    setStats(prev => ({
      ...prev,
      totalEncryptions: prev.totalEncryptions + 1,
      dataEncapsulated: `${(parseFloat(prev.dataEncapsulated) + (data.length / 1024 / 1024)).toFixed(2)} MB`
    }));
    addActivity("encryption");
  };

  const handleFileEncrypt = () => {
    setStats(prev => ({
      ...prev,
      totalEncryptions: prev.totalEncryptions + 1,
      dataEncapsulated: `${(parseFloat(prev.dataEncapsulated) + 0.5).toFixed(2)} MB`
    }));
    addActivity("encryption");
  };

  // Simulate some initial activities
  useEffect(() => {
    const initialActivities: Activity[] = [
      {
        id: "init-1",
        type: "keygen",
        algorithm: "CRYSTALS-Kyber",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: "success"
      },
      {
        id: "init-2",
        type: "encryption",
        algorithm: "CRYSTALS-Dilithium",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: "success"
      },
      {
        id: "init-3",
        type: "verify",
        algorithm: "SPHINCS+",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        status: "success"
      }
    ];
    setActivities(initialActivities);
  }, []);

  return (
    <>
      {!isAuthenticated ? (
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header with 3D Hero */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row items-center gap-6"
            >
              <div className="flex items-center gap-3 lg:flex-1">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Post-Quantum Cryptography Suite
                  </h1>
                  <p className="text-purple-200">
                    Secure Data Encapsulation Using Quantum-Resistant Techniques
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-sm hidden sm:inline">Welcome, Adithya</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthenticated(false)}
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              
              {/* Animated logo area */}
              <div className="w-full lg:w-[400px] h-[200px] relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/20">
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="w-32 h-32 border-4 border-purple-500/50 rounded-full" />
                </motion.div>
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="w-24 h-24 border-4 border-blue-500/50 rounded-full" />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Dashboard Stats */}
            <CryptoDashboard stats={stats} />

            {/* Main Tabs */}
            <Tabs defaultValue="encrypt" className="space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex bg-black/40 backdrop-blur-sm border border-white/10">
                  <TabsTrigger value="encrypt" className="gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="hidden sm:inline">Encrypt</span>
                  </TabsTrigger>
                  <TabsTrigger value="files" className="gap-2">
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Files</span>
                  </TabsTrigger>
                  <TabsTrigger value="keys" className="gap-2">
                    <Key className="h-4 w-4" />
                    <span className="hidden sm:inline">Keys</span>
                  </TabsTrigger>
                  <TabsTrigger value="certificates" className="gap-2">
                    <Award className="h-4 w-4" />
                    <span className="hidden sm:inline">Certificates</span>
                  </TabsTrigger>
                  <TabsTrigger value="network" className="gap-2">
                    <Network className="h-4 w-4" />
                    <span className="hidden sm:inline">Network</span>
                  </TabsTrigger>
                  <TabsTrigger value="simulator" className="gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="hidden sm:inline">Simulator</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="threat" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Threat</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Encryption Tab */}
              <TabsContent value="encrypt" className="space-y-6">
                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={setSelectedAlgorithm}
                />
                <EncryptionPanel
                  algorithm={selectedAlgorithm}
                  onEncrypt={handleEncrypt}
                />
              </TabsContent>

              {/* File Encryption Tab */}
              <TabsContent value="files" className="space-y-6">
                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={setSelectedAlgorithm}
                />
                <FileEncryption
                  algorithm={selectedAlgorithm}
                  onFileEncrypt={handleFileEncrypt}
                />
              </TabsContent>

              {/* Key Management Tab */}
              <TabsContent value="keys" className="space-y-6">
                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={setSelectedAlgorithm}
                />
                <KeyManagement algorithm={selectedAlgorithm} />
              </TabsContent>

              {/* Certificate Management Tab */}
              <TabsContent value="certificates" className="space-y-6">
                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={setSelectedAlgorithm}
                />
                <CertificateManager algorithm={selectedAlgorithm} />
              </TabsContent>

              {/* Network Security Tab */}
              <TabsContent value="network" className="space-y-6">
                <NetworkSecurity />
              </TabsContent>

              {/* Quantum Simulator Tab */}
              <TabsContent value="simulator" className="space-y-6">
                <QuantumSimulator />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <SecurityVisualization />
              </TabsContent>

              {/* Threat Analysis Tab */}
              <TabsContent value="threat" className="space-y-6">
                <QuantumThreatMeter />
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <ActivityLog activities={activities} />
              </TabsContent>
            </Tabs>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-3">About Post-Quantum Cryptography</h3>
              <p className="text-purple-100 text-sm leading-relaxed mb-4">
                Post-quantum cryptography (PQC) refers to cryptographic algorithms that are secure against 
                attacks by quantum computers. As quantum computing advances, traditional cryptographic 
                methods like RSA and ECC will become vulnerable. This prototype demonstrates quantum-resistant 
                algorithms standardized by NIST, including lattice-based, hash-based, and code-based schemes.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="font-medium text-purple-200">NIST Standards</p>
                  <p className="text-purple-100/70 text-xs mt-1">
                    Kyber, Dilithium, and SPHINCS+ are NIST-approved PQC algorithms
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="font-medium text-blue-200">Quantum Threat</p>
                  <p className="text-blue-100/70 text-xs mt-1">
                    Expected by 2030, requiring migration to quantum-safe cryptography
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="font-medium text-green-200">Future-Proof</p>
                  <p className="text-green-100/70 text-xs mt-1">
                    PQC provides security against both classical and quantum attacks
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
      )}
    </>
  );
}

export default App;