import { Link } from "wouter";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Briefcase, BookOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-[150px]" />
      </div>

      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-display font-bold text-2xl text-primary">
          <GraduationCap className="w-8 h-8" />
          <span>Nexus</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="rounded-full px-6" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-20 pb-32 max-w-7xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 border border-primary/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Placement Season 2025 is Live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-extrabold tracking-tight max-w-4xl text-foreground"
        >
          Accelerate Your <br/>
          <span className="text-gradient">Career Journey</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl text-muted-foreground max-w-2xl"
        >
          The ultimate platform for college students to prepare, track, and succeed in campus placements. Expert materials, mock tests, and company tracking all in one place.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/25 hover:scale-105 transition-transform" asChild>
            <Link href="/login">
              Start Preparing <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          {[
            { icon: Briefcase, title: "Company Tracking", desc: "Never miss a deadline. Get real-time updates on eligibility and selection processes." },
            { icon: BookOpen, title: "Curated Materials", desc: "Access high-quality preparation materials sorted by roles and categories." },
            { icon: ShieldCheck, title: "Mock Assessments", desc: "Practice with timed tests and detailed analytics to improve your accuracy." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
              className="bg-card p-8 rounded-3xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
