"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";

const posts = [
  {
    title: "Analyzing a Real-World Phishing Campaign: Tactics & Indicators",
    date: "2026-05-15",
    readTime: "8 min read",
    excerpt:
      "A step-by-step breakdown of a recent phishing campaign targeting financial sector employees, covering email headers, payload analysis, and IOC extraction.",
    tags: ["Phishing", "Threat Intel", "Analysis"],
  },
  {
    title: "Building a Home SOC Lab on a Budget",
    date: "2026-04-02",
    readTime: "12 min read",
    excerpt:
      "How I set up a fully functional SOC lab using free and open-source tools — from log ingestion with ELK to alerting with Wazuh.",
    tags: ["Lab", "ELK", "Wazuh", "Tutorial"],
  },
  {
    title: "CTF Writeup: HackTheBox — Blue (Windows Exploitation)",
    date: "2026-03-18",
    readTime: "10 min read",
    excerpt:
      "A detailed walkthrough of the Blue machine on HackTheBox, covering EternalBlue exploitation, privilege escalation, and flag capture.",
    tags: ["CTF", "HackTheBox", "Writeup"],
  },
  {
    title: "Understanding YARA Rules: From Basics to Production",
    date: "2026-02-10",
    readTime: "6 min read",
    excerpt:
      "A practical guide to writing and deploying YARA rules for malware detection, including performance tips and common pitfalls.",
    tags: ["YARA", "Malware", "Detection"],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Blog() {
  return (
    <section id="blog" className="py-24 px-6 scroll-mt-20" aria-label="Blog and writeups">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="Blog & Writeups"
          subtitle="Security research, CTF writeups, and lessons learned."
        />

        <motion.div
          className="space-y-4 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {posts.map(({ title, date, readTime, excerpt, tags }) => (
            <motion.div key={title} variants={cardVariants}>
              <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group cursor-pointer">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <time dateTime={date}>
                            {new Date(date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {readTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-border/50 text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center sm:pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 gap-1 shrink-0"
                      >
                        Read <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
