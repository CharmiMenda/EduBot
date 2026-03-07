import { useAuth } from "@/hooks/use-auth";
import { usePlacementEvents, useTestResults } from "@/hooks/use-placement";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Target, Award, Building2, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading } = usePlacementEvents();
  const { data: tests, isLoading: testsLoading } = useTestResults();

  if (eventsLoading || testsLoading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()).slice(0, 3) || [];
  const recentTests = tests?.slice(0, 3) || [];
  
  const avgScore = tests?.length ? Math.round(tests.reduce((acc, t) => acc + t.score, 0) / tests.length) : 0;
  const avgAccuracy = tests?.length ? Math.round(tests.reduce((acc, t) => acc + t.accuracy, 0) / tests.length) : 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here is your placement preparation overview.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <Target className="w-4 h-4" /> Goal: Software Engineer
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tests Taken", value: tests?.length || 0, icon: BookOpen },
          { label: "Avg. Score", value: `${avgScore}%`, icon: Award },
          { label: "Accuracy", value: `${avgAccuracy}%`, icon: Target },
          { label: "Upcoming Drives", value: upcomingEvents.length, icon: Building2 },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
            <h2 className="text-xl font-bold flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-primary"/> Upcoming Drives</h2>
            <Link href="/calendar" className="text-sm font-medium text-primary hover:underline flex items-center">View All <ChevronRight className="w-4 h-4"/></Link>
          </div>
          <div className="p-6 space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No upcoming events scheduled.</p>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="flex gap-4 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors border border-transparent hover:border-border cursor-default group">
                  <div className="w-14 h-14 bg-background rounded-xl border border-border flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-primary uppercase">{format(new Date(event.date), 'MMM')}</span>
                    <span className="text-lg font-bold leading-none">{format(new Date(event.date), 'dd')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{event.company.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> {event.role}
                    </p>
                    <p className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded mt-2 inline-block">
                      Deadline: {format(new Date(event.deadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
            <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/> Recent Tests</h2>
            <Link href="/tests" className="text-sm font-medium text-primary hover:underline flex items-center">View Analytics <ChevronRight className="w-4 h-4"/></Link>
          </div>
          <div className="p-6 space-y-4">
            {recentTests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Take a test to see your performance here.</p>
            ) : (
              recentTests.map((test, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                  <div>
                    <h3 className="font-bold">{test.testType}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Completed {format(new Date(test.createdAt || Date.now()), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{test.score}%</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Quick hack to reuse icons without adding them to imports constantly
function BookOpen(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function Briefcase(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
