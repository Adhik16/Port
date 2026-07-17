"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Network,
  Bug,
  Search,
  MonitorSmartphone,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";

const skillCategories = [
  {
    title: "Network Security",
    icon: Network,
    description: "Firewall configuration, IDS/IPS, VPN, and network monitoring.",
    tags: ["Wireshark", "Snort", "pfSense", "Nmap", "TCP/IP"],
  },
  {
    title: "SIEM & Monitoring",
    icon: MonitorSmartphone,
    description: "Log aggregation, alert triage, correlation rules, and dashboards.",
    tags: ["Splunk", "ELK Stack", "Sentinel", "Grafana"],
  },
  {
    title: "Incident Response",
    icon: Shield,
    description: "Detection, containment, eradication, and recovery workflows.",
    tags: ["NIST 800-61", "Playbooks", "Forensics", "Chain of Custody"],
  },
  {
    title: "Threat Intelligence",
    icon: Search,
    description: "IOC hunting, threat feeds, and adversary tracking.",
    tags: ["MITRE ATT&CK", "OSINT", "VirusTotal", "MISP"],
  },
  {
    title: "Pentesting Basics",
    icon: Bug,
    description: "Vulnerability scanning, exploitation fundamentals, and reporting.",
    tags: ["Burp Suite", "Metasploit", "OWASP Top 10", "Kali Linux"],
  },
  {
    title: "Security Tools",
    icon: Lock,
    description: "Building and using security-focused tooling and automation.",
    tags: ["Python", "Bash", "YARA", "Docker", "Git"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6 scroll-mt-20" aria-label="Skills and expertise">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Tools and technologies I use to secure and defend."
        />

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {skillCategories.map(({ title, icon: Icon, description, tags }) => (
            <motion.div key={title} variants={cardVariants}>
              <Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-mono text-foreground">
                      {title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{description}</p>
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
