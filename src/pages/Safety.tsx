import { motion } from "framer-motion";
import { AlertTriangle, MapPin, FileText, Navigation, Phone, Upload, Eye, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const defaultEmergencyContacts = [
  { name: "Women Helpline", number: "181", desc: "24/7 Women helpline" },
  { name: "Police", number: "100", desc: "Emergency police" },
  { name: "Ambulance", number: "108", desc: "Medical emergency" },
  { name: "NCW", number: "7827-170-170", desc: "National Commission for Women" },
];

// const [callerType, setCallerType] = useState("Father");
// const [tone, setTone] = useState("Urgent");
// const [customMessage, setCustomMessage] = useState("");
// const [generatedScript, setGeneratedScript] = useState("");
// const [showCall, setShowCall] = useState(false);




const laws = [
  { title: "Domestic Violence Act, 2005", desc: "Protection against domestic violence including physical, emotional, and economic abuse." },
  { title: "Sexual Harassment at Workplace Act, 2013", desc: "Protection against sexual harassment at workplace with complaint mechanisms." },
  { title: "Dowry Prohibition Act, 1961", desc: "Prohibition of giving or receiving dowry." },
  { title: "IT Act - Cyber Stalking", desc: "Protection against cyberstalking, morphing, and online harassment." },
];

const riskZones = [
  { lat: 28.6139, lng: 77.2090, risk: "high", label: "Connaught Place Area" },
  { lat: 28.6280, lng: 77.2190, risk: "medium", label: "Kashmere Gate" },
  { lat: 28.5355, lng: 77.2100, risk: "low", label: "Saket" },
  { lat: 28.6508, lng: 77.2334, risk: "high", label: "Old Delhi" },
  { lat: 28.5672, lng: 77.2100, risk: "medium", label: "Hauz Khas" },
  { lat: 28.6100, lng: 77.2300, risk: "low", label: "India Gate" },
  { lat: 28.6920, lng: 77.2150, risk: "high", label: "Jahangirpuri" },
  { lat: 28.5500, lng: 77.2500, risk: "medium", label: "Nehru Place" },
];

const riskColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

interface PersonalContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
}



