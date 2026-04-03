import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, ExternalLink, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";

interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  stipend: string | null;
  apply_link: string | null;
  posted_date: string | null;
  work_type: string | null;
  field: string | null;
  is_women_focused: boolean;
}

const InternshipBoard = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("All");
  const [fieldFilter, setFieldFilter] = useState("All");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("internships").select("*").order("created_at", { ascending: false });
    if (!error && data) setInternships(data);
    setLoading(false);
  };

  const workTypes = ["All", ...new Set(internships.map((i) => i.work_type).filter(Boolean))];
  const fields = ["All", ...new Set(internships.map((i) => i.field).filter(Boolean))];

  const filtered = internships.filter((i) => {
    const matchSearch = !search || i.role.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase());
    const matchWork = workTypeFilter === "All" || i.work_type === workTypeFilter;
    const matchField = fieldFilter === "All" || i.field === fieldFilter;
    return matchSearch && matchWork && matchField;
  });

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold mb-3 text-center">
          Internship Opportunities
        </motion.h2>
        <motion.p variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-center mb-8">
          Curated women-focused internships across India
        </motion.p>

        {/* Filters */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-3 mb-6 items-center">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by role or company..." className="rounded-xl max-w-xs" />
          <div className="flex gap-2 flex-wrap">
            {workTypes.map((wt) => (
              <button key={wt} onClick={() => setWorkTypeFilter(wt as string)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${workTypeFilter === wt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>
                {wt}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {fields.map((f) => (
              <button key={f} onClick={() => setFieldFilter(f as string)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${fieldFilter === f ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-accent/20"}`}>
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading internships...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((intern, i) => (
              <motion.div key={intern.id} variants={fadeUp} custom={i % 6} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${intern.is_women_focused ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {intern.is_women_focused ? "Women-Focused" : "Open to All"}
                  </span>
                  {intern.work_type && <span className="text-xs text-muted-foreground">{intern.work_type}</span>}
                </div>
                <h3 className="font-semibold text-sm mt-2">{intern.role}</h3>
                <p className="text-xs text-muted-foreground mt-1">{intern.company}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {intern.location}
                </div>
                {intern.stipend && <p className="text-xs font-medium text-primary mt-2">{intern.stipend}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{intern.posted_date || "Recent"}</span>
                  {intern.apply_link && (
                    <a href={intern.apply_link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto gap-1 text-xs">
                        Apply <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No internships match your filters.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default InternshipBoard;
