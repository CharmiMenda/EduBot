import { useState } from "react";
import { useTestResults, useSubmitTestResult } from "@/hooks/use-placement";
import { PlayCircle, Target, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function PracticeTests() {
  const { data: results, isLoading } = useTestResults();
  const { mutate: submitResult, isPending } = useSubmitTestResult();
  const [activeTest, setActiveTest] = useState<string | null>(null);

  // Mock taking a test
  const handleCompleteTest = () => {
    if (!activeTest) return;
    submitResult({
      testType: activeTest,
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      accuracy: Math.floor(Math.random() * 30) + 70, // 70-100
      timeTaken: Math.floor(Math.random() * 30) + 15, // 15-45 mins
    }, {
      onSuccess: () => setActiveTest(null)
    });
  };

  const chartData = results?.map(r => ({
    name: r.testType.substring(0, 10) + '...',
    score: r.score,
    accuracy: r.accuracy
  })) || [];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold">Practice Arena</h1>
        <p className="text-muted-foreground mt-2">Take mock tests and track your improvement over time.</p>
      </div>

      {activeTest ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border p-12 rounded-3xl text-center shadow-lg max-w-2xl mx-auto mt-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ongoing: {activeTest}</h2>
          <p className="text-muted-foreground mb-8">This is a simulated test environment. In a real app, the actual test UI would render here.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={() => setActiveTest(null)} className="rounded-xl border-border">Cancel</Button>
            <Button size="lg" onClick={handleCompleteTest} disabled={isPending} className="rounded-xl shadow-lg shadow-primary/20">
              {isPending ? "Submitting..." : "Submit & View Results"}
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Aptitude & Logical", "Data Structures & Algos", "System Design Mock"].map((test, i) => (
              <motion.div 
                key={test}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-3xl p-6 border border-border hover:border-primary/50 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{test}</h3>
                <p className="text-sm text-muted-foreground mb-6">45 mins • 30 Questions • Hard</p>
                <Button onClick={() => setActiveTest(test)} className="w-full rounded-xl gap-2 shadow-md">
                  <PlayCircle className="w-4 h-4" /> Start Test
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="w-6 h-6 text-primary" /> Performance Analytics</h2>
            </div>
            
            {results && results.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: 'hsl(var(--secondary))'}}
                      contentStyle={{backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="score" name="Score %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Complete a test to generate performance analytics.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