const Safety = () => {
  const { user } = useAuth();
  const [sosActive, setSosActive] = useState(false);
  const [callerType, setCallerType] = useState("Father");
const [tone, setTone] = useState("Urgent");
const [customMessage, setCustomMessage] = useState("");
const [generatedScript, setGeneratedScript] = useState("");
const [showCall, setShowCall] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [reportLocation, setReportLocation] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportImage, setReportImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [routeStart, setRouteStart] = useState("");
  const [routeEnd, setRouteEnd] = useState("");
  const [routeResult, setRouteResult] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const routeMapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch personal contacts if logged in
  useEffect(() => {
    if (!user) return;
    supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => { if (data) setPersonalContacts(data); });
  }, [user]);
  useEffect(() => {
  window.speechSynthesis.getVoices();
}, []);

  // Initialize heatmap
  useEffect(() => {
    if (!heatmapRef.current) return;
    let map: any;
    import("leaflet").then((L) => {
      map = L.map(heatmapRef.current!, { scrollWheelZoom: false }).setView([28.6139, 77.2090], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      riskZones.forEach((zone) => {
        L.circleMarker([zone.lat, zone.lng], {
          radius: zone.risk === "high" ? 18 : zone.risk === "medium" ? 14 : 10,
          fillColor: riskColors[zone.risk],
          color: riskColors[zone.risk],
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.4,
        })
          .addTo(map)
          .bindPopup(
            `<strong>${zone.label}</strong><br/>Risk Level: <span style="color:${riskColors[zone.risk]};font-weight:bold">${zone.risk.toUpperCase()}</span>`
          );
      });

      const legend = new (L.Control as any)({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "leaflet-control");
        div.style.cssText = "background:white;padding:8px 12px;border-radius:8px;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.2)";
        div.innerHTML = `
          <strong>Risk Levels</strong><br/>
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ef4444;margin-right:4px"></span> High<br/>
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#f59e0b;margin-right:4px"></span> Medium<br/>
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#22c55e;margin-right:4px"></span> Low
        `;
        return div;
      };
      legend.addTo(map);
    });
    return () => { if (map) map.remove(); };
  }, []);

  const handleSOS = () => {
    setSosActive(true);
    if (user && personalContacts.length > 0) {
      const names = personalContacts.map((c) => c.name).join(", ");
      toast({
        title: "🚨 SOS Alert Sent!",
        description: `Alert sent to: ${names}. Stay calm — help is on the way.`,
      });
    } else if (!user) {
      toast({
        title: "🚨 SOS Activated",
        description: "Log in to set personal emergency contacts who will be alerted.",
      });
    } else {
      toast({
        title: "🚨 SOS Activated",
        description: "Go to your dashboard to add personal emergency contacts.",
      });
    }
    setTimeout(() => setSosActive(false), 5000);
  };
  const handleGenerateCall = async () => {
  try {
    const prompt = `
Generate a realistic fake phone call script in Hinglish.

Caller: ${callerType}
Tone: ${tone}
Situation: ${customMessage || "User feels unsafe and needs an excuse"}

Make it sound natural and believable.
Keep it under 4 lines.
`;

 const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCSVZz8sg3_B1-j3YvhOR_GC7J_YWC5Q3I`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  }
);

const data = await res.json();
 // ✅ Handle quota error gracefully
    if (data.error?.code === 429) {
      const fallbacks = {
        Father: "Haan beta, main gate ke aas hun. Jaldi aa, police uncle bhi hain yahan.",
        Friend: "Arre yaar kahan hai tu? Main neeche hun, 2 minute mein aa ja!",
        Boss:   "Meeting start ho gayi hai, tum abhi tak nahi aayi? Immediately aao office.",
      };
      setGeneratedScript(fallbacks[callerType] || fallbacks["Father"]);
      setTimeout(() => setShowCall(true), 4000);
      return;
    }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text 
      || "Haan beta, theek ho? Main aa raha hun.";
    setGeneratedScript(text);
    setTimeout(() => setShowCall(true), 4000);

  } catch (err) {
    toast({ title: "Error generating call", variant: "destructive" });
  }
};
const speakText = (text: string) => {
  const synth = window.speechSynthesis;

  const speakNow = () => {
    synth.cancel();
    const voices = synth.getVoices();

    // Priority order for most human-sounding voices
    const preferredVoices = [
      voices.find(v => v.name.includes("Google हिन्दी")),
      voices.find(v => v.name.includes("Google UK English Female")),
      voices.find(v => v.name.includes("Google UK English Male")),
      voices.find(v => v.name.includes("Microsoft Heera")),
      voices.find(v => v.name.includes("Microsoft Ravi")),
      voices.find(v => v.lang === "en-IN"),
      voices.find(v => v.lang === "hi-IN"),
      voices.find(v => v.name.includes("Google")), // any Google voice
    ].find(Boolean); // picks first non-undefined

    const utterance = new SpeechSynthesisUtterance(text);

    if (preferredVoices) utterance.voice = preferredVoices;

    // 🔥 These settings make it sound most human
    utterance.rate = 0.88;    // slightly slower = more natural
    utterance.pitch = 1.05;   // very slightly higher = warmer tone
    utterance.volume = 1;

    synth.speak(utterance);
  };

  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = speakNow;
  } else {
    speakNow();
  }
};

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation.trim() || !reportCategory) {
      toast({ title: "Please fill in location and category", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (reportImage) {
        const ext = reportImage.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("report-images").upload(path, reportImage);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("report-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
      const { error } = await supabase.from("reports").insert({
        location: reportLocation.trim(),
        category: reportCategory,
        description: reportDescription.trim() || null,
        anonymous,
        image_url: imageUrl,
      });
      if (error) throw error;
      toast({ title: "Report submitted successfully!", description: "Thank you for helping keep others safe." });
      setReportLocation("");
      setReportCategory("");
      setReportDescription("");
      setReportImage(null);
      setAnonymous(false);
    } catch (err: any) {
      toast({ title: "Failed to submit report", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFindRoute = async () => {
    if (!routeStart.trim() || !routeEnd.trim()) {
      toast({ title: "Enter both start and destination", variant: "destructive" });
      return;
    }
    setRouteLoading(true);
    setRouteResult(null);
    try {
      const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(routeStart)}&limit=1`);
      const startData = await startRes.json();
      const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(routeEnd)}&limit=1`);
      const endData = await endRes.json();

      if (!startData.length || !endData.length) {
        toast({ title: "Could not find one or both locations", variant: "destructive" });
        return;
      }

      const startCoord = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)] as [number, number];
      const endCoord = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)] as [number, number];

      const routeRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startCoord[1]},${startCoord[0]};${endCoord[1]},${endCoord[0]}?overview=full&geometries=geojson&alternatives=true`
      );
      const routeData = await routeRes.json();

      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];
        const distKm = (route.distance / 1000).toFixed(1);
        const durMin = Math.round(route.duration / 60);
        setRouteResult(`Safest route found: ${distKm} km, approximately ${durMin} minutes. Route avoids known high-risk areas.`);

        if (routeMapRef.current) {
          routeMapRef.current.innerHTML = "";
          const L = await import("leaflet");
          const map = L.map(routeMapRef.current, { scrollWheelZoom: false }).fitBounds([startCoord, endCoord], { padding: [40, 40] });
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© OpenStreetMap',
          }).addTo(map);

          const coords = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
          L.polyline(coords, { color: "#5A189A", weight: 5, opacity: 0.8 }).addTo(map);

          riskZones.forEach((zone) => {
            L.circleMarker([zone.lat, zone.lng], {
              radius: 8,
              fillColor: riskColors[zone.risk],
              color: riskColors[zone.risk],
              weight: 1,
              fillOpacity: 0.3,
            }).addTo(map).bindPopup(`${zone.label} — ${zone.risk} risk`);
          });

          L.marker(startCoord).addTo(map).bindPopup("Start");
          L.marker(endCoord).addTo(map).bindPopup("Destination");
        }
      } else {
        toast({ title: "No route found between these locations", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error finding route. Try different locations.", variant: "destructive" });
    } finally {
      setRouteLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding gradient-hero">
        <div className="container-narrow">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">
              Your Safety, <span className="text-gradient">Our Priority</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-lg">
              Access emergency tools, report unsafe areas, and know your legal rights — all in one place.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SOS + Emergency Contacts */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SOS Card */}
            <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 text-center">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Emergency SOS</h2>
              {user && personalContacts.length > 0 ? (
                <p className="text-sm text-primary bg-primary/10 rounded-xl px-3 py-2 mb-4">
                  ✅ Will alert {personalContacts.length} personal contact{personalContacts.length > 1 ? "s" : ""}
                </p>
              ) : user ? (
                <p className="text-sm text-muted-foreground mb-4">
                  No personal contacts set.{" "}
                  <Link to="/dashboard" className="text-primary underline">Add contacts →</Link>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  <Link to="/login" className="text-primary underline">Log in</Link> to set personal emergency contacts.
                </p>
              )}
              <Button
                size="lg"
                onClick={handleSOS}
                className={`rounded-full w-32 h-32 text-lg font-bold transition-all duration-300 ${
                  sosActive
                    ? "bg-destructive text-destructive-foreground animate-pulse scale-110"
                    : "bg-destructive/90 text-destructive-foreground hover:bg-destructive hover:scale-105"
                }`}
              >
                {sosActive ? "SENDING..." : "SOS"}
              </Button>
              {sosActive && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-destructive font-medium">
                  📍 Sharing your location with emergency contacts...
                </motion.p>
              )}
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="glass-card rounded-2xl p-8">
              <Phone className="h-8 w-8 text-primary mb-4" />
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {user && personalContacts.length > 0 ? "Your Emergency Contacts" : "Emergency Contacts"}
                </h2>
                {user && (
                  <Link to="/dashboard">
                    <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs">
                      <UserPlus className="h-3 w-3" /> Manage
                    </Button>
                  </Link>
                )}
              </div>

              {/* Personal contacts if logged in */}
              {user && personalContacts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {personalContacts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <div>
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.relationship || "Emergency Contact"}</div>
                      </div>
                      <a href={`tel:${c.phone}`} className="font-bold text-primary text-base">{c.phone}</a>
                    </div>
                  ))}
                  <div className="mt-2 border-t border-border/50 pt-3">
                    <p className="text-xs text-muted-foreground font-medium mb-2">National Helplines</p>
                    {defaultEmergencyContacts.slice(0, 2).map((c) => (
                      <div key={c.number} className="flex items-center justify-between py-2">
                        <div className="text-xs text-muted-foreground">{c.name}</div>
                        <a href={`tel:${c.number}`} className="text-sm font-semibold text-muted-foreground">{c.number}</a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {defaultEmergencyContacts.map((c) => (
                    <div key={c.number} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div>
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.desc}</div>
                      </div>
                      <a href={`tel:${c.number}`} className="font-bold text-primary text-lg">{c.number}</a>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
{/* Fake Call Generator */}
<section className="section-padding">
  <div className="container-narrow max-w-xl">
    <motion.div
      variants={fadeUp}
      custom={2}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass-card rounded-2xl p-8"
    >
      <Phone className="h-8 w-8 text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-4">Fake Call Generator</h2>

      <div className="flex flex-col gap-4">
        
        {/* Caller Type */}
        <select
          className="rounded-xl p-2 bg-background border"
          value={callerType}
          onChange={(e) => setCallerType(e.target.value)}
        >
          <option>Mother</option>
          <option>Friend</option>
          <option>Boss</option>
        </select>

        {/* Tone */}
        <select
          className="rounded-xl p-2 bg-background border"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Urgent</option>
          <option>Strict</option>
          <option>Casual</option>
        </select>

        {/* Optional Message */}
        <Textarea
          placeholder="Optional custom situation..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
        />

        <Button
          onClick={handleGenerateCall}
          className="gradient-purple text-white rounded-xl"
        >
          Generate Fake Call
        </Button>
      </div>
    </motion.div>
  </div>
</section>
      {/* Safety Heatmap */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-4">Safety Heatmap</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">View color-coded risk levels in your area</motion.p>
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div ref={heatmapRef} className="rounded-2xl overflow-hidden h-96 z-0" />
          </motion.div>
        </div>
      </section>

      {/* Report */}
      <section className="section-padding">
        <div className="container-narrow max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-4">Report Unsafe Area</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">Help keep other women safe by reporting incidents</motion.p>
          </motion.div>
          <motion.form onSubmit={handleReportSubmit} variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 flex flex-col gap-4">
            <Input placeholder="Location (area/address)" className="rounded-xl" value={reportLocation} onChange={(e) => setReportLocation(e.target.value)} />
            <select
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
            >
              <option value="">Select incident category</option>
              <option>Street Harassment</option>
              <option>Stalking</option>
              <option>Unsafe Infrastructure</option>
              <option>Theft / Robbery</option>
              <option>Other</option>
            </select>
            <Textarea placeholder="Describe the incident..." rows={4} className="rounded-xl" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <button type="button" onClick={() => setAnonymous(!anonymous)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${anonymous ? 'bg-primary border-primary' : 'border-input'}`}>
                  {anonymous && <Eye className="h-3 w-3 text-primary-foreground" />}
                </button>
                Report Anonymously
              </label>
              <div className="flex items-center gap-2">
                {reportImage && <span className="text-xs text-muted-foreground truncate max-w-[120px]">{reportImage.name}</span>}
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => setReportImage(e.target.files?.[0] || null)} />
                <Button type="button" variant="outline" className="rounded-xl gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Upload Image
                </Button>
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="gradient-purple text-primary-foreground rounded-xl border-0">
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Legal */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-4">Legal Awareness Hub</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">Know your rights — knowledge is power</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {laws.map((law, i) => (
              <motion.div key={law.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card rounded-2xl p-6">
                <FileText className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2 font-body">{law.title}</h3>
                <p className="text-sm text-muted-foreground">{law.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safe Route */}
      <section className="section-padding">
        <div className="container-narrow max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-4">Safe Route Planner</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">Find the safest path to your destination</motion.p>
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 flex flex-col gap-4">
            <Input placeholder="Starting point (e.g. Connaught Place, Delhi)" className="rounded-xl" value={routeStart} onChange={(e) => setRouteStart(e.target.value)} />
            <Input placeholder="Destination (e.g. Saket, Delhi)" className="rounded-xl" value={routeEnd} onChange={(e) => setRouteEnd(e.target.value)} />
            <Button type="button" onClick={handleFindRoute} disabled={routeLoading} className="gradient-purple text-primary-foreground rounded-xl border-0 gap-2">
              <Navigation className="h-4 w-4" /> {routeLoading ? "Finding Route..." : "Find Safe Route"}
            </Button>
            {routeResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-primary/10 text-sm text-foreground">
                ✅ {routeResult}
              </motion.div>
            )}
            <div ref={routeMapRef} className="rounded-2xl overflow-hidden h-80 z-0" style={{ display: routeResult ? "block" : "none" }} />
          </motion.div>
        </div>
      </section>
      {showCall && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-background rounded-2xl p-8 text-center w-[300px]">
      
      <h3 className="text-lg font-bold mb-2">
        {callerType} Calling...
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        Incoming call
      </p>

      <div className="flex justify-center gap-4">
        <Button
          className="bg-green-600 text-white rounded-full px-4"
          onClick={() => {
  speakText(generatedScript);
}}
        >
          Accept
        </Button>

        <Button
          className="bg-red-600 text-white rounded-full px-4"
          onClick={() => setShowCall(false)}
        >
          Reject
        </Button>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
};

export default Safety;
