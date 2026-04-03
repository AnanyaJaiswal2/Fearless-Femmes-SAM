import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";
import MenstrualTracker from "@/components/health/MenstrualTracker";
import MoodTracker from "@/components/health/MoodTracker";
import EmotionalInsights from "@/components/health/EmotionalInsights";
import HealthResources from "@/components/health/HealthResources";
import MythFacts from "@/components/health/MythFacts";
import HealthHelplines from "@/components/health/HealthHelplines";
import { useState } from "react";

const Health = () => {
  const [insightsKey, setInsightsKey] = useState(0);

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section
        className="section-padding relative bg-cover bg-right"
        style={{
          backgroundImage: "url('/images/health-banner.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>

        <div className="container-narrow relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Your Health,{" "}
              <span className="text-gradient">Your Power</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg text-muted-foreground max-w-lg"
            >
              Track your wellness, access health resources, and take charge of your physical and mental health.
            </motion.p>

          </motion.div>
        </div>
      </section>

      {/* ================= MENSTRUAL TRACKER ================= */}
      <section className="section-padding">
        <div className="container-narrow">
          <MenstrualTracker />
        </div>
      </section>

      {/* ================= MOOD TRACKER + INSIGHTS ================= */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MoodTracker onMoodLogged={() => setInsightsKey((k) => k + 1)} />
            <EmotionalInsights key={insightsKey} />
          </div>
        </div>
      </section>

      {/* ================= HEALTH RESOURCES ================= */}
      <section className="section-padding">
        <div className="container-narrow">
          <HealthResources />
        </div>
      </section>

      {/* ================= MYTH VS FACT ================= */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <MythFacts />
        </div>
      </section>

      {/* ================= HELPLINES ================= */}
      <section className="section-padding">
        <div className="container-narrow">
          <HealthHelplines />
        </div>
      </section>
    </Layout>
  );
};

export default Health;