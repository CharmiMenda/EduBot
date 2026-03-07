import { useState } from "react";
import { usePlacementEvents } from "@/hooks/use-placement";
import { format, isSameMonth, parseISO } from "date-fns";
import { MapPin, Building2, Link as LinkIcon, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Calendar() {
  const { data: events, isLoading } = usePlacementEvents();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading calendar...</div>;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Filter events by selected month (ignoring year for this simple view, or strict if needed)
  const displayedEvents = events?.filter(e => new Date(e.date).getMonth() === selectedMonth)
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold">Placement Calendar</h1>
        <p className="text-muted-foreground mt-2">Track upcoming company drives and deadlines.</p>
      </div>

      {/* Month Selector */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {months.map((month, idx) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(idx)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedMonth === idx 
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105' 
              : 'bg-secondary text-secondary-foreground hover:bg-border'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayedEvents.length === 0 ? (
          <div className="bg-secondary/50 border-2 border-dashed border-border rounded-3xl p-12 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold">No Drives Scheduled</h3>
            <p className="text-muted-foreground mt-2">There are no placement events for this month.</p>
          </div>
        ) : (
          displayedEvents.map((event, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              key={event.id} 
              className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Decor strip */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center ml-2">
                {/* Date block */}
                <div className="shrink-0 text-center bg-secondary/50 p-4 rounded-2xl min-w-[100px]">
                  <p className="text-primary font-bold text-sm uppercase">{format(new Date(event.date), 'MMM')}</p>
                  <p className="text-3xl font-display font-bold my-1">{format(new Date(event.date), 'dd')}</p>
                  <p className="text-xs text-muted-foreground font-medium">{format(new Date(event.date), 'EEEE')}</p>
                </div>

                {/* Info block */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      {event.company.name}
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">Live</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium mt-1">{event.role}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-lg">
                      <DollarSign className="w-4 h-4 text-emerald-500" /> {event.company.packageInfo}
                    </div>
                    <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 text-amber-500" /> Deadline: {format(new Date(event.deadline), 'MMM dd')}
                    </div>
                  </div>
                </div>

                {/* Action block */}
                <div className="w-full md:w-auto shrink-0 self-stretch flex md:flex-col justify-end gap-2">
                  <Button className="w-full md:w-32 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Apply Now</Button>
                  <Button variant="outline" className="w-full md:w-32 rounded-xl border-border hover:bg-secondary">Details</Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
function CalendarIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>; }
