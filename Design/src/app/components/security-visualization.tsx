import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Shield } from "lucide-react";

const securityData = [
  { time: "00:00", classical: 45, quantum: 95 },
  { time: "04:00", classical: 42, quantum: 96 },
  { time: "08:00", classical: 38, quantum: 97 },
  { time: "12:00", classical: 35, quantum: 98 },
  { time: "16:00", classical: 30, quantum: 98 },
  { time: "20:00", classical: 25, quantum: 99 },
  { time: "24:00", classical: 20, quantum: 99 }
];

const algorithmComparison = [
  { name: "Kyber", keySize: 1568, encSpeed: 95, decSpeed: 93, security: 98 },
  { name: "Dilithium", keySize: 2592, encSpeed: 92, decSpeed: 94, security: 99 },
  { name: "SPHINCS+", keySize: 64, encSpeed: 65, decSpeed: 70, security: 100 },
  { name: "NTRU", keySize: 1230, encSpeed: 98, decSpeed: 96, security: 85 },
  { name: "SABER", keySize: 1568, encSpeed: 96, decSpeed: 95, security: 96 },
  { name: "FrodoKEM", keySize: 21520, encSpeed: 60, decSpeed: 62, security: 100 }
];

export function SecurityVisualization() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Strength Over Time
          </CardTitle>
          <CardDescription>Classical vs Post-Quantum Cryptography</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={securityData}>
              <defs>
                <linearGradient id="colorClassical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorQuantum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="classical" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorClassical)" 
                name="Classical Security %"
              />
              <Area 
                type="monotone" 
                dataKey="quantum" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorQuantum)" 
                name="Post-Quantum Security %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Algorithm Performance Comparison</CardTitle>
          <CardDescription>Speed and security metrics across PQC algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={algorithmComparison}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="encSpeed" fill="#3b82f6" name="Encryption Speed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="security" fill="#10b981" name="Security Level" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
