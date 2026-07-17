"use client";

import { motion } from "framer-motion";
import { Shield, Download, Award, Terminal, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "./section-heading";

const stats = [
  { label: "Projects Completed", value: "5+", icon: Code },
  { label: "Certifications", value: "3+", icon: Award },
  { label: "CTF Challenges", value: "20+", icon: Terminal },
];

export function About() {
  return (
    <section id="about" className="py-24 px-6 scroll-mt-20" aria-label="About me">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="About Me"
          subtitle="Defending the digital realm, one alert at a time."
        />

        <motion.div
          className="grid md:grid-cols-5 gap-10 mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar column */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start gap-4">
            <div className="relative">
              <div className="h-48 w-48 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                <Shield className="h-20 w-20 text-primary/60" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Terminal className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4 w-full">
              {stats.map(({ label, value, icon: Icon }) => (
                <Card
                  key={label}
                  className="flex-1 bg-card/50 border-border/50"
                >
                  <CardContent className="p-3 text-center">
                    <Icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold font-mono text-foreground">
                      {value}
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight">
                      {label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bio column */}
          <div className="md:col-span-3 space-y-5">
            <p className="text-muted-foreground leading-relaxed">
              I&apos;m a <span className="text-foreground font-medium">SOC Analyst</span> with a
              deep passion for cybersecurity. My journey started with a curiosity
              about how systems break — and evolved into a mission to protect them.
              I thrive in Security Operations Centers, triaging alerts, hunting
              threats, and keeping the bad actors out.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I&apos;m not in the SOC, I&apos;m sharpening my skills through{" "}
              <span className="text-primary font-medium">Capture The Flag</span>{" "}
              challenges, building security tools, and staying ahead of the
              ever-evolving threat landscape.
            </p>

            <Separator className="bg-border/50" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground font-mono uppercase tracking-wider">
                Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Threat Detection",
                  "SIEM (Splunk / ELK)",
                  "Incident Response",
                  "Network Security",
                  "Log Analysis",
                  "Python Scripting",
                  "Wireshark",
                  "MITRE ATT&CK",
                ].map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-secondary/50 text-secondary-foreground border-border/50"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
