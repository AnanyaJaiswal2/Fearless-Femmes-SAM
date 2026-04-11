import { motion } from "framer-motion";
import { useRef } from "react";
import Layout from "@/components/Layout";
import { fadeUp } from "@/lib/animations";
import CareerRoadmaps from "@/components/career/CareerRoadmaps";
import CareerGuide from "@/components/career/CareerGuide";
import InternshipBoard from "@/components/career/InternshipBoard";
import ScholarshipBoard from "@/components/career/ScholarshipBoard";
import ResumeBuilder from "@/components/career/ResumeBuilder";

const Career = () => {
  const roadmapRef = useRef<HTMLDivElement>(null);

  const scrollToRoadmaps = () => {
    roadmapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section
        className="section-padding relative bg-cover bg-right"
        style={{
          backgroundImage: "url(/images/career-banner.jpeg)",
        }}
      >
        {/* Overlay (text readable banane ke liye) */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>

        <div className="container-narrow relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Build Your <span className="text-gradient">Dream Career</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg text-muted-foreground max-w-lg"
            >
              Explore AI-powered roadmaps, find mentors, build your resume,
              and discover opportunities — all tailored for women.
            </motion.p>

          </motion.div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div ref={roadmapRef}>
        <CareerRoadmaps />
      </div>

      <CareerGuide onExploreRoadmap={scrollToRoadmaps} />
      <InternshipBoard />
      <ScholarshipBoard />
      <ResumeBuilder />
    </Layout>
  );
};

export default Career;