import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
      {/* Hero */}
      <section className="section-padding gradient-hero">
        <div className="container-narrow">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">
              Your Health, <span className="text-gradient">Your Power</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-lg">
              Track your wellness, access health resources, and take charge of your physical and mental health.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Menstrual Tracker */}
      <section className="section-padding">
        <div className="container-narrow">
          <MenstrualTracker />
        </div>
      </section>

      {/* Mood Tracker + Insights */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MoodTracker onMoodLogged={() => setInsightsKey((k) => k + 1)} />
            <EmotionalInsights key={insightsKey} />
          </div>
        </div>
      </section>
      {/* Health Resources */}
      <section className="section-padding">
        <div className="container-narrow">
          <HealthResources />
        </div>
      </section>

      {/* Myth vs Fact */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <MythFacts />
        </div>
      </section>

      {/* Helplines */}
      <section className="section-padding">
        <div className="container-narrow">
          <HealthHelplines />
        </div>
      </section>
    </Layout>
  );
};

export default Health;
