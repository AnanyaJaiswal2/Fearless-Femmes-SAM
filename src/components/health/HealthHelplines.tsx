import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { fadeUp } from "@/lib/animations";

const helplines = [
  {
    name: "Women Helpline (All India)",
    number: "181",
    desc: "24x7 support for women in distress",
  },
  {
    name: "Police Women Helpline",
    number: "1091",
    desc: "Immediate police help for women",
  },
  {
    name: "National Emergency",
    number: "112",
    desc: "Police, fire & ambulance",
  },
  {
    name: "NCW Helpline",
    number: "7827170170",
    desc: "National Commission for Women support",
  },
  {
    name: "Women Power Line",
    number: "1090",
    desc: "Anti-stalking & harassment support",
  },
  {
    name: "Cyber Crime Helpline",
    number: "155260",
    desc: "Report online harassment or fraud",
  },
  {
    name: "KIRAN Mental Health",
    number: "9152987821",
    desc: "24x7 emotional support",
  },
  {
    name: "Vandrevala Foundation",
    number: "9999666555",
    desc: "24x7 mental health support",
  },
  {
    name: "NIMHANS",
    number: "08046110007",
    desc: "Mental health counseling",
  },
];

const HealthHelplines = () => (
  <div>
    {/* Title */}
    <motion.h3
      variants={fadeUp}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-2xl font-bold mb-6 text-center"
    >
      Emergency & Support Helplines
    </motion.h3>

    {/* List */}
    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
      {helplines.map((h, i) => (
        <motion.div
          key={h.number}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">{h.name}</div>
              <div className="text-xs text-muted-foreground">
                {h.desc}
              </div>
            </div>
          </div>

          {/* Right - Click to Call */}
          <a
            href={`tel:${h.number}`}
            className="font-bold text-primary hover:underline"
          >
            {h.number}
          </a>
        </motion.div>
      ))}
    </div>
  </div>
);

export default HealthHelplines;