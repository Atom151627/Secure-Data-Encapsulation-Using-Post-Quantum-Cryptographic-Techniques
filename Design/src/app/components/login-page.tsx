import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Shield, Lock, Eye, EyeOff, Fingerprint, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: () => void;
}

const VALID_USERNAME = "Adithya";
const VALID_PASSWORD = "12234";

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      toast.success("Authentication successful! Welcome back.", {
        icon: <Shield className="h-4 w-4 text-green-500" />
      });
      onLogin();
    } else {
      toast.error("Authentication failed. Invalid credentials.", {
        icon: <Lock className="h-4 w-4 text-red-500" />
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,50,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,50,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px]"
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 mb-6 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {/* Glowing Ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 opacity-50 blur-xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative p-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </motion.div>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Post-Quantum Cryptography
          </h1>
          <p className="text-purple-200/80 text-sm">
            Secure Data Encapsulation Platform
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-purple-500/10">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold text-white text-center">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-white/50">
                Enter your credentials to access the secure dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <motion.div 
                  className="space-y-2"
                  animate={{ scale: focusedField === 'username' ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="username" className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-purple-400" />
                    Username
                  </Label>
                  <div className="relative group">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10 h-12 transition-all duration-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                      required
                    />
                    <motion.div
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  className="space-y-2"
                  animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="password" className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-400" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-12 h-12 transition-all duration-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1 rounded-md hover:bg-white/10"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <motion.div
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-500 hover:via-purple-400 hover:to-blue-400 text-white font-semibold text-base shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        </motion.div>
                        <span>Authenticating...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Lock className="h-5 w-5" />
                        <span>Sign In Securely</span>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>End-to-End Encrypted</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-white/30 text-xs mt-8"
        >
          Protected by Post-Quantum Cryptographic Algorithms
        </motion.p>
      </motion.div>
    </div>
  );
}
