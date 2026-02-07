import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Lock, Unlock, Key, Shield, Clock } from "lucide-react";
import { motion } from "motion/react";

interface Activity {
  id: string;
  type: "encryption" | "decryption" | "keygen" | "verify";
  algorithm: string;
  timestamp: Date;
  status: "success" | "failed";
}

interface ActivityLogProps {
  activities: Activity[];
}

const activityIcons = {
  encryption: Lock,
  decryption: Unlock,
  keygen: Key,
  verify: Shield
};

const activityColors = {
  encryption: "bg-blue-500/10 text-blue-500",
  decryption: "bg-green-500/10 text-green-500",
  keygen: "bg-purple-500/10 text-purple-500",
  verify: "bg-amber-500/10 text-amber-500"
};

const activityLabels = {
  encryption: "Encrypted",
  decryption: "Decrypted",
  keygen: "Key Generated",
  verify: "Verified"
};

export function ActivityLog({ activities }: ActivityLogProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <CardDescription>Recent cryptographic operations</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No recent activity</p>
              <p className="text-sm">Perform cryptographic operations to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const colorClass = activityColors[activity.type];
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">
                          {activityLabels[activity.type]}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.algorithm}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                    <Badge 
                      variant={activity.status === "success" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
