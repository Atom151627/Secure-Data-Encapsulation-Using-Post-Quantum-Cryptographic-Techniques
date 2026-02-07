import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Cpu, Zap, AlertCircle, Play, Pause, RotateCcw } from "lucide-react";
import { Progress } from "./ui/progress";
import { motion, AnimatePresence } from "motion/react";

interface QuantumAttack {
  name: string;
  algorithm: string;
  progress: number;
  success: boolean;
  time: number;
}

export function QuantumSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [attacks, setAttacks] = useState<QuantumAttack[]>([]);
  const [qubits, setQubits] = useState(50);

  const classicalAlgorithms = ["RSA-2048", "ECC-256", "AES-128"];
  const pqcAlgorithms = ["CRYSTALS-Kyber", "CRYSTALS-Dilithium", "SPHINCS+"];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAttacks(prev => {
        return prev.map(attack => {
          if (attack.progress >= 100) return attack;

          const increment = attack.algorithm.startsWith("CRYSTALS") || 
                          attack.algorithm === "SPHINCS+" ? 0.1 : 5;
          const newProgress = Math.min(attack.progress + increment, 100);
          
          return {
            ...attack,
            progress: newProgress,
            success: newProgress >= 100,
            time: attack.time + 0.1
          };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startSimulation = () => {
    const newAttacks: QuantumAttack[] = [
      ...classicalAlgorithms.map(algo => ({
        name: `Quantum Attack on ${algo}`,
        algorithm: algo,
        progress: 0,
        success: false,
        time: 0
      })),
      ...pqcAlgorithms.map(algo => ({
        name: `Quantum Attack on ${algo}`,
        algorithm: algo,
        progress: 0,
        success: false,
        time: 0
      }))
    ];

    setAttacks(newAttacks);
    setIsRunning(true);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setAttacks([]);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Quantum Computer Simulator
          </CardTitle>
          <CardDescription>
            Simulate quantum attacks on classical vs post-quantum algorithms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Quantum Qubits: {qubits}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={qubits}
                onChange={(e) => setQubits(Number(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {qubits} qubits
            </Badge>
          </div>

          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={startSimulation} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </Button>
            ) : (
              <Button onClick={pauseSimulation} variant="secondary" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetSimulation} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {attacks.length > 0 && (
            <div className="space-y-3 mt-6">
              <h4 className="text-sm font-semibold">Attack Progress</h4>
              <AnimatePresence mode="popLayout">
                {attacks.map((attack, index) => {
                  const isPQC = pqcAlgorithms.includes(attack.algorithm);
                  return (
                    <motion.div
                      key={attack.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border ${
                        isPQC ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={isPQC ? "default" : "destructive"} className="text-xs">
                            {attack.algorithm}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {attack.time.toFixed(1)}s
                          </span>
                        </div>
                        {attack.success && (
                          <Badge variant={isPQC ? "outline" : "destructive"} className="text-xs">
                            {isPQC ? "Resisted" : "Broken"}
                          </Badge>
                        )}
                      </div>
                      <Progress 
                        value={attack.progress} 
                        className={`h-2 ${isPQC ? "" : "[&>div]:bg-red-500"}`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {attack.progress < 100 
                          ? `Breaking: ${attack.progress.toFixed(1)}%`
                          : isPQC 
                            ? "Still secure against quantum attacks"
                            : "Successfully broken by quantum computer"}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {attacks.length === 0 && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                Configure qubits and start the simulation to see quantum attacks in action
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Quantum Visualization</CardTitle>
          <CardDescription>Real-time quantum cryptography simulation</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[500px] w-full relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20 overflow-hidden">
            {/* Animated quantum particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-500 rounded-full"
                  animate={{
                    x: [
                      Math.random() * 100 + "%",
                      Math.random() * 100 + "%",
                      Math.random() * 100 + "%"
                    ],
                    y: [
                      Math.random() * 100 + "%",
                      Math.random() * 100 + "%",
                      Math.random() * 100 + "%"
                    ],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{
                    duration: 5 + i * 0.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>

            {/* Center quantum sphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="relative w-40 h-40"
                animate={{
                  rotate: isRunning ? 360 : 0
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Orbital rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-2 rounded-full"
                    style={{
                      borderColor: i === 0 ? "#8b5cf6" : i === 1 ? "#3b82f6" : "#06b6d4",
                      transform: `rotate3d(${i === 0 ? 1 : 0}, ${i === 1 ? 1 : 0}, ${i === 2 ? 1 : 0}, ${45 + i * 30}deg)`
                    }}
                    animate={{
                      scale: isRunning ? [1, 1.2, 1] : 1,
                      opacity: isRunning ? [0.3, 0.8, 0.3] : 0.5
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                {/* Center core */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"
                  animate={{
                    scale: isRunning ? [1, 1.3, 1] : 1,
                    boxShadow: isRunning 
                      ? [
                          "0 0 20px rgba(139, 92, 246, 0.5)",
                          "0 0 40px rgba(139, 92, 246, 0.8)",
                          "0 0 20px rgba(139, 92, 246, 0.5)"
                        ]
                      : "0 0 20px rgba(139, 92, 246, 0.5)"
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>

            {/* Status text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <motion.p
                className="text-sm font-medium text-purple-200"
                animate={{
                  opacity: isRunning ? [0.5, 1, 0.5] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                {isRunning ? "Quantum Simulation Active" : "Quantum Simulation Idle"}
              </motion.p>
              {isRunning && (
                <motion.p
                  className="text-xs text-purple-300 mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {qubits} qubits processing...
                </motion.p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}