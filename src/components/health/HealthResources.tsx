import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categories = ["All", "Mental Health", "Reproductive Health", "Nutrition", "Wellness"];

const resources = [
  {
    title: "Managing Anxiety in Daily Life",
    category: "Mental Health",
    read: "5 min",
    summary: "Anxiety is a common experience, but it doesn't have to control your life. Learn practical strategies like grounding techniques, progressive muscle relaxation, and cognitive reframing to manage daily anxiety effectively.",
    tips: ["Practice the 5-4-3-2-1 grounding technique", "Limit caffeine and screen time before bed", "Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s"],
    link: "https://www.nimhans.ac.in",
  },
  {
    title: "Building Healthy Boundaries",
    category: "Mental Health",
    read: "7 min",
    summary: "Setting boundaries is essential for healthy relationships and mental well-being. Learn to identify your limits, communicate assertively, and handle pushback with grace.",
    tips: ["Start by identifying what makes you uncomfortable", "Use 'I' statements when expressing needs", "It's okay to say no without guilt"],
    link: null,
  },
  {
    title: "Understanding PCOS: A Complete Guide",
    category: "Reproductive Health",
    read: "10 min",
    summary: "Polycystic Ovary Syndrome affects 1 in 10 women. Understanding symptoms, hormonal imbalances, and management strategies can help you take control of your health.",
    tips: ["Maintain a balanced diet rich in whole foods", "Regular exercise helps manage insulin resistance", "Consult a gynecologist for personalized treatment"],
    link: "https://www.who.int/news-room/questions-and-answers/item/polycystic-ovary-syndrome",
  },
  {
    title: "Nutrition Tips for Hormonal Balance",
    category: "Nutrition",
    read: "6 min",
    summary: "What you eat directly impacts your hormonal health. Discover foods that support estrogen balance, thyroid function, and overall endocrine health.",
    tips: ["Include healthy fats like avocados and nuts", "Eat cruciferous vegetables for estrogen metabolism", "Avoid excessive sugar and processed foods"],
    link: null,
  },
  {
    title: "Yoga for Stress Relief",
    category: "Wellness",
    read: "8 min",
    summary: "Yoga combines physical postures, breathing exercises, and meditation to reduce stress and improve well-being. Even 15 minutes daily can make a significant difference.",
    tips: ["Start with gentle stretches like Cat-Cow", "Focus on deep breathing during practice", "Consistency matters more than intensity"],
    link: null,
  },
  {
    title: "Iron Deficiency in Women",
    category: "Nutrition",
    read: "5 min",
    summary: "Iron deficiency is the most common nutritional deficiency worldwide, particularly affecting menstruating women. Learn to recognize symptoms and boost iron intake naturally.",
    tips: ["Pair iron-rich foods with vitamin C for better absorption", "Consider an iron supplement if levels are low", "Eat spinach, lentils, and fortified cereals regularly"],
    link: null,
  },
  {
    title: "Cervical Health Awareness",
    category: "Reproductive Health",
    read: "7 min",
    summary: "Regular screening and awareness about cervical health can prevent cervical cancer. Understand Pap smears, HPV vaccination, and warning signs to watch for.",
    tips: ["Get regular Pap smears as recommended", "Consider HPV vaccination if eligible", "Report unusual symptoms to your doctor promptly"],
    link: null,
  },
  {
    title: "Sleep Hygiene for Better Health",
    category: "Wellness",
    read: "6 min",
    summary: "Quality sleep is foundational to physical and mental health. Simple changes to your sleep environment and habits can dramatically improve sleep quality.",
    tips: ["Maintain a consistent sleep schedule", "Keep your room cool and dark", "Avoid screens 1 hour before bed"],
    link: null,
  },
];

const HealthResources = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null);

  const filtered = resources.filter((r) => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h3 className="text-2xl font-bold mb-4 text-center">Health Resources</h3>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((r) => (
              <motion.div key={r.title} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                onClick={() => setSelectedResource(r)}
                className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{r.category}</span>
                <h4 className="font-semibold mt-2 mb-1">{r.title}</h4>
                <p className="text-xs text-muted-foreground">{r.read} read</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No resources found. Try a different search or filter.</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {selectedResource.category}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedResource.summary}</p>
              <div>
                <h5 className="text-sm font-semibold mb-2">Key Tips</h5>
                <ul className="space-y-2">
                  {selectedResource.tips.map((tip, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedResource.link && (
                <a href={selectedResource.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-xl gap-2 w-full">
                    <ExternalLink className="h-4 w-4" /> Learn More
                  </Button>
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HealthResources;
