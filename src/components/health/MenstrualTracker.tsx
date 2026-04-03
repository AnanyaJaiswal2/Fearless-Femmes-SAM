import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Droplets, Heart, TrendingUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addDays, differenceInDays, format, subDays } from "date-fns";

interface PeriodLog {
  id: string;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
}

const MenstrualTracker = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<PeriodLog[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLogs();
    else setLoading(false);
  }, [user]);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from("period_logs")
      .select("*")
      .eq("user_id", user!.id)
      .order("start_date", { ascending: false });

    if (data) setLogs(data);
    setLoading(false);
  };

  const savePeriod = async () => {
    if (!user) {
      toast.error("Please sign in to track your cycle");
      return;
    }
    if (!startDate) {
      toast.error("Select a start date");
      return;
    }

    setSaving(true);

    const cycleLength =
      logs.length > 0
        ? differenceInDays(startDate, new Date(logs[0].start_date))
        : null;

    const { error } = await supabase.from("period_logs").insert({
      user_id: user.id,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
      cycle_length: cycleLength && cycleLength > 0 ? cycleLength : null,
    });

    if (!error) {
      toast.success("Cycle logged successfully!");
      setStartDate(undefined);
      setEndDate(undefined);
      fetchLogs();
    } else {
      toast.error("Failed to save");
    }

    setSaving(false);
  };

  // ✅ FIXED PREDICTION LOGIC
  const predictions = useMemo(() => {
    if (logs.length === 0) return null;

    const lastStart = new Date(logs[0].start_date);
    let avgCycle = 28; // default cycle

    if (logs.length >= 2) {
      const cycleLengths = logs
        .filter((l) => l.cycle_length && l.cycle_length > 0)
        .map((l) => l.cycle_length!);

      if (cycleLengths.length > 0) {
        avgCycle = Math.round(
          cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
        );
      }
    }

    const nextPeriod = addDays(lastStart, avgCycle);
    const ovulationDay = subDays(nextPeriod, 14);
    const fertileStart = subDays(ovulationDay, 3);
    const fertileEnd = addDays(ovulationDay, 1);

    return { avgCycle, nextPeriod, ovulationDay, fertileStart, fertileEnd };
  }, [logs]);

  // ✅ CALENDAR HIGHLIGHT FIX
  const calendarModifiers = useMemo(() => {
    const periodDays: Date[] = [];
    const fertileDays: Date[] = [];
    const ovulationDays: Date[] = [];

    // Past logs
    logs.forEach((log) => {
      const start = new Date(log.start_date);
      const end = log.end_date ? new Date(log.end_date) : addDays(start, 4);

      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        periodDays.push(new Date(d));
      }
    });

    if (predictions) {
      // Fertile window
      for (
        let d = new Date(predictions.fertileStart);
        d <= predictions.fertileEnd;
        d = addDays(d, 1)
      ) {
        fertileDays.push(new Date(d));
      }

      // Ovulation day
      ovulationDays.push(predictions.ovulationDay);

      // Next predicted period (5 days)
      for (
        let d = new Date(predictions.nextPeriod);
        d <= addDays(predictions.nextPeriod, 4);
        d = addDays(d, 1)
      ) {
        periodDays.push(new Date(d));
      }
    }

    return {
      period: periodDays,
      fertile: fertileDays,
      ovulation: ovulationDays,
    };
  }, [logs, predictions]);

  const calendarModifiersStyles = {
    period: {
      backgroundColor: "hsl(var(--destructive) / 0.2)",
      borderRadius: "50%",
      color: "hsl(var(--destructive))",
    },
    fertile: {
      backgroundColor: "hsl(var(--accent) / 0.25)",
      borderRadius: "50%",
      color: "hsl(var(--accent-foreground))",
    },
    ovulation: {
      backgroundColor: "hsl(var(--primary) / 0.25)",
      borderRadius: "50%",
      color: "hsl(var(--primary))",
    },
  };

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Droplets className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground text-sm">
          Sign in to start tracking your cycle
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-destructive" />
          Menstrual Cycle Tracker
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Select your period dates:
            </p>

            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              className="rounded-xl border"
              modifiers={calendarModifiers}
              modifiersStyles={calendarModifiersStyles}
            />

            <Button
              onClick={savePeriod}
              disabled={saving || !startDate}
              className="w-full mt-4 gradient-purple text-primary-foreground rounded-xl"
            >
              {saving ? "Saving..." : "Log Period"}
            </Button>
          </div>

          <div className="space-y-4">
            {predictions ? (
              <>
                <div className="p-4 rounded-xl bg-destructive/5 border">
                  <p className="font-bold">
                    Next Period:{" "}
                    {format(predictions.nextPeriod, "MMMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Avg cycle: {predictions.avgCycle} days
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-accent/10 border">
                  <p className="font-bold text-sm">
                    Fertile: {format(predictions.fertileStart, "MMM d")} –{" "}
                    {format(predictions.fertileEnd, "MMM d")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ovulation: {format(predictions.ovulationDay, "MMM d")}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto opacity-40" />
                <p className="text-sm text-muted-foreground">
                  Start tracking your cycle
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MenstrualTracker;