import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Briefcase, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CareerSuggestion {
  title: string;
  matchReason: string;
  requiredSkills: string[];
  salaryRange: string;
  growthScope: string;
  nextSteps: string[];
}

interface CareerGuideProps {
  onExploreRoadmap?: (career: string) => void;
}

const CareerGuide = ({ onExploreRoadmap }: CareerGuideProps) => {
  const [interests, setInterests] = useState("");
  const [strengths, setStrengths] = useState("");
  const [education, setEducation] = useState("");
  const [workStyle, setWorkStyle] = useState("");
  const [results, setResults] = useState<CareerSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!interests.trim() || !strengths.trim()) {
      toast.error("Please fill in at least your interests and strengths");
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("career-guide", {
        body: { interests, strengths, education, workStyle },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResults(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message || "Failed to get career suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-3">
            <Sparkles className="inline h-7 w-7 mr-2 text-primary" />
            AI Career Guide
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">
            Tell us about yourself — we'll recommend the best career paths for you
          </motion.p>
        </motion.div>

        <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Interests *</label>
              <Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., Technology, Art, Social Work..." className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Strengths *</label>
              <Input value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="e.g., Problem Solving, Communication..." className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Education Background</label>
              <Input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g., B.Tech CS, BA Economics..." className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Preferred Work Style</label>
              <Input value={workStyle} onChange={(e) => setWorkStyle(e.target.value)} placeholder="e.g., Remote, Creative, Structured..." className="rounded-xl" />
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="gradient-purple text-primary-foreground rounded-xl border-0 w-full gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Analyzing your profile..." : "Get Career Suggestions"}
          </Button>
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-center mb-6">Your Recommended Careers</h3>
            {results.map((career, i) => (
              <motion.div key={career.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-primary flex-shrink-0" />
                      <h4 className="font-bold text-lg">{career.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{career.matchReason}</p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {career.requiredSkills?.map((s) => (
                        <span key={s} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{s}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Salary Range:</span>
                        <span className="text-muted-foreground ml-1">{career.salaryRange}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium">Growth:</span>
                        </div>
                        <span className="text-muted-foreground text-xs">{career.growthScope}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="font-medium text-sm mb-1.5">Next Steps:</p>
                      <ol className="list-decimal list-inside space-y-0.5">
                        {career.nextSteps?.map((step) => (
                          <li key={step} className="text-xs text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
                {onExploreRoadmap && (
                  <Button onClick={() => onExploreRoadmap(career.title)} variant="outline" size="sm" className="mt-4 rounded-xl border-primary/30 text-primary">
                    Explore Roadmap →
                  </Button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CareerGuide;
