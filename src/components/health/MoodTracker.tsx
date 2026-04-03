import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Frown, Meh, Smile, SmilePlus, Laugh, Angry, CloudRain, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, subDays, startOfDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const moods = [
  { key: "happy", icon: Laugh, label: "Happy", color: "hsl(142, 71%, 45%)" },
  { key: "good", icon: SmilePlus, label: "Good", color: "hsl(275, 73%, 35%)" },
  { key: "okay", icon: Smile, label: "Okay", color: "hsl(210, 40%, 55%)" },
  { key: "sad", icon: Frown, label: "Sad", color: "hsl(220, 60%, 50%)" },
  { key: "anxious", icon: CloudRain, label: "Anxious", color: "hsl(35, 80%, 55%)" },
  { key: "angry", icon: Angry, label: "Angry", color: "hsl(0, 84%, 60%)" },
  { key: "tired", icon: Battery, label: "Tired", color: "hsl(275, 15%, 55%)" },
];

interface MoodLog {
  id: string;
  mood: string;
  logged_at: string;
}

interface MoodTrackerProps {
  onMoodLogged?: () => void;
}

const MoodTracker = ({ onMoodLogged }: MoodTrackerProps) => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [recentLogs, setRecentLogs] = useState<MoodLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLogs();
    else setLoading(false);
  }, [user]);

  const fetchLogs = async () => {
    const sevenDaysAgo = subDays(new Date(), 7).toISOString();
    const { data } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user!.id)
      .gte("logged_at", sevenDaysAgo)
      .order("logged_at", { ascending: false });
    if (data) setRecentLogs(data);
    setLoading(false);
  };

  const saveMood = async () => {
    if (!user) { toast.error("Please sign in to track your mood"); return; }
    if (!selectedMood) return;

    setSaving(true);
    const { error } = await supabase.from("mood_logs").insert({
      user_id: user.id,
      mood: selectedMood,
    });

    if (!error) {
      toast.success("Mood saved! 💜");
      setSelectedMood(null);
      fetchLogs();
      onMoodLogged?.();
    } else {
      toast.error("Failed to save mood");
    }
    setSaving(false);
  };

  // Chart data: mood frequency over last 7 days
  const chartData = moods.map((m) => ({
    name: m.label,
    count: recentLogs.filter((l) => l.mood === m.key).length,
    color: m.color,
  })).filter((d) => d.count > 0);

  // History by day
  const dayHistory = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    const dayLogs = recentLogs.filter(
      (l) => format(new Date(l.logged_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
    const latestMood = dayLogs[0]?.mood;
    const moodInfo = moods.find((m) => m.key === latestMood);
    return { day: format(day, "EEE"), mood: moodInfo, date: format(day, "MMM d") };
  });

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Smile className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground text-sm">Sign in to track your mood</p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4">How are you feeling today?</h3>
      <p className="text-sm text-muted-foreground mb-4">Track your mood daily for better self-awareness</p>

      {/* Mood Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {moods.map((m) => (
          <button key={m.key} onClick={() => setSelectedMood(m.key)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200 ${
              selectedMood === m.key ? "bg-primary/10 scale-110 ring-2 ring-primary/30" : "hover:bg-muted"
            }`}>
            <m.icon className="h-7 w-7" style={{ color: m.color }} />
            <span className="text-xs font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            You're feeling <strong>{moods.find((m) => m.key === selectedMood)?.label}</strong>
          </p>
          <Button onClick={saveMood} disabled={saving} className="gradient-purple text-primary-foreground rounded-xl border-0">
            {saving ? "Saving..." : "Log Mood"}
          </Button>
        </motion.div>
      )}

      {/* 7-Day History */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3">Last 7 Days</h4>
        <div className="flex justify-between gap-1">
          {dayHistory.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${d.mood ? "bg-muted/50" : "bg-muted/20"}`}>
                {d.mood ? <d.mood.icon className="h-4 w-4" style={{ color: d.mood.color }} /> : <Meh className="h-4 w-4 text-muted-foreground/30" />}
              </div>
              <span className="text-[9px] text-muted-foreground">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency Chart */}
      {chartData.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold mb-3">Mood Frequency (7 Days)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <p>No mood data yet. Start logging to see trends!</p>
          </div>
        )
      )}
    </motion.div>
  );
};

export default MoodTracker;
