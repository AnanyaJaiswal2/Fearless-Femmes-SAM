import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const mythFacts = [
  { myth: "Periods make women weak", fact: "Menstruation is a natural process and doesn't diminish strength or capability." },
  { myth: "PCOS only affects overweight women", fact: "PCOS can affect women of any body type — lean PCOS is common." },
  { myth: "Mental health issues are a sign of weakness", fact: "Mental health conditions are medical conditions that require care and support." },
];

const MythFacts = () => (
  <div className="max-w-3xl mx-auto">
    <motion.h3 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="text-2xl font-bold mb-6 text-center">Myth vs Fact</motion.h3>
    <div className="flex flex-col gap-6">
      {mythFacts.map((mf, i) => (
        <motion.div key={mf.myth} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="glass-card rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
              <div className="text-xs font-semibold text-destructive mb-2">❌ MYTH</div>
              <p className="text-sm">{mf.myth}</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="text-xs font-semibold text-primary mb-2">✅ FACT</div>
              <p className="text-sm">{mf.fact}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default MythFacts;
