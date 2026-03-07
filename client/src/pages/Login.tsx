import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, isLoginPending, register, isRegisterPending } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      register(formData);
    } else {
      login({ email: formData.email, password: formData.password });
    }
  };

  const isPending = isLoginPending || isRegisterPending;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors w-fit mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-6 shadow-xl shadow-primary/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            {isRegistering 
              ? "Join your peers and accelerate your placement journey." 
              : "Sign in to continue your placement preparation."}
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="space-y-5"
        >
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                required={isRegistering}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">College Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="student@college.edu" 
              className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              value={formData.password}
              onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl text-lg font-medium shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
            {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {isRegistering ? "Create Account" : "Sign In"}
          </Button>

          <p className="text-center text-muted-foreground mt-6">
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button 
              type="button" 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary font-semibold hover:underline"
            >
              {isRegistering ? "Sign in" : "Register now"}
            </button>
          </p>
        </motion.form>
      </div>
      
      {/* Visual side panel */}
      <div className="hidden md:flex w-1/2 bg-primary p-12 text-primary-foreground flex-col justify-between relative overflow-hidden">
        {/* stock image of abstract shapes or college setting */}
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop" 
          alt="Students collaborating" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent mix-blend-multiply" />
        
        <div className="relative z-10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/50" />
            <div className="w-3 h-3 rounded-full bg-white/50" />
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
        </div>
        <div className="relative z-10">
          <blockquote className="text-3xl font-display font-medium leading-tight mb-6">
            "The platform gave me exactly what I needed to crack my dream company. The mock tests and materials are unparalleled."
          </blockquote>
          <p className="text-primary-foreground/80 font-medium">Sarah Jenkins, Placed at TechCorp</p>
        </div>
      </div>
    </div>
  );
}
