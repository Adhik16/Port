"use client";

import { motion } from "framer-motion";
import { ExternalLink, FolderGit2 } from "lucide-react";
import { GitHubIcon } from "@/components/ui/brand-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";

const projects = [
  {
    title: "SOC Dashboard",
    description:
      "A real-time security operations dashboard aggregating alerts from multiple SIEM sources with custom correlation rules and visualization.",
    tags: ["Splunk", "React", "Python", "Docker"],
    github: "#",
    live: "#",
    featured: true,
  },
  {
    title: "Log Analyzer CLI",
    description:
      "Command-line tool for parsing and analyzing security logs (Syslog, Windows Event, Apache) to quickly surface anomalies and IOCs.",
    tags: ["Python", "Regex", "CLI", "YARA"],
    github: "#",
    live: null,
    featured: false,
  },
  {
    title: "Phishing Email Detector",
    description:
      "ML-powered email analysis tool that flags phishing attempts by examining headers, URLs, and content patterns.",
    tags: ["Python", "Scikit-learn", "Flask", "HTML Parsing"],
    github: "#",
    live: "#",
    featured: false,
  },
  {
    title: "CTF Writeup Repository",
    description:
      "A collection of detailed writeups from Capture The Flag challenges, covering web exploitation, binary analysis, and forensics.",
    tags: ["CTF", "Writeups", "Markdown", "GitBook"],
    github: "#",
    live: "#",
    featured: false,
  },
  {
    title: "Threat Intel Aggregator",
    description:
      "Automated pipeline that collects, deduplicates, and enriches threat intelligence feeds from multiple sources into actionable data.",
    tags: ["Python", "MISP", "REST API", "PostgreSQL"],
    github: "#",
    live: null,
    featured: false,
  },
  {
    title: "Network Scanner",
    description:
      "Lightweight port and service scanner built to understand network reconnaissance fundamentals and practice secure coding.",
    tags: ["Python", "Scapy", "Nmap", "AsyncIO"],
    github: "#",
    live: null,
    featured: false,
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

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 scroll-mt-20" aria-label="Projects">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          subtitle="Security tools, writeups, and experiments I've built."
        />

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map(
            ({ title, description, tags, github, live, featured }) => (
              <motion.div
                key={title}
                variants={cardVariants}
                className={featured ? "sm:col-span-2 lg:col-span-2" : ""}
              >
                <Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FolderGit2 className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-mono text-foreground group-hover:text-primary transition-colors">
                          {title}
                        </CardTitle>
                      </div>
                      <div className="flex gap-1">
                        {github && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            aria-label={`View ${title} source code on GitHub`}
                            asChild
                          >
                            <a
                              href={github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <GitHubIcon className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {live && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            aria-label={`View ${title} live demo`}
                            asChild
                          >
                            <a
                              href={live}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
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
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
