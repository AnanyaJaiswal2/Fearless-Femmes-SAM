import { motion } from "framer-motion";
import { Mail, Users, Handshake, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";
import { useState } from "react";

const forms = [
  { icon: Mail, title: "Contact Us", desc: "General inquiries and support", fields: ["Name", "Email", "Message"] },
  { icon: Users, title: "Volunteer", desc: "Join our team of volunteers", fields: ["Name", "Email", "Skills & Interests"] },
  { icon: Handshake, title: "Partner With Us", desc: "Organization or corporate partnership", fields: ["Organization", "Email", "Proposal"] },
];

const Contact = () => {
  const [activeForm, setActiveForm] = useState(0);
  const [email, setEmail] = useState("");

  return (
    <Layout>
      <section className="section-padding gradient-hero">
        <div className="container-narrow">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">
              Let's <span className="text-gradient">Connect</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-lg">
              Reach out for support, partnership, or to volunteer. We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Form tabs */}
      <section className="section-padding">
        <div className="container-narrow max-w-2xl">
          <div className="flex gap-2 mb-8 flex-wrap">
            {forms.map((f, i) => (
              <button key={f.title} onClick={() => setActiveForm(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeForm === i ? 'gradient-purple text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}>
                <f.icon className="h-4 w-4" /> {f.title}
              </button>
            ))}
          </div>

          <motion.div key={activeForm} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">{forms[activeForm].title}</h2>
            <p className="text-muted-foreground text-sm mb-6">{forms[activeForm].desc}</p>
            <form className="flex flex-col gap-4">
              {forms[activeForm].fields.map((field) => (
                field === "Message" || field === "Skills & Interests" || field === "Proposal" ? (
                  <div key={field}>
                    <label className="text-sm font-medium mb-1.5 block">{field}</label>
                    <Textarea placeholder={`Enter your ${field.toLowerCase()}...`} rows={4} className="rounded-xl" />
                  </div>
                ) : (
                  <div key={field}>
                    <label className="text-sm font-medium mb-1.5 block">{field}</label>
                    <Input placeholder={`Enter your ${field.toLowerCase()}`} className="rounded-xl" />
                  </div>
                )
              ))}
              <Button type="submit" className="gradient-purple text-primary-foreground rounded-xl border-0 mt-2">Send Message</Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow max-w-xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="w-14 h-14 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
              <Bell className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold mb-4">Stay Updated</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mb-6">Subscribe to our newsletter for safety tips, career opportunities, and community updates.</motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex gap-3 max-w-sm mx-auto">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="rounded-xl" />
              <Button className="gradient-purple text-primary-foreground rounded-xl border-0 shrink-0">Subscribe</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
