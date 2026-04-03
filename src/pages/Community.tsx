import { motion } from "framer-motion";
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Shield,
  Lock,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";

const Community = () => {
  return (
    <Layout>

      {/* ================= HERO ================= */}
      <section
        className="section-padding relative bg-no-repeat bg-right bg-[length:auto_100%]"
        style={{
          backgroundImage: "url('/images/community-banner.jpeg')",
        }}
      >
        {/* Overlay (does NOT affect size) */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>

        <div className="container-narrow relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">

            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Safe · Private · Empowering
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Stronger <span className="text-gradient">Together</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-muted-foreground max-w-lg mb-6"
            >
              Connect, share, and grow with a supportive community of women from all walks of life.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Shield, label: "Anonymous posting supported" },
                { icon: Lock, label: "End-to-end secure groups" },
                { icon: UserCheck, label: "Women-only verified community" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ================= DISCUSSION ================= */}
      <section className="section-padding">
        <div className="container-narrow">

          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">Discussion Forum</h2>

            <Button className="gradient-purple text-primary-foreground rounded-xl border-0 gap-2">
              <Send className="h-4 w-4" /> New Post
            </Button>
          </div>

          {/* Example Post */}
          <div className="glass-card rounded-2xl p-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-500">
                Safety
              </span>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> 34
                </span>

                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> 12
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2">
              Tips for solo travel as a woman in India
            </h3>

            <p className="text-muted-foreground text-sm">
              Share your experiences and safety tips for traveling solo.
            </p>
          </div>

        </div>
      </section>

    </Layout>
  );
};

export default Community;