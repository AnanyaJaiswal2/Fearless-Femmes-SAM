import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fadeUp } from "@/lib/animations";
import { toast } from "sonner";

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  education: { degree: string; institution: string; year: string }[];
  skills: string;
  projects: { title: string; description: string }[];
  experience: { role: string; company: string; duration: string; description: string }[];
  certifications: string;
  achievements: string;
}

const emptyResume: ResumeData = {
  fullName: "", email: "", phone: "",
  education: [{ degree: "", institution: "", year: "" }],
  skills: "",
  projects: [{ title: "", description: "" }],
  experience: [{ role: "", company: "", duration: "", description: "" }],
  certifications: "", achievements: "",
};

const ResumeBuilder = () => {
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState<ResumeData>({ ...emptyResume });
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof ResumeData, value: any) => setResume((prev) => ({ ...prev, [field]: value }));

  const addItem = (field: "education" | "projects" | "experience") => {
    const templates = {
      education: { degree: "", institution: "", year: "" },
      projects: { title: "", description: "" },
      experience: { role: "", company: "", duration: "", description: "" },
    };
    setResume((prev) => ({ ...prev, [field]: [...prev[field], templates[field]] }));
  };

  const removeItem = (field: "education" | "projects" | "experience", index: number) => {
    setResume((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (field: "education" | "projects" | "experience", index: number, key: string, value: string) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      html2pdf().set({
        margin: 0.5,
        filename: `${resume.fullName || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      }).from(previewRef.current).save();
      toast.success("Resume downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <section className="section-padding">
      <div className="container-narrow max-w-2xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold mb-3">Resume Builder</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mb-6">Create a professional ATS-friendly resume and download as PDF</motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gradient-purple text-primary-foreground rounded-2xl border-0 gap-2 px-8">
                  <FileText className="h-5 w-5" /> Build Your Resume
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    Resume Builder
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-1 rounded-lg">
                        <Eye className="h-4 w-4" /> {showPreview ? "Edit" : "Preview"}
                      </Button>
                      {showPreview && (
                        <Button size="sm" onClick={handleDownloadPDF} className="gap-1 rounded-lg gradient-purple text-primary-foreground border-0">
                          <Download className="h-4 w-4" /> Download PDF
                        </Button>
                      )}
                    </div>
                  </DialogTitle>
                </DialogHeader>

                {showPreview ? (
                  <div ref={previewRef} className="bg-white text-black p-8 rounded-lg" style={{ fontFamily: "Georgia, serif", fontSize: "12px", lineHeight: "1.5" }}>
                    <div style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: "12px", marginBottom: "16px" }}>
                      <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{resume.fullName || "Your Name"}</h1>
                      <p style={{ margin: "4px 0", color: "#555" }}>
                        {[resume.email, resume.phone].filter(Boolean).join(" | ")}
                      </p>
                    </div>

                    {resume.education.some((e) => e.degree) && (
                      <div style={{ marginBottom: "14px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "8px" }}>Education</h2>
                        {resume.education.filter((e) => e.degree).map((ed, i) => (
                          <div key={i} style={{ marginBottom: "6px" }}>
                            <strong>{ed.degree}</strong> — {ed.institution} {ed.year && `(${ed.year})`}
                          </div>
                        ))}
                      </div>
                    )}

                    {resume.skills && (
                      <div style={{ marginBottom: "14px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "8px" }}>Skills</h2>
                        <p>{resume.skills}</p>
                      </div>
                    )}

                    {resume.experience.some((e) => e.role) && (
                      <div style={{ marginBottom: "14px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "8px" }}>Experience</h2>
                        {resume.experience.filter((e) => e.role).map((exp, i) => (
                          <div key={i} style={{ marginBottom: "8px" }}>
                            <strong>{exp.role}</strong> — {exp.company} {exp.duration && `(${exp.duration})`}
                            {exp.description && <p style={{ marginTop: "2px", color: "#444" }}>{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {resume.projects.some((p) => p.title) && (
                      <div style={{ marginBottom: "14px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "8px" }}>Projects</h2>
                        {resume.projects.filter((p) => p.title).map((proj, i) => (
                          <div key={i} style={{ marginBottom: "6px" }}>
                            <strong>{proj.title}</strong>
                            {proj.description && <p style={{ marginTop: "2px", color: "#444" }}>{proj.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {resume.certifications && (
                      <div style={{ marginBottom: "14px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "8px" }}>Certifications</h2>
                        <p>{resume.certifications}</p>
                      </div>
                    )}

                    {resume.achievements && (
                      <div>
                        <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "8px" }}>Achievements</h2>
                        <p>{resume.achievements}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div>
                      <h3 className="font-semibold mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input value={resume.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Full Name" className="rounded-lg" />
                        <Input value={resume.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" className="rounded-lg" />
                        <Input value={resume.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" className="rounded-lg" />
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Education</h3>
                        <Button variant="ghost" size="sm" onClick={() => addItem("education")} className="gap-1 text-primary"><Plus className="h-3 w-3" /> Add</Button>
                      </div>
                      {resume.education.map((ed, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 mb-2">
                          <Input value={ed.degree} onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)} placeholder="Degree" className="rounded-lg" />
                          <Input value={ed.institution} onChange={(e) => updateArrayItem("education", i, "institution", e.target.value)} placeholder="Institution" className="rounded-lg" />
                          <Input value={ed.year} onChange={(e) => updateArrayItem("education", i, "year", e.target.value)} placeholder="Year" className="rounded-lg w-20" />
                          {resume.education.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem("education", i)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="font-semibold mb-3">Skills</h3>
                      <Input value={resume.skills} onChange={(e) => update("skills", e.target.value)} placeholder="e.g., React, Python, Communication, Data Analysis..." className="rounded-lg" />
                    </div>

                    {/* Experience */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Experience</h3>
                        <Button variant="ghost" size="sm" onClick={() => addItem("experience")} className="gap-1 text-primary"><Plus className="h-3 w-3" /> Add</Button>
                      </div>
                      {resume.experience.map((exp, i) => (
                        <div key={i} className="space-y-2 mb-3 p-3 border border-border rounded-lg">
                          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2">
                            <Input value={exp.role} onChange={(e) => updateArrayItem("experience", i, "role", e.target.value)} placeholder="Role" className="rounded-lg" />
                            <Input value={exp.company} onChange={(e) => updateArrayItem("experience", i, "company", e.target.value)} placeholder="Company" className="rounded-lg" />
                            <Input value={exp.duration} onChange={(e) => updateArrayItem("experience", i, "duration", e.target.value)} placeholder="Duration" className="rounded-lg w-28" />
                            {resume.experience.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem("experience", i)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                          </div>
                          <Textarea value={exp.description} onChange={(e) => updateArrayItem("experience", i, "description", e.target.value)} placeholder="Description" className="rounded-lg min-h-[60px]" />
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Projects</h3>
                        <Button variant="ghost" size="sm" onClick={() => addItem("projects")} className="gap-1 text-primary"><Plus className="h-3 w-3" /> Add</Button>
                      </div>
                      {resume.projects.map((proj, i) => (
                        <div key={i} className="space-y-2 mb-3 p-3 border border-border rounded-lg">
                          <div className="flex gap-2">
                            <Input value={proj.title} onChange={(e) => updateArrayItem("projects", i, "title", e.target.value)} placeholder="Project Title" className="rounded-lg flex-1" />
                            {resume.projects.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem("projects", i)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                          </div>
                          <Textarea value={proj.description} onChange={(e) => updateArrayItem("projects", i, "description", e.target.value)} placeholder="Description" className="rounded-lg min-h-[60px]" />
                        </div>
                      ))}
                    </div>

                    {/* Certifications & Achievements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-3">Certifications</h3>
                        <Textarea value={resume.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="List your certifications..." className="rounded-lg min-h-[80px]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Achievements</h3>
                        <Textarea value={resume.achievements} onChange={(e) => update("achievements", e.target.value)} placeholder="List your achievements..." className="rounded-lg min-h-[80px]" />
                      </div>
                    </div>

                    <Button onClick={() => setShowPreview(true)} className="w-full gradient-purple text-primary-foreground rounded-xl border-0 gap-2">
                      <Eye className="h-4 w-4" /> Preview Resume
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeBuilder;
