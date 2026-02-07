import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { AlertTriangle, Shield, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

interface ThreatLevel {
  level: number;
  label: string;
  description: string;
  color: string;
}

const threatLevels: ThreatLevel[] = [
  {
    level: 20,
    label: "Low Risk",
    description: "Post-quantum algorithms provide strong protection",
    color: "text-green-500"
  },
  {
    level: 50,
    label: "Moderate Risk",
    description: "Hybrid cryptography recommended",
    color: "text-yellow-500"
  },
  {
    level: 80,
    label: "High Risk",
    description: "Immediate migration to PQC required",
    color: "text-orange-500"
  },
  {
    level: 95,
    label: "Critical Risk",
    description: "Classical encryption vulnerable to quantum attacks",
    color: "text-red-500"
  }
];

export function QuantumThreatMeter() {
  // Simulating current threat level (low because we're using PQC)
  const currentThreat = 15;
  const classicalThreat = 85;

  const getCurrentLevel = (threat: number): ThreatLevel => {
    return threatLevels.reduce((prev, curr) => {
      return threat >= curr.level ? curr : prev;
    }, threatLevels[0]);
  };

  const pqcLevel = getCurrentLevel(currentThreat);
  const classicalLevel = getCurrentLevel(classicalThreat);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Post-Quantum Protection
          </CardTitle>
          <CardDescription>Your current security posture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Quantum Threat Level</span>
              <span className={pqcLevel.color}>{currentThreat}%</span>
            </div>
            <Progress value={currentThreat} className="h-2" />
          </div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20"
          >
            <Shield className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-green-500">{pqcLevel.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {pqcLevel.description}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-green-500">99%</p>
              <p className="text-xs text-muted-foreground">Security Rating</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-blue-500">2030+</p>
              <p className="text-xs text-muted-foreground">Years Protected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Classical Cryptography Risk
          </CardTitle>
          <CardDescription>Vulnerability to quantum computing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Quantum Threat Level</span>
              <span className={classicalLevel.color}>{classicalThreat}%</span>
            </div>
            <Progress value={classicalThreat} className="h-2" />
          </div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"
          >
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-orange-500">{classicalLevel.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {classicalLevel.description}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <p className="text-2xl font-bold text-red-500">15%</p>
              </div>
              <p className="text-xs text-muted-foreground">Security Rating</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-orange-500">2030</p>
              <p className="text-xs text-muted-foreground">Quantum Threat</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
