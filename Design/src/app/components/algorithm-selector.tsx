import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Shield, Zap, Award } from "lucide-react";

export type AlgorithmType = "CRYSTALS-Kyber" | "CRYSTALS-Dilithium" | "SPHINCS+" | "NTRU" | "SABER" | "FrodoKEM";

interface Algorithm {
  id: AlgorithmType;
  name: string;
  type: string;
  security: string;
  speed: string;
  description: string;
}

const algorithms: Algorithm[] = [
  {
    id: "CRYSTALS-Kyber",
    name: "CRYSTALS-Kyber",
    type: "KEM",
    security: "NIST Level 3",
    speed: "Fast",
    description: "Lattice-based key encapsulation mechanism. NIST standard for encryption."
  },
  {
    id: "CRYSTALS-Dilithium",
    name: "CRYSTALS-Dilithium",
    type: "Digital Signature",
    security: "NIST Level 3",
    speed: "Fast",
    description: "Lattice-based digital signature scheme. NIST standard for signatures."
  },
  {
    id: "SPHINCS+",
    name: "SPHINCS+",
    type: "Digital Signature",
    security: "NIST Level 5",
    speed: "Moderate",
    description: "Hash-based signature scheme. Stateless and conservative security."
  },
  {
    id: "NTRU",
    name: "NTRU",
    type: "KEM",
    security: "NIST Level 1",
    speed: "Very Fast",
    description: "Lattice-based encryption. One of the oldest post-quantum schemes."
  },
  {
    id: "SABER",
    name: "SABER",
    type: "KEM",
    security: "NIST Level 3",
    speed: "Fast",
    description: "Module lattice-based key encapsulation. Efficient and simple."
  },
  {
    id: "FrodoKEM",
    name: "FrodoKEM",
    type: "KEM",
    security: "NIST Level 5",
    speed: "Slow",
    description: "Conservative lattice-based KEM. Maximum security with larger keys."
  }
];

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
}

export function AlgorithmSelector({ selectedAlgorithm, onAlgorithmChange }: AlgorithmSelectorProps) {
  const currentAlgorithm = algorithms.find(a => a.id === selectedAlgorithm);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post-Quantum Algorithm</CardTitle>
        <CardDescription>Select a quantum-resistant cryptographic algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedAlgorithm} onValueChange={(value) => onAlgorithmChange(value as AlgorithmType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            {algorithms.map((algo) => (
              <SelectItem key={algo.id} value={algo.id}>
                {algo.name} ({algo.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentAlgorithm && (
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {currentAlgorithm.security}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {currentAlgorithm.speed}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                {currentAlgorithm.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentAlgorithm.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
