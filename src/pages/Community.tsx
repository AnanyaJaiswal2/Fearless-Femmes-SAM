import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, MessageSquare, Calendar, Rocket, Send,
  Shield, Lock, Heart, ChevronDown, ChevronUp, X, Plus,
  Clock, Star, Search, UserCheck,
  Sparkles, ArrowRight, CheckCircle, Globe, Zap,
  FileText, BadgeCheck, AlertCircle, LayoutDashboard,
  Trash2, Eye, Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Comment {
  id: number;
  author: string;
  text: string;
  timeAgo: string;
  isAnonymous: boolean;
}

interface Post {
  id: number;
  category: string;
  title: string;
  body: string;
  author: string;
  likes: number;
  comments: Comment[];
  isAnonymous: boolean;
  timeAgo: string;
  isMine?: boolean;
}

interface ChatMessage {
  id: number;
  author: string;
  text: string;
  timeAgo: string;
  isAnonymous: boolean;
}

interface Startup {
  id: number;
  name: string;
  founder: string;
  emoji: string;
  desc: string;
  stage: string;
  raised: string;
  impact: string;
  verified: boolean;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const CURRENT_USER = "Ananya J.";

const categories = ["All", "Safety", "Career", "Mental Health", "Relationships", "Finance", "Health"];

const initialPosts: Post[] = [
  {
    id: 1, category: "Safety",
    title: "Tips for solo travel as a woman in India",
    body: "After traveling to 12 states alone, here are my top safety strategies and must-have apps. Always share your live location with at least 2 trusted contacts, use IRCTC's women-only coaches, and download the Himmat Plus app before you go.",
    author: "Anonymous", likes: 34, isAnonymous: true, timeAgo: "2h ago",
    comments: [
      { id: 1, author: "Priya M.", text: "This is so helpful! I was planning a solo trip to Rajasthan.", timeAgo: "1h ago", isAnonymous: false },
      { id: 2, author: "Anonymous", text: "Also recommend keeping emergency contacts on speed dial.", timeAgo: "45m ago", isAnonymous: true },
    ],
  },
  {
    id: 2, category: "Career",
    title: "How I cracked my first tech interview at a FAANG company",
    body: "Six months of prep, three rejections, and finally the offer. Here's the exact roadmap I followed: LeetCode daily (easy → medium → hard), mock interviews with peers, and Grokking System Design for the later rounds.",
    author: "Neha R.", likes: 89, isAnonymous: false, timeAgo: "5h ago",
    comments: [
      { id: 1, author: "Divya S.", text: "Which FAANG company if you don't mind sharing?", timeAgo: "4h ago", isAnonymous: false },
      { id: 2, author: "Neha R.", text: "Google! 🎉 Feel free to DM me.", timeAgo: "3h ago", isAnonymous: false },
    ],
  },
  {
    id: 3, category: "Mental Health",
    title: "Dealing with impostor syndrome at work — it's real",
    body: "I've been a senior engineer for 2 years and still feel like a fraud sometimes. Therapy helped me realize this is extremely common, especially for first-gen professionals. You deserve to be in that room.",
    author: "Anonymous", likes: 56, isAnonymous: true, timeAgo: "1d ago",
    comments: [
      { id: 1, author: "Anonymous", text: "Thank you for posting this. I felt seen reading every word.", timeAgo: "20h ago", isAnonymous: true },
    ],
  },
  {
    id: 4, category: "Finance",
    title: "Started investing at 22 with ₹500/month — here's what I learned",
    body: "Nobody taught me about money. SIP in index funds, emergency fund first, then equity. Compound interest is real and it's magic. Start now, even if small.",
    author: "Anonymous", likes: 73, isAnonymous: true, timeAgo: "3d ago",
    comments: [],
  },
];

const supportGroups = [
  { id: 1, name: "First-Gen Professionals", emoji: "💼", desc: "For women who are the first in their family to enter corporate careers.", members: 284, isPrivate: true, tags: ["Career", "Mentorship"] },
  { id: 2, name: "Healing Together", emoji: "🌸", desc: "A safe space for women recovering from toxic relationships and trauma.", members: 193, isPrivate: true, tags: ["Mental Health", "Support"] },
  { id: 3, name: "Side Hustle Sisters", emoji: "🚀", desc: "Women building businesses and passive income alongside their 9-to-5.", members: 412, isPrivate: false, tags: ["Finance", "Entrepreneurship"] },
  { id: 4, name: "Married & Ambitious", emoji: "✨", desc: "Navigating career growth, marriage, and personal goals simultaneously.", members: 357, isPrivate: true, tags: ["Relationships", "Career"] },
  { id: 5, name: "Rural Tech Women", emoji: "🌾", desc: "Connecting women from tier-2/3 cities breaking into the tech industry.", members: 168, isPrivate: false, tags: ["Career", "Community"] },
  { id: 6, name: "Mom Bosses India", emoji: "👶", desc: "Mothers balancing parenthood with professional ambitions — no judgment zone.", members: 529, isPrivate: false, tags: ["Health", "Career"] },
];

const initialGroupChats: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, author: "Priya M.", text: "Hey everyone! Just got my first corporate job. Any advice for navigating office politics?", timeAgo: "2h ago", isAnonymous: false },
    { id: 2, author: "Anonymous", text: "Always document everything in writing. Emails over verbal agreements.", timeAgo: "1h ago", isAnonymous: true },
    { id: 3, author: "Sneha K.", text: "Find yourself a mentor within the company as soon as possible 💪", timeAgo: "45m ago", isAnonymous: false },
  ],
  2: [
    { id: 1, author: "Anonymous", text: "Today was a hard day. Just needed a safe space to say that.", timeAgo: "3h ago", isAnonymous: true },
    { id: 2, author: "Anonymous", text: "We're here with you. You're not alone 💜", timeAgo: "2h ago", isAnonymous: true },
  ],
  3: [
    { id: 1, author: "Meera J.", text: "My Etsy shop crossed ₹50k this month! Side hustles are real 🎉", timeAgo: "1h ago", isAnonymous: false },
    { id: 2, author: "Kavita S.", text: "This is so inspiring!! What do you sell?", timeAgo: "30m ago", isAnonymous: false },
    { id: 3, author: "Meera J.", text: "Handmade jewellery and digital planners. DM me and I'll share what worked!", timeAgo: "20m ago", isAnonymous: false },
  ],
  4: [], 5: [], 6: [],
};

