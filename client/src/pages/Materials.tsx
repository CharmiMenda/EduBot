import { useState } from "react";
import { useMaterials } from "@/hooks/use-placement";
import { Search, Filter, BookOpen, ExternalLink, Code, FileText, PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Materials() {
  const [filter, setFilter] = useState("All");
  const { data: materials, isLoading } = useMaterials();

  const categories = ["All", "Aptitude", "Coding", "System Design", "Interview Prep"];

  const filteredMaterials = materials?.filter(m => 
    filter === "All" || m.category.toLowerCase() === filter.toLowerCase()
  ) || [];

  const getIconForCategory = (category: string) => {
    if (category.toLowerCase().includes('coding')) return <Code className="w-6 h-6" />;
    if (category.toLowerCase().includes('interview')) return <PlayCircle className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary p-8 rounded-3xl text-primary-foreground relative overflow-hidden">
        {/* stock image abstract subtle bg */}
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop" 
          alt="Study materials background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
        />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-display font-bold">Preparation Materials</h1>
          <p className="text-primary-foreground/80 mt-2 text-lg">Curated resources to help you crack technical rounds and interviews.</p>
        </div>
        <div className="relative z-10 w-full md:w-72 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md flex items-center border border-white/20">
          <Search className="w-5 h-5 ml-3 text-white/70" />
          <input 
            placeholder="Search topics..." 
            className="bg-transparent border-none outline-none text-white placeholder:text-white/60 px-3 w-full h-10"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-200 border ${
              filter === cat 
              ? 'bg-foreground text-background border-foreground shadow-md' 
              : 'bg-card text-foreground border-border hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">Loading resources...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material, i) => (
            <motion.div 
              key={material.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-3xl p-6 border border-border hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary border border-border">
                  {getIconForCategory(material.category)}
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-secondary rounded-full text-foreground border border-border">
                  {material.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 leading-tight">{material.title}</h3>
              <p className="text-sm font-medium text-primary mb-4">{material.role}</p>
              
              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                {material.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <Button asChild className="w-full rounded-xl gap-2 shadow-md shadow-black/5" variant="outline">
                <a href={material.link} target="_blank" rel="noopener noreferrer">
                  Access Resource <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          ))}
          {filteredMaterials.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No materials found for this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
