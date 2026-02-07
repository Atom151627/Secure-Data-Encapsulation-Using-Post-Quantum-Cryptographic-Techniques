import { Shield, Lock, Key, Activity, TrendingUp, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface DashboardProps {
  stats: {
    totalEncryptions: number;
    activeKeys: number;
    dataEncapsulated: string;
    securityLevel: number;
  };
}

export function CryptoDashboard({ stats }: DashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Encryptions</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEncryptions}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3" /> +20% from last session
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
          <Key className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeKeys}</div>
          <p className="text-xs text-muted-foreground">
            Quantum-resistant pairs
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Encapsulated</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.dataEncapsulated}</div>
          <p className="text-xs text-muted-foreground">
            Secured with PQC
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Level</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.securityLevel}%</div>
          <p className="text-xs text-muted-foreground">
            <Activity className="inline h-3 w-3" /> Post-quantum ready
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