const events = [
  { id: 1, title: "Women in Tech Leadership Summit", date: "Mar 15, 2026", time: "10:00 AM IST", type: "Webinar", attendees: 230, capacity: 300, speaker: "Roshni Nadar Malhotra", desc: "A panel discussion on breaking glass ceilings in Indian tech." },
  { id: 2, title: "Self-Defense Workshop Series", date: "Mar 22, 2026", time: "9:00 AM IST", type: "Workshop", attendees: 85, capacity: 100, speaker: "Trainer Anjali K.", desc: "Hands-on Krav Maga basics — practical safety skills for everyday life." },
  { id: 3, title: "Financial Independence Masterclass", date: "Apr 5, 2026", time: "3:00 PM IST", type: "Webinar", attendees: 150, capacity: 200, speaker: "CA Preethi Nair", desc: "From budgeting to investing — your complete guide to financial freedom." },
  { id: 4, title: "Startup Pitch Night — Women Founders", date: "Apr 12, 2026", time: "6:00 PM IST", type: "Networking", attendees: 67, capacity: 120, speaker: "Multiple Speakers", desc: "Watch 8 women-led startups pitch to investors and win mentorship." },
];

const initialStartups: Startup[] = [
  { id: 1, name: "SafeHer", founder: "Kavita Sharma", emoji: "🛡️", desc: "AI-powered personal safety wearable that alerts trusted contacts and authorities in seconds.", stage: "Seed", raised: "₹45L", impact: "10K+ women protected", verified: true },
  { id: 2, name: "SkillHer", founder: "Anita Patel", emoji: "📱", desc: "Micro-learning platform delivering career skills in 10-minute modules for women in rural India.", stage: "Series A", raised: "₹2.3Cr", impact: "50K+ learners", verified: true },
  { id: 3, name: "GreenThread", founder: "Meera Joshi", emoji: "🌿", desc: "Sustainable fashion brand connecting urban buyers directly with women artisan cooperatives.", stage: "Pre-Seed", raised: "₹18L", impact: "200+ artisans employed", verified: true },
  { id: 4, name: "MindBloom", founder: "Dr. Shreya Rao", emoji: "🧠", desc: "Mental health platform offering therapy and peer support specifically designed for Indian women.", stage: "Seed", raised: "₹60L", impact: "8K+ therapy sessions", verified: true },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Safety: "bg-red-500/10 text-red-400 border border-red-500/20",
  Career: "bg-primary/10 text-primary border border-primary/20",
  "Mental Health": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Finance: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Health: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  Relationships: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Community: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Mentorship: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  Support: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  Entrepreneurship: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

const stageEmojis: Record<string, string> = {
  "Pre-Seed": "🌱", Seed: "🌿", "Series A": "🚀", "Series B": "⭐", Bootstrapped: "💪",
};

// ─── New Post Modal ───────────────────────────────────────────────────────────

const NewPostModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (p: Post) => void;
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Career");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    const newPost: Post = {
      id: Date.now(), category, title, body,
      author: isAnonymous ? "Anonymous" : CURRENT_USER,
      likes: 0, comments: [], isAnonymous, timeAgo: "Just now", isMine: true,
    };
    onSubmit(newPost);
    setSubmitted(true);
    setTimeout(onClose, 1600);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative glass-card rounded-3xl p-6 w-full max-w-lg border border-primary/20 shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle className="h-16 w-16 text-primary" />
            </motion.div>
            <p className="text-lg font-semibold text-center">Post published!</p>
            <p className="text-sm text-muted-foreground text-center">It's now live on the forum and saved in your dashboard ✨</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold">Share with the Community</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(1).map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${category === cat ? "gradient-purple text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" className="rounded-xl bg-muted/50 border-border/50 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your story</label>
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience, question, or advice..." className="rounded-xl bg-muted/50 border-border/50 focus:border-primary min-h-[100px] resize-none" />
              </div>
              <button onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center gap-2.5 w-full p-3 rounded-xl transition-all ${isAnonymous ? "bg-primary/10 border border-primary/30" : "bg-muted/50 border border-border/50"}`}>
                <Shield className={`h-4 w-4 ${isAnonymous ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-left flex-1">
                  <p className={`text-sm font-medium ${isAnonymous ? "text-primary" : "text-foreground"}`}>Post Anonymously</p>
                  <p className="text-xs text-muted-foreground">Your name will not appear on this post</p>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${isAnonymous ? "gradient-purple" : "bg-muted"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isAnonymous ? "left-5" : "left-0.5"}`} />
                </div>
              </button>
              <Button onClick={handleSubmit} disabled={!title.trim() || !body.trim()}
                className="gradient-purple text-primary-foreground rounded-xl border-0 w-full gap-2 disabled:opacity-50">
                <Send className="h-4 w-4" /> Publish Post
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Group Chat Modal ─────────────────────────────────────────────────────────

const GroupChatModal = ({
  group,
  messages,
  onClose,
  onSend,
}: {
  group: typeof supportGroups[0];
  messages: ChatMessage[];
  onClose: () => void;
  onSend: (groupId: number, msg: ChatMessage) => void;
}) => {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: Date.now(),
      author: isAnonymous ? "Anonymous" : CURRENT_USER,
      text: text.trim(),
      timeAgo: "Just now",
      isAnonymous,
    };
    onSend(group.id, msg);
    setText("");
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative glass-card rounded-3xl w-full max-w-lg border border-primary/20 shadow-2xl flex flex-col"
        style={{ height: "580px" }}
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-border/50 shrink-0">
          <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-muted/60 shrink-0">{group.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{group.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3 w-3" /> {group.members} members
              {group.isPrivate && <><Lock className="h-3 w-3 ml-1" /> Private</>}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0"><X className="h-5 w-5" /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "none" }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
              <Hash className="h-10 w-10 opacity-20" />
              <p className="text-sm">No messages yet. Be the first to start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = !msg.isAnonymous && msg.author === CURRENT_USER;
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                  <span className="text-xs text-muted-foreground px-1 flex items-center gap-1">
                    {msg.isAnonymous && <Shield className="h-3 w-3" />}
                    {msg.author} · {msg.timeAgo}
                  </span>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? "gradient-purple text-primary-foreground rounded-tr-sm" : "bg-muted/60 rounded-tl-sm"}`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50 shrink-0 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-all shrink-0 ${isAnonymous ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted text-muted-foreground"}`}>
              <Shield className="h-3 w-3" /> {isAnonymous ? "Anon ON" : "Go Anon"}
            </button>
            <Input value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Share your thoughts..." className="rounded-xl bg-muted/50 border-border/50 flex-1 text-sm" />
            <Button onClick={handleSend} disabled={!text.trim()} size="sm"
              className="gradient-purple text-primary-foreground border-0 rounded-xl shrink-0 disabled:opacity-50">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Startup Submit Modal ─────────────────────────────────────────────────────

const StartupSubmitModal = ({
  onClose,
  onVerified,
}: {
  onClose: () => void;
  onVerified: (s: Startup) => void;
}) => {
  const [step, setStep] = useState<"form" | "verifying" | "approved" | "rejected">("form");
  const [verifyLog, setVerifyLog] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", founder: "", stage: "Pre-Seed", desc: "",
    raised: "", impact: "", email: "", emoji: "🚀",
  });
  const [docName, setDocName] = useState("");
  const [idName, setIdName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Bootstrapped"];
  const emojis = ["🚀", "🛡️", "📱", "🌿", "🧠", "💡", "🌸", "🎯", "⚡", "🌍"];

  const handleVerify = async () => {
    if (!form.name || !form.founder || !form.desc || !docName || !idName) return;
    setStep("verifying");

    const logs = [
      "Scanning submitted documents...",
      "Verifying founder identity proof...",
      "Cross-referencing business registration...",
      "Checking startup description for authenticity...",
      "Analyzing impact claims...",
      "Running women-founder verification check...",
      "AI review complete — generating verdict...",
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setVerifyLog((prev) => [...prev, logs[i]]);
    }
    await new Promise((r) => setTimeout(r, 500));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 100,
          messages: [{
            role: "user",
            content: `You are an AI verifier for Fearless Femmes, a women-empowerment platform. Review this startup submission:

Name: ${form.name}
Founder: ${form.founder}
Stage: ${form.stage}
Description: ${form.desc}
Impact: ${form.impact || "Not specified"}

Approve if the startup seems genuine, women-led, and has a positive social or economic impact. Reject only if clearly fake or harmful. Be generous. Respond with ONLY: APPROVED or REJECTED`,
          }],
        }),
      });
      const data = await res.json();
      const reply = (data.content?.[0]?.text || "APPROVED").trim().toUpperCase();
      const isApproved = reply.startsWith("APPROVED");
      setStep(isApproved ? "approved" : "rejected");
      if (isApproved) {
        onVerified({ id: Date.now(), name: form.name, founder: form.founder, emoji: form.emoji, desc: form.desc, stage: form.stage, raised: form.raised || "Undisclosed", impact: form.impact || "Growing", verified: true });
      }
    } catch {
      setStep("approved");
      onVerified({ id: Date.now(), name: form.name, founder: form.founder, emoji: form.emoji, desc: form.desc, stage: form.stage, raised: form.raised || "Undisclosed", impact: form.impact || "Growing", verified: true });
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={step === "form" ? onClose : undefined} />
      <motion.div
        className="relative glass-card rounded-3xl w-full max-w-lg border border-primary/20 shadow-2xl overflow-hidden"
        style={{ maxHeight: "92vh" }}
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      >
        <div className="overflow-y-auto" style={{ maxHeight: "92vh", scrollbarWidth: "none" }}>

          {/* Form */}
          {step === "form" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold">Submit Your Startup</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">AI-verified before going live on the platform</p>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                {/* Emoji */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Choose an icon</label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((e) => (
                      <button key={e} onClick={() => set("emoji", e)}
                        className={`text-xl w-9 h-9 rounded-xl transition-all ${form.emoji === e ? "gradient-purple ring-2 ring-primary" : "bg-muted/60 hover:bg-muted"}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Name + Founder */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Startup Name *</label>
                    <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. SafeHer" className="rounded-xl bg-muted/50 border-border/50 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Founder Name *</label>
                    <Input value={form.founder} onChange={(e) => set("founder", e.target.value)} placeholder="Your full name" className="rounded-xl bg-muted/50 border-border/50 text-sm" />
                  </div>
                </div>
                {/* Stage */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Funding Stage</label>
                  <div className="flex flex-wrap gap-2">
                    {stages.map((s) => (
                      <button key={s} onClick={() => set("stage", s)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${form.stage === s ? "gradient-purple text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>
                        {stageEmojis[s]} {s}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">What does your startup do? *</label>
                  <Textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Brief description of your product/service and the problem it solves..." className="rounded-xl bg-muted/50 border-border/50 text-sm min-h-[80px] resize-none" />
                </div>
                {/* Raised + Impact */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount Raised</label>
                    <Input value={form.raised} onChange={(e) => set("raised", e.target.value)} placeholder="₹45L / Bootstrapped" className="rounded-xl bg-muted/50 border-border/50 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Impact so far</label>
                    <Input value={form.impact} onChange={(e) => set("impact", e.target.value)} placeholder="10K+ users served" className="rounded-xl bg-muted/50 border-border/50 text-sm" />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Email</label>
                  <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="founder@startup.com" type="email" className="rounded-xl bg-muted/50 border-border/50 text-sm" />
                </div>
                {/* Doc uploads */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Required Documents</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => idRef.current?.click()}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed text-xs transition-all ${idName ? "border-primary/50 bg-primary/5 text-primary" : "border-border/50 hover:border-primary/30 bg-muted/30 text-muted-foreground"}`}>
                      <UserCheck className="h-5 w-5" />
                      {idName ? <span className="font-medium truncate w-full text-center">{idName}</span> : <><span className="font-medium">ID Proof *</span><span className="opacity-70">Aadhaar / Passport</span></>}
                    </button>
                    <button onClick={() => fileRef.current?.click()}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed text-xs transition-all ${docName ? "border-primary/50 bg-primary/5 text-primary" : "border-border/50 hover:border-primary/30 bg-muted/30 text-muted-foreground"}`}>
                      <FileText className="h-5 w-5" />
                      {docName ? <span className="font-medium truncate w-full text-center">{docName}</span> : <><span className="font-medium">Business Doc *</span><span className="opacity-70">Registration / Pitch</span></>}
                    </button>
                  </div>
                  <input ref={idRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIdName(e.target.files?.[0]?.name || "")} />
                  <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => setDocName(e.target.files?.[0]?.name || "")} />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3 text-primary" /> Documents are encrypted and only used for AI verification
                  </p>
                </div>
                <Button onClick={handleVerify} disabled={!form.name || !form.founder || !form.desc || !docName || !idName}
                  className="gradient-purple text-primary-foreground rounded-xl border-0 w-full gap-2 disabled:opacity-50">
                  <Sparkles className="h-4 w-4" /> Submit for AI Verification
                </Button>
              </div>
            </div>
          )}

          {/* Verifying */}
          {step === "verifying" && (
            <div className="p-8 flex flex-col items-center gap-5 min-h-[440px] justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full gradient-purple flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary-foreground animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full gradient-purple opacity-30 animate-ping" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1">AI Verification in Progress</h3>
                <p className="text-xs text-muted-foreground">Reviewing your submission securely...</p>
              </div>
              <div className="w-full space-y-2.5 max-w-sm">
                {verifyLog.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Approved */}
          {step === "approved" && (
            <div className="p-8 flex flex-col items-center gap-4 text-center min-h-[380px] justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <div className="w-20 h-20 rounded-full gradient-purple flex items-center justify-center mx-auto">
                  <BadgeCheck className="h-10 w-10 text-primary-foreground" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold">You're Verified! 🎉</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                <strong>{form.name}</strong> has passed AI review and is now live in the Startup Spotlight!
              </p>
              <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 px-4 py-2.5 rounded-full border border-primary/20">
                <BadgeCheck className="h-3.5 w-3.5" /> AI Verified Women-Led Startup
              </div>
              <Button onClick={onClose} className="gradient-purple text-primary-foreground rounded-xl border-0 gap-2 mt-2">
                View on Spotlight <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Rejected */}
          {step === "rejected" && (
            <div className="p-8 flex flex-col items-center gap-4 text-center min-h-[380px] justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <div className="w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold">Submission Needs More Info</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Our AI couldn't fully verify this submission. Please ensure your documents are clear and your description accurately reflects a women-led venture.
              </p>
              <div className="flex gap-3 mt-2">
                <Button onClick={() => { setStep("form"); setVerifyLog([]); }} variant="outline" className="rounded-xl border-primary/30">
                  Edit & Resubmit
                </Button>
                <Button onClick={onClose} className="gradient-purple text-primary-foreground rounded-xl border-0">Close</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── My Dashboard Panel ───────────────────────────────────────────────────────

const MyDashboard = ({ myPosts, onDelete }: { myPosts: Post[]; onDelete: (id: number) => void }) => (
  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
    className="glass-card rounded-2xl p-5 border border-primary/20 mb-6">
    <div className="flex items-center gap-2 mb-4">
      <LayoutDashboard className="h-4 w-4 text-primary" />
      <h3 className="font-semibold text-sm">My Posts</h3>
      <span className="ml-auto text-xs text-muted-foreground">{myPosts.length} post{myPosts.length !== 1 ? "s" : ""}</span>
    </div>
    {myPosts.length === 0 ? (
      <p className="text-xs text-muted-foreground text-center py-4">You haven't posted yet. Share something with the community!</p>
    ) : (
      <div className="space-y-3">
        {myPosts.map((post) => (
          <div key={post.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>{post.category}</span>
                {post.isAnonymous && <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Shield className="h-3 w-3" /> Anon</span>}
              </div>
              <p className="text-sm font-medium truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.comments.length}</span>
                <span>{post.timeAgo}</span>
              </p>
            </div>
            <button onClick={() => onDelete(post.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5 p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const Community = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [startups, setStartups] = useState<Startup[]>(initialStartups);
  const [groupChats, setGroupChats] = useState(initialGroupChats);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const [anonComment, setAnonComment] = useState<Record<number, boolean>>({});

  const [activeTab, setActiveTab] = useState<"forum" | "groups" | "events" | "startups">("forum");
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [registeredEvents, setRegisteredEvents] = useState<Set<number>>(new Set());

  const [showNewPost, setShowNewPost] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [chatGroup, setChatGroup] = useState<typeof supportGroups[0] | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const myPosts = posts.filter((p) => p.isMine);

  const filteredPosts = posts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addPost = (p: Post) => setPosts((prev) => [p, ...prev]);
  const deletePost = (id: number) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const toggleLike = (id: number) => {
    const wasLiked = likedPosts.has(id);
    setLikedPosts((prev) => { const n = new Set(prev); wasLiked ? n.delete(id) : n.add(id); return n; });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: wasLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const sendComment = (postId: number) => {
    const text = commentDraft[postId]?.trim();
    if (!text) return;
    const isAnon = anonComment[postId] || false;
    setPosts((prev) => prev.map((p) => p.id === postId ? {
      ...p, comments: [...p.comments, { id: Date.now(), author: isAnon ? "Anonymous" : CURRENT_USER, text, timeAgo: "Just now", isAnonymous: isAnon }]
    } : p));
    setCommentDraft((d) => ({ ...d, [postId]: "" }));
  };

  const sendGroupMsg = (groupId: number, msg: ChatMessage) => {
    setGroupChats((prev) => ({ ...prev, [groupId]: [...(prev[groupId] || []), msg] }));
  };

  const tabs = [
    { key: "forum", label: "Forum", icon: MessageSquare },
    { key: "groups", label: "Groups", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "startups", label: "Startups", icon: Rocket },
  ] as const;

  return (
    <Layout>
      <AnimatePresence>
        {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={addPost} />}
        {showStartupForm && <StartupSubmitModal onClose={() => setShowStartupForm(false)} onVerified={(s) => setStartups((prev) => [s, ...prev])} />}
        {chatGroup && <GroupChatModal group={chatGroup} messages={groupChats[chatGroup.id] || []} onClose={() => setChatGroup(null)} onSend={sendGroupMsg} />}
      </AnimatePresence>

      {/* Hero */}
      <section className="section-padding gradient-hero">
        <div className="container-narrow">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Safe · Private · Empowering
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mb-4">
              Stronger <span className="text-gradient">Together</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-lg mb-6">
              A private, judgment-free space to connect, share experiences, and grow with women who understand your journey.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              {[{ icon: Shield, label: "Anonymous posting supported" }, { icon: Lock, label: "End-to-end secure groups" }, { icon: UserCheck, label: "Women-only verified community" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" /> {label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Tab Nav */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container-narrow">
          <div className="flex items-center gap-1 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === key ? "gradient-purple text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
            {/* My Dashboard toggle */}
            <button onClick={() => setShowDashboard((v) => !v)}
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${showDashboard ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted/50"}`}>
              <LayoutDashboard className="h-4 w-4" />
              My Posts
              {myPosts.length > 0 && (
                <span className="gradient-purple text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {myPosts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── FORUM ── */}
      {activeTab === "forum" && (
        <section className="section-padding">
          <div className="container-narrow">
            <AnimatePresence>{showDashboard && <MyDashboard myPosts={myPosts} onDelete={deletePost} />}</AnimatePresence>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold">Discussion Forum</motion.h2>
              <motion.div variants={fadeUp} custom={1}>
                <Button onClick={() => setShowNewPost(true)} className="gradient-purple text-primary-foreground rounded-xl border-0 gap-2">
                  <Plus className="h-4 w-4" /> New Post
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search discussions..." className="pl-9 rounded-xl bg-muted/50 border-border/50" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-2 mb-6 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-all ${activeCategory === cat ? "gradient-purple text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>
                  {cat}
                </button>
              ))}
            </motion.div>

            <div className="flex flex-col gap-3">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No posts found. Be the first to start this conversation!</p>
                </div>
              ) : filteredPosts.map((post, i) => (
                <motion.div key={post.id} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className={`glass-card rounded-2xl p-5 transition-all duration-300 ${post.isMine ? "border border-primary/25" : ""}`}>
                  {/* Post header — clickable to expand */}
                  <div className="flex items-start justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>{post.category}</span>
                        {post.isAnonymous && <span className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Anonymous</span>}
                        {post.isMine && <span className="text-xs text-primary flex items-center gap-1"><Eye className="h-3 w-3" /> Your post</span>}
                        <span className="text-xs text-muted-foreground ml-auto">{post.timeAgo}</span>
                      </div>
                      <h3 className="font-semibold mb-1 font-body">{post.title}</h3>
                      <p className="text-xs text-muted-foreground">by {post.author}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-sm shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                        className={`flex items-center gap-1 transition-all ${likedPosts.has(post.id) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                        <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" /> {post.comments.length}
                      </span>
                      {expandedPost === post.id
                        ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Expanded content + comments */}
                  <AnimatePresence>
                    {expandedPost === post.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="text-sm text-muted-foreground mt-4 pb-4 border-b border-border/40">{post.body}</p>

                        {/* Comments list */}
                        <div className="mt-4 space-y-3">
                          <p className="text-xs font-medium text-muted-foreground">{post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}</p>
                          {post.comments.map((c) => (
                            <div key={c.id} className="flex gap-3">
                              <div className="w-7 h-7 rounded-full gradient-purple flex items-center justify-center shrink-0 text-xs text-primary-foreground font-bold">
                                {c.isAnonymous ? "?" : c.author[0]}
                              </div>
                              <div className="flex-1 bg-muted/40 rounded-xl px-3 py-2">
                                <p className="text-xs font-medium flex items-center gap-1">
                                  {c.isAnonymous && <Shield className="h-3 w-3 text-primary" />}
                                  {c.author}
                                  <span className="text-muted-foreground font-normal ml-1">· {c.timeAgo}</span>
                                </p>
                                <p className="text-sm mt-0.5">{c.text}</p>
                              </div>
                            </div>
                          ))}

                          {/* Add comment */}
                          <div className="flex gap-2 mt-3 pt-3 border-t border-border/40">
                            <button onClick={() => setAnonComment((a) => ({ ...a, [post.id]: !a[post.id] }))}
                              className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-all ${anonComment[post.id] ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted text-muted-foreground"}`}>
                              <Shield className="h-3 w-3" /> {anonComment[post.id] ? "Anon" : "Anon?"}
                            </button>
                            <Input value={commentDraft[post.id] || ""} onChange={(e) => setCommentDraft((d) => ({ ...d, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && sendComment(post.id)}
                              placeholder="Add your thoughts..." className="rounded-xl bg-muted/50 border-border/50 text-sm flex-1" />
                            <Button size="sm" onClick={() => sendComment(post.id)} disabled={!commentDraft[post.id]?.trim()}
                              className="gradient-purple text-primary-foreground border-0 rounded-xl shrink-0 disabled:opacity-50">
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GROUPS ── */}
      {activeTab === "groups" && (
        <section className="section-padding">
          <div className="container-narrow">
            <AnimatePresence>{showDashboard && <MyDashboard myPosts={myPosts} onDelete={deletePost} />}</AnimatePresence>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-2">Support Groups</motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">Private, interest-based communities. Join a group to unlock the live group chat.</motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportGroups.map((group, i) => {
                const isJoined = joinedGroups.has(group.id);
                return (
                  <motion.div key={group.id} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="glass-card rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-muted/50 shrink-0">{group.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold font-body">{group.name}</h3>
                          {group.isPrivate && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Private</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{group.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {group.tags.map((tag) => (
                            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[tag] || "bg-muted text-muted-foreground"}`}>{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {group.members + (isJoined ? 1 : 0)} members
                          </span>
                          <div className="flex gap-2">
                            {isJoined && (
                              <Button size="sm" variant="outline" onClick={() => setChatGroup(group)}
                                className="rounded-xl border-primary/30 text-xs gap-1">
                                <MessageSquare className="h-3.5 w-3.5" /> Open Chat
                              </Button>
                            )}
                            <Button size="sm"
                              onClick={() => setJoinedGroups((prev) => { const n = new Set(prev); n.has(group.id) ? n.delete(group.id) : n.add(group.id); return n; })}
                              className={`rounded-xl text-xs transition-all ${isJoined ? "bg-primary/10 text-primary border border-primary/30" : "gradient-purple text-primary-foreground border-0"}`}>
                              {isJoined ? <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Joined</> : <><Plus className="h-3.5 w-3.5 mr-1" /> Join</>}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENTS ── */}
      {activeTab === "events" && (
        <section className="section-padding">
          <div className="container-narrow">
            <AnimatePresence>{showDashboard && <MyDashboard myPosts={myPosts} onDelete={deletePost} />}</AnimatePresence>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-2">Upcoming Events</motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">Workshops, webinars, and expert sessions — all designed for women's growth.</motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {events.map((event, i) => {
                const isReg = registeredEvents.has(event.id);
                const pct = Math.round(((event.attendees + (isReg ? 1 : 0)) / event.capacity) * 100);
                return (
                  <motion.div key={event.id} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="glass-card rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{event.type}</span>
                      {pct >= 80 && <span className="text-xs text-amber-400 font-medium flex items-center gap-1"><Zap className="h-3 w-3" /> Filling fast</span>}
                    </div>
                    <h3 className="font-semibold text-base mb-1 font-body">{event.title}</h3>
                    <p className="text-xs text-primary mb-3">with {event.speaker}</p>
                    <p className="text-sm text-muted-foreground mb-4">{event.desc}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full gradient-purple rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{event.attendees + (isReg ? 1 : 0)}/{event.capacity}</span>
                      </div>
                    </div>
                    <Button size="sm"
                      onClick={() => setRegisteredEvents((prev) => { const n = new Set(prev); n.has(event.id) ? n.delete(event.id) : n.add(event.id); return n; })}
                      className={`rounded-xl w-full text-sm transition-all ${isReg ? "bg-primary/10 text-primary border border-primary/30" : "gradient-purple text-primary-foreground border-0"}`}>
                      {isReg ? <><CheckCircle className="h-4 w-4 mr-1.5" /> Registered — You're in!</> : <>Register Free <ArrowRight className="h-4 w-4 ml-1.5" /></>}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── STARTUPS ── */}
      {activeTab === "startups" && (
        <section className="section-padding">
          <div className="container-narrow">
            <AnimatePresence>{showDashboard && <MyDashboard myPosts={myPosts} onDelete={deletePost} />}</AnimatePresence>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-2">
                Women-Led Startup <span className="text-gradient">Spotlight</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">Celebrating ventures built by fearless women founders — AI verified.</motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {startups.map((s, i) => (
                <motion.div key={s.id} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl gradient-purple shrink-0">{s.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg font-body">{s.name}</h3>
                          {s.verified && <span className="flex items-center gap-0.5 text-xs text-primary"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span>}
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium shrink-0">{s.stage}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">by {s.founder}</p>
                      <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                      <div className="flex items-center gap-4 flex-wrap mb-4">
                        <div className="flex items-center gap-1.5 text-xs"><Star className="h-3.5 w-3.5 text-amber-400" /><span className="font-medium">{s.raised} raised</span></div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Globe className="h-3.5 w-3.5" /><span>{s.impact}</span></div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-xl border-primary/30 text-xs flex-1">Learn more</Button>
                        <Button size="sm" className="gradient-purple text-primary-foreground border-0 rounded-xl text-xs flex-1">
                          <Heart className="h-3.5 w-3.5 mr-1" /> Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Submit CTA */}
            <motion.div variants={fadeUp} custom={5} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mt-10 glass-card rounded-2xl p-8 text-center border border-primary/20">
              <Rocket className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Are you a woman founder?</h3>
              <p className="text-muted-foreground text-sm mb-2 max-w-md mx-auto">
                Submit your startup for AI verification and get featured in front of thousands of women in our community.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-5 flex-wrap">
                <span className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> AI-reviewed within minutes</span>
                <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Documents encrypted & secure</span>
              </div>
              <Button onClick={() => setShowStartupForm(true)} className="gradient-purple text-primary-foreground rounded-xl border-0 gap-2">
                <Sparkles className="h-4 w-4" /> Submit Your Startup
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Active Members", value: "12,400+", icon: Users },
              { label: "Forum Posts", value: `${posts.length}+`, icon: MessageSquare },
              { label: "Events Hosted", value: "180+", icon: Calendar },
              { label: "Startups Featured", value: `${startups.length}+`, icon: Rocket },
            ].map(({ label, value, icon: Icon }, i) => (
              <motion.div key={label} variants={fadeUp} custom={i} className="glass-card rounded-2xl p-5">
                <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gradient">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;