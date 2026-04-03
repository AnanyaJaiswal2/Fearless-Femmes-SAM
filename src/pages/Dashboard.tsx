import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Phone, Plus, Trash2, Shield, LogOut, Edit2, Check, X, Heart, Smile, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
}

interface Profile {
  full_name: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [addingContact, setAddingContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRel, setContactRel] = useState("");
  const [savingContact, setSavingContact] = useState(false);
  const [lastMood, setLastMood] = useState<string | null>(null);
  const [nextPeriod, setNextPeriod] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchProfile();
    fetchContacts();
    fetchHealthData();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
    if (data) { setProfile(data); setNewName(data.full_name || ""); }
  };

  const fetchContacts = async () => {
    if (!user) return;
    const { data } = await supabase.from("emergency_contacts").select("*").eq("user_id", user.id).order("created_at");
    if (data) setContacts(data);
  };

 const fetchHealthData = async () => {
  if (!user) return;

  // Last mood
  const { data: moodData } = await supabase
    .from("mood_logs")
    .select("mood")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(1);

  if (moodData && moodData.length > 0) {
    setLastMood(moodData[0].mood);
  }

  // Period prediction (FIXED 🔥)
  const { data: periodData } = await supabase
    .from("period_logs")
    .select("start_date, cycle_length")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  if (periodData && periodData.length > 0) {
    const lastStart = new Date(periodData[0].start_date);

    // Get valid cycle lengths
    const cycleLengths = periodData
      .filter((p) => p.cycle_length && p.cycle_length > 0)
      .map((p) => p.cycle_length!);

    // 👉 Default = 28 days (IMPORTANT FIX)
    const avgCycle =
      cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
        : 28;

    const next = new Date(lastStart);
    next.setDate(next.getDate() + avgCycle);

    setNextPeriod(
      next.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }
};

  const saveName = async () => {
    if (!user || !newName.trim()) return;
    const { error } = await supabase.from("profiles").update({ full_name: newName.trim() }).eq("user_id", user.id);
    if (!error) { setProfile({ full_name: newName.trim() }); setEditingName(false); toast({ title: "Name updated!" }); }
  };

  const addContact = async () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      toast({ title: "Name and phone are required", variant: "destructive" }); return;
    }
    setSavingContact(true);
    const { error } = await supabase.from("emergency_contacts").insert({
      user_id: user!.id,
      name: contactName.trim(),
      phone: contactPhone.trim(),
      relationship: contactRel.trim() || null,
    });
    if (!error) {
      toast({ title: "Contact added!" });
      setContactName(""); setContactPhone(""); setContactRel(""); setAddingContact(false);
      fetchContacts();
    } else {
      toast({ title: "Failed to add contact", description: error.message, variant: "destructive" });
    }
    setSavingContact(false);
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (!error) { fetchContacts(); toast({ title: "Contact removed" }); }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() || "?";

  return (
    <Layout>
      <section className="section-padding gradient-hero min-h-[30vh] flex items-center">
        <div className="container-narrow w-full">
          <motion.div initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center text-primary-foreground font-bold text-xl">
                {initials}
              </div>
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-xl h-8 text-sm w-40" />
                    <button onClick={saveName} className="text-primary hover:text-primary/80"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingName(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile?.full_name || "My Account"}</h1>
                    <button onClick={() => setEditingName(true)} className="text-muted-foreground hover:text-primary"><Edit2 className="h-4 w-4" /></button>
                  </div>
                )}
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Button variant="outline" onClick={handleSignOut} className="rounded-xl gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          {/* Health Quick View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Period</p>
                <p className="font-bold text-sm">{nextPeriod || "Not enough data"}</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smile className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Mood</p>
                <p className="font-bold text-sm capitalize">{lastMood || "No mood logged yet"}</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Emergency Contacts */}
            <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Emergency Contacts</h2>
                    <p className="text-xs text-muted-foreground">Alerted when you trigger SOS</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setAddingContact(true)} className="gradient-purple border-0 text-primary-foreground rounded-xl gap-1">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              {addingContact && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl bg-muted/50 flex flex-col gap-3">
                  <Input placeholder="Contact name" className="rounded-xl" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                  <Input placeholder="Phone number (e.g. +91 9876543210)" className="rounded-xl" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  <Input placeholder="Relationship (e.g. Mother, Sister)" className="rounded-xl" value={contactRel} onChange={(e) => setContactRel(e.target.value)} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addContact} disabled={savingContact} className="gradient-purple border-0 text-primary-foreground rounded-xl flex-1">
                      {savingContact ? "Saving..." : "Save Contact"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setAddingContact(false)} className="rounded-xl">Cancel</Button>
                  </div>
                </motion.div>
              )}

              {contacts.length === 0 && !addingContact && (
                <div className="text-center py-8 text-muted-foreground">
                  <Phone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No emergency contacts yet.<br />Add contacts to receive SOS alerts.</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {contacts.map((c) => (
                  <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.phone}{c.relationship ? ` · ${c.relationship}` : ""}</div>
                    </div>
                    <button onClick={() => deleteContact(c.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Account Details</h2>
              </div>
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Full Name</div>
                  <div className="font-medium">{profile?.full_name || "Not set"}</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Email Address</div>
                  <div className="font-medium">{user?.email}</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Member Since</div>
                  <div className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-primary" />
                    <div className="text-xs font-semibold text-primary">SOS Status</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contacts.length > 0
                      ? `✅ SOS will alert ${contacts.length} contact${contacts.length > 1 ? "s" : ""}`
                      : "⚠️ Add emergency contacts to enable SOS alerts"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
