import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus, Sparkles, Music, BookOpen, Wind, Heart } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";

interface MoodLog {
  mood: string;
  logged_at: string;
}

const moodScores: Record<string, number> = {
  happy: 5, good: 4, okay: 3, sad: 1, anxious: 2, angry: 1, tired: 2,
};

const suggestions = [
  { icon: Wind, label: "Breathing Exercise", desc: "Try 4-7-8 breathing for 5 minutes", mood: ["anxious", "angry"] },
  { icon: BookOpen, label: "Journaling", desc: "Write down 3 things you're grateful for", mood: ["sad", "okay"] },
  { icon: Music, label: "Listen to Music", desc: "Put on your favorite uplifting playlist", mood: ["sad", "tired"] },
  { icon: Heart, label: "Meditation", desc: "A 10-minute guided meditation session", mood: ["anxious", "angry", "sad"] },
  { icon: Sparkles, label: "Self-Care", desc: "Take a break, have tea, go for a walk", mood: ["tired", "okay"] },
];

const EmotionalInsights = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLogs();
    else setLoading(false);
  }, [user]);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from("mood_logs")
      .select("mood, logged_at")
      .eq("user_id", user!.id)
      .gte("logged_at", subDays(new Date(), 14).toISOString())
      .order("logged_at", { ascending: true });
    if (data) setLogs(data);
    setLoading(false);
  };

  const insights = useMemo(() => {
    if (logs.length < 3) return null;

    // Most frequent mood
    const freq: Record<string, number> = {};
    logs.forEach((l) => { freq[l.mood] = (freq[l.mood] || 0) + 1; });
    const dominantMood = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

    // Trend: compare first half vs second half
    const half = Math.floor(logs.length / 2);
    const firstHalf = logs.slice(0, half);
    const secondHalf = logs.slice(half);
    const avgFirst = firstHalf.reduce((s, l) => s + (moodScores[l.mood] || 3), 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((s, l) => s + (moodScores[l.mood] || 3), 0) / secondHalf.length;

    const diff = avgSecond - avgFirst;
    let trend: "improving" | "declining" | "stable";
    if (diff > 0.5) trend = "improving";
    else if (diff < -0.5) trend = "declining";
    else trend = "stable";

    // Messages
    const messages: string[] = [];
    if (dominantMood === "anxious") messages.push("You've been feeling anxious often. Consider calming activities.");
    else if (dominantMood === "sad") messages.push("You've been feeling low recently. Reach out to someone you trust.");
    else if (dominantMood === "angry") messages.push("Stress levels seem high. Try physical activity or breathing exercises.");
    else if (dominantMood === "tired") messages.push("You seem fatigued. Prioritize rest and nutrition.");
    else if (dominantMood === "happy" || dominantMood === "good") messages.push("You're doing great! Keep up the positive energy. 💜");
    else messages.push("Your mood has been neutral. Small joyful activities can help boost it.");

    if (trend === "improving") messages.push("Your mood is improving over the last few days! 📈");
    else if (trend === "declining") messages.push("Your mood has been declining. Be kind to yourself.");

    // Relevant suggestions
    const recentMoods = logs.slice(-5).map((l) => l.mood);
    const relevantSuggestions = suggestions.filter((s) => s.mood.some((m) => recentMoods.includes(m)));
    const fallbackSuggestions = suggestions.slice(0, 3);

    return {
      dominantMood,
      trend,
      messages,
      suggestions: relevantSuggestions.length > 0 ? relevantSuggestions : fallbackSuggestions,
    };
  }, [logs]);

  const TrendIcon = insights?.trend === "improving" ? TrendingUp
    : insights?.trend === "declining" ? TrendingDown : Minus;

  const trendColor = insights?.trend === "improving" ? "text-green-600"
    : insights?.trend === "declining" ? "text-destructive" : "text-muted-foreground";

  if (!user) return null;

  return (
    <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" /> Emotional Insights
      </h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">Analyzing your mood data...</p>
      ) : !insights ? (
        <div className="text-center py-6">
          <Brain className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-sm text-muted-foreground">Log at least 3 moods to get personalized insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Trend */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
            <TrendIcon className={`h-6 w-6 ${trendColor}`} />
            <div>
              <p className="text-sm font-semibold capitalize">Mood Trend: {insights.trend}</p>
              <p className="text-xs text-muted-foreground">Based on your last 14 days</p>
            </div>
          </div>

          {/* Messages */}
          {insights.messages.map((msg, i) => (
            <div key={i} className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm">
              {msg}
            </div>
          ))}

          {/* Suggestions */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Suggested Activities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.suggestions.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/50 flex items-start gap-3 hover:bg-muted transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmotionalInsights;
