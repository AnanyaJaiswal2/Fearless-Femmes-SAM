import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ExternalLink, Search, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";

interface Scholarship {
  id: string;
  name: string;
  eligibility: string;
  deadline: string | null;
  benefits: string | null;
  apply_link: string | null;
  category: string | null;
  level: string | null;
}

const ScholarshipBoard = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sortByDeadline, setSortByDeadline] = useState(false);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("scholarships").select("*").order("created_at", { ascending: false });
    if (!error && data) setScholarships(data);
    setLoading(false);
  };

  let filtered = scholarships.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.eligibility.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "All" || s.level === levelFilter;
    return matchSearch && matchLevel;
  });

  if (sortByDeadline) {
    filtered = [...filtered].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold mb-3 text-center">
          <GraduationCap className="inline h-7 w-7 mr-2 text-primary" />
          Scholarships
        </motion.h2>
        <motion.p variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-center mb-8">
          Women-specific and general scholarships for your education journey
        </motion.p>

        <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-3 mb-6 items-center">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scholarships..." className="rounded-xl max-w-xs" />
          <div className="flex gap-2">
            {["All", "UG", "PG"].map((lvl) => (
              <button key={lvl} onClick={() => setLevelFilter(lvl)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${levelFilter === lvl ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>
                {lvl}
              </button>
            ))}
          </div>
          <button onClick={() => setSortByDeadline(!sortByDeadline)}
            className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors ${sortByDeadline ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-accent/20"}`}>
            <Calendar className="h-3 w-3" /> Sort by Deadline
          </button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading scholarships...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((sch, i) => (
              <motion.div key={sch.id} variants={fadeUp} custom={i % 4} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sch.category === "Women-specific" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {sch.category}
                  </span>
                  {sch.level && <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{sch.level}</span>}
                </div>
                <h3 className="font-semibold mt-2 mb-2">{sch.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{sch.eligibility}</p>
                {sch.benefits && <p className="text-sm font-medium text-primary mb-2">{sch.benefits}</p>}
                <div className="flex items-center justify-between mt-3">
                  {sch.deadline && <span className="text-xs text-muted-foreground">Deadline: {sch.deadline}</span>}
                  {sch.apply_link && (
                    <a href={sch.apply_link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto gap-1 text-xs">
                        Apply <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No scholarships match your search.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScholarshipBoard;
