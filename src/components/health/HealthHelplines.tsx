import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { fadeUp } from "@/lib/animations";

const helplines = [
  { name: "iCall (TISS)", number: "9152987821", desc: "Psychosocial helpline" },
  { name: "Vandrevala Foundation", number: "1860-2662-345", desc: "Mental health support 24/7" },
  { name: "Women Helpline", number: "181", desc: "National women helpline" },
  { name: "NIMHANS", number: "080-46110007", desc: "Mental health counseling" },
];

const HealthHelplines = () => (
  <div>
    <motion.h3 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="text-2xl font-bold mb-6 text-center">Helpline Directory</motion.h3>
    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
      {helplines.map((h, i) => (
        <motion.div key={h.number} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">{h.name}</div>
              <div className="text-xs text-muted-foreground">{h.desc}</div>
            </div>
          </div>
          <a href={`tel:${h.number}`} className="font-bold text-primary">{h.number}</a>
        </motion.div>
      ))}
    </div>
  </div>
);

export default HealthHelplines;
