import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Building, Palette, GraduationCap, Loader2, ChevronDown, ChevronUp, BookOpen, Award, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categories = [
  { icon: Code, title: "Women in Tech", paths: ["Frontend Dev", "Data Science", "AI/ML", "Cybersecurity"], color: "bg-primary/10 text-primary" },
  { icon: Building, title: "Business & Entrepreneurship", paths: ["Startup Founder", "Marketing", "Finance", "Consulting"], color: "bg-accent/20 text-accent-foreground" },
  { icon: Palette, title: "Design & Creative", paths: ["UI/UX Design", "Graphic Design", "Content Creation", "Animation"], color: "bg-secondary text-secondary-foreground" },
  { icon: GraduationCap, title: "Government & Public Sector", paths: ["Civil Services", "Banking", "Teaching", "Law"], color: "bg-muted text-foreground" },
];

interface Roadmap {
  skills: string[];
  learningPath: { step: number; title: string; description: string }[];
  resources: string[];
  certifications: string[];
  timeline: string;
  growthScope: string;
}

const CareerRoadmaps = () => {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchRoadmap = async (career: string) => {
    if (selectedCareer === career && roadmap) {
      setSelectedCareer(null);
      setRoadmap(null);
      return;
    }
    setSelectedCareer(career);
    setLoading(true);
    setRoadmap(null);
    try {
      const { data, error } = await supabase.functions.invoke("career-roadmap", {
        body: { career },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRoadmap(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold mb-3 text-center">
          AI-Powered Career Roadmaps
        </motion.h2>
        <motion.p variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-center mb-8">
          Click any career path to generate a personalized roadmap
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.paths.map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchRoadmap(p)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                        selectedCareer === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Generating roadmap for {selectedCareer}...</span>
          </div>
        )}

        {/* Roadmap Display */}
        {roadmap && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-6">
            <h3 className="text-2xl font-bold text-center">{selectedCareer} Roadmap</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Timeline</span>
                </div>
                <p className="text-muted-foreground text-sm">{roadmap.timeline}</p>
              </div>
              <div className="glass-card rounded-2xl p-5 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Growth Scope</span>
                </div>
                <p className="text-muted-foreground text-sm">{roadmap.growthScope}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-semibold mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {roadmap.skills?.map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">{s}</span>
                ))}
              </div>
            </div>

            {/* Learning Path */}
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-semibold mb-4">Step-by-Step Learning Path</h4>
              <div className="space-y-4">
                {roadmap.learningPath?.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources & Certs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Resources</h4>
                </div>
                <ul className="space-y-2">
                  {roadmap.resources?.map((r) => (
                    <li key={r} className="text-sm text-muted-foreground">• {r}</li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Certifications</h4>
                </div>
                <ul className="space-y-2">
                  {roadmap.certifications?.map((c) => (
                    <li key={c} className="text-sm text-muted-foreground">• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CareerRoadmaps;
