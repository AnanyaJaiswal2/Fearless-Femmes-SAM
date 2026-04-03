import { motion } from "framer-motion";
import { Users, MessageSquare, Calendar, Rocket, Heart, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";

const forumPosts = [
  { category: "Safety", title: "Tips for solo travel as a woman in India", author: "Anonymous", likes: 34, comments: 12 },
  { category: "Career", title: "How I cracked my first tech interview", author: "Neha R.", likes: 89, comments: 23 },
  { category: "Mental Health", title: "Dealing with impostor syndrome at work", author: "Anonymous", likes: 56, comments: 18 },
  { category: "Career", title: "Best online courses for data science beginners", author: "Priya M.", likes: 42, comments: 8 },
];

const events = [
  { title: "Women in Tech Leadership Summit", date: "Mar 15, 2026", type: "Webinar", attendees: 230 },
  { title: "Self-Defense Workshop Series", date: "Mar 22, 2026", type: "Workshop", attendees: 85 },
  { title: "Financial Independence Masterclass", date: "Apr 5, 2026", type: "Webinar", attendees: 150 },
];

const startups = [
  { name: "SafeHer", founder: "Kavita Sharma", desc: "AI-powered personal safety wearable for women", stage: "Seed" },
  { name: "SkillHer", founder: "Anita Patel", desc: "Micro-learning platform for women in rural India", stage: "Series A" },
  { name: "GreenThread", founder: "Meera Joshi", desc: "Sustainable fashion brand by women artisans", stage: "Pre-Seed" },
];

const Community = () => {
  return (
    <Layout>
      <section className="section-padding gradient-hero">
        <div className="container-narrow">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">
              Stronger <span className="text-gradient">Together</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-lg">
              Connect, share, and grow with a supportive community of women from all walks of life.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Forum */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold">Discussion Forum</motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <Button className="gradient-purple text-primary-foreground rounded-xl border-0 gap-2">
                <Send className="h-4 w-4" /> New Post
              </Button>
            </motion.div>
          </motion.div>
          <div className="flex flex-col gap-4">
            {forumPosts.map((post, i) => (
              <motion.div key={post.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      post.category === "Safety" ? "bg-destructive/10 text-destructive" :
                      post.category === "Career" ? "bg-primary/10 text-primary" :
                      "bg-accent/20 text-accent-foreground"
                    }`}>{post.category}</span>
                    <h3 className="font-semibold mt-2 mb-1 font-body">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">by {post.author}</p>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post.comments}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold mb-8 text-center">Upcoming Events</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((e, i) => (
              <motion.div key={e.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{e.date}</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{e.type}</span>
                <h3 className="font-semibold mt-3 mb-2 font-body">{e.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{e.attendees} registered</p>
                <Button size="sm" variant="outline" className="rounded-xl border-primary/30 w-full">Register</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Startups */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold mb-8 text-center">Women-Led Startup Spotlight</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {startups.map((s, i) => (
              <motion.div key={s.name} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center mb-4">
                  <Rocket className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg font-body">{s.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">by {s.founder}</p>
                <p className="text-sm text-muted-foreground mb-3">{s.desc}</p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{s.stage}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
