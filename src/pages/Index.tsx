import { motion } from "framer-motion";
import { Shield, MapPin, Briefcase, Heart, AlertTriangle, Users, BookOpen, TrendingUp, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";
import heroBg from "@/assets/hero-bg.jpg";

const quickAccess = [
  { icon: AlertTriangle, label: "Emergency SOS", desc: "One-click emergency alert with location sharing", link: "/safety", color: "bg-destructive/10 text-destructive" },
  { icon: MapPin, label: "Safety Map", desc: "Find safe zones and report unsafe areas", link: "/safety", color: "bg-primary/10 text-primary" },
  { icon: Briefcase, label: "Career Guide", desc: "AI-powered career roadmaps and opportunities", link: "/career", color: "bg-secondary text-secondary-foreground" },
  { icon: Heart, label: "Mood Tracker", desc: "Track your mental health and wellness daily", link: "/health", color: "bg-accent/20 text-accent-foreground" },
];

const stats = [
  { value: "50K+", label: "Women Protected" },
  { value: "1,200+", label: "Unsafe Areas Reported" },
  { value: "8,000+", label: "Careers Launched" },
  { value: "25K+", label: "Community Members" },
];

const steps = [
  { icon: Shield, title: "Sign Up", desc: "Create your free account in seconds" },
  { icon: MapPin, title: "Stay Safe", desc: "Access safety tools and emergency features" },
  { icon: TrendingUp, title: "Grow", desc: "Explore careers, mentorship, and resources" },
  { icon: Users, title: "Connect", desc: "Join a supportive community of women" },
];

const testimonials = [
  { name: "Priya S.", role: "Software Engineer", text: "Fearless Femmes' career roadmap helped me transition into tech. The mentorship program connected me with amazing women leaders.", rating: 5 },
  { name: "Ananya M.", role: "College Student", text: "The safety map feature helped me find safer routes to college. I feel much more confident walking alone now.", rating: 5 },
  { name: "Ritu K.", role: "Entrepreneur", text: "The community section is incredible. I found co-founders, investors, and friends who truly understand the journey.", rating: 5 },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        <div className="relative z-10 container-narrow section-padding">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Empowering Women Everywhere</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6">
              Your Safety.<br />
              <span className="text-gradient">Your Strength.</span><br />
              Your Shield.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              A digital ecosystem built for women — combining safety tools, career growth, community support, and health awareness in one powerful platform.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link to="/safety">
                <Button size="lg" className="gradient-purple border-0 text-primary-foreground rounded-2xl px-8 text-base">
                  Get Help Now
                </Button>
              </Link>
              <Link to="/career">
                <Button size="lg" variant="outline" className="rounded-2xl px-8 text-base border-primary/30 hover:bg-primary/5">
                  Explore Careers
                </Button>
              </Link>
              <Link to="/community">
                <Button size="lg" variant="outline" className="rounded-2xl px-8 text-base border-accent/30 hover:bg-accent/5">
                  Join Community
                </Button>
              </Link>
              <Link to="/health">
                <Button size="lg" variant="outline" className="rounded-2xl px-8 text-base border-accent/30 hover:bg-accent/5">
                  Health & Wellness
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">Quick Access</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-md mx-auto">Everything you need, one tap away</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccess.map((item, i) => (
              <motion.div key={item.label} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={item.link} className="block glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-body">{item.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding gradient-hero">
        <div className="container-narrow">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">How It Works</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-md mx-auto">Get started in four simple steps</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-xs font-semibold text-primary mb-2">Step {i + 1}</div>
                <h3 className="font-semibold text-lg mb-2 font-body">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">What Women Say</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-md mx-auto">Real stories from our community</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="gradient-purple rounded-3xl p-8 md:p-16 text-center">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to feel empowered?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Join thousands of women who trust Fearless Femmes for their safety, growth, and well-being.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-2xl px-10 text-base font-semibold">
                Get Started Free
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
