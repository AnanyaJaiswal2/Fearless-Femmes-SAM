import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Droplets, Heart, TrendingUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addDays, differenceInDays, format, isSameDay, isWithinInterval, subDays } from "date-fns";

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
    if (!user) { toast.error("Please sign in to track your cycle"); return; }
    if (!startDate) { toast.error("Select a start date"); return; }

    setSaving(true);
    const cycleLength = logs.length > 0
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

  const predictions = useMemo(() => {
    if (logs.length < 2) return null;

    const cycleLengths = logs
      .filter((l) => l.cycle_length && l.cycle_length > 0)
      .map((l) => l.cycle_length!);

    if (cycleLengths.length === 0) return null;

    const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    const lastStart = new Date(logs[0].start_date);
    const nextPeriod = addDays(lastStart, avgCycle);
    const ovulationDay = subDays(nextPeriod, 14);
    const fertileStart = subDays(ovulationDay, 3);
    const fertileEnd = addDays(ovulationDay, 1);

    return { avgCycle, nextPeriod, ovulationDay, fertileStart, fertileEnd };
  }, [logs]);

  // Build modifier dates for calendar
  const calendarModifiers = useMemo(() => {
    const periodDays: Date[] = [];
    const fertileDays: Date[] = [];
    const ovulationDays: Date[] = [];

    logs.forEach((log) => {
      const start = new Date(log.start_date);
      const end = log.end_date ? new Date(log.end_date) : addDays(start, 4);
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        periodDays.push(new Date(d));
      }
    });

    if (predictions) {
      for (let d = new Date(predictions.fertileStart); d <= predictions.fertileEnd; d = addDays(d, 1)) {
        fertileDays.push(new Date(d));
      }
      ovulationDays.push(predictions.ovulationDay);
    }

    return { period: periodDays, fertile: fertileDays, ovulation: ovulationDays };
  }, [logs, predictions]);

  const calendarModifiersStyles = {
    period: { backgroundColor: "hsl(var(--destructive) / 0.2)", borderRadius: "50%", color: "hsl(var(--destructive))" },
    fertile: { backgroundColor: "hsl(var(--accent) / 0.25)", borderRadius: "50%", color: "hsl(var(--accent-foreground))" },
    ovulation: { backgroundColor: "hsl(var(--primary) / 0.25)", borderRadius: "50%", color: "hsl(var(--primary))" },
  };

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Droplets className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground text-sm">Sign in to start tracking your cycle</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-destructive" /> Menstrual Cycle Tracker
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Select your period dates:</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-xl border pointer-events-auto"
                  modifiers={calendarModifiers}
                  modifiersStyles={calendarModifiersStyles}
                />
              </div>
              {startDate && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">End Date (optional)</label>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < startDate}
                    className="rounded-xl border pointer-events-auto"
                  />
                </div>
              )}
              <Button onClick={savePeriod} disabled={saving || !startDate}
                className="w-full gradient-purple text-primary-foreground border-0 rounded-xl">
                {saving ? "Saving..." : "Log Period"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Predictions */}
            {predictions ? (
              <>
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-destructive" />
                    <span className="text-xs font-semibold text-destructive">Next Period</span>
                  </div>
                  <p className="font-bold">{format(predictions.nextPeriod, "MMMM d, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">Avg cycle: {predictions.avgCycle} days</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-accent-foreground" />
                    <span className="text-xs font-semibold text-accent-foreground">Fertile Window</span>
                  </div>
                  <p className="font-bold text-sm">
                    {format(predictions.fertileStart, "MMM d")} – {format(predictions.fertileEnd, "MMM d")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ovulation: {format(predictions.ovulationDay, "MMM d")}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground">
                  {logs.length === 0 ? "Start tracking your cycle" : "Log at least 2 cycles for predictions"}
                </p>
              </div>
            )}

            {/* Cycle History */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Cycle History</h4>
              {loading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
              ) : logs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No cycles logged yet</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {logs.slice(0, 10).map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-muted/50 text-sm flex justify-between">
                      <span>
                        {format(new Date(log.start_date), "MMM d")}
                        {log.end_date && ` – ${format(new Date(log.end_date), "MMM d")}`}
                      </span>
                      {log.cycle_length && (
                        <span className="text-xs text-muted-foreground">{log.cycle_length} days</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/30" /> Period
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-accent/25 border border-accent/30" /> Fertile
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary/25 border border-primary/30" /> Ovulation
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MenstrualTracker;
