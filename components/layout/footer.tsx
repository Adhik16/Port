"use client";

import { ArrowUp, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GitHubIcon, LinkedInIcon, InstagramIcon } from "@/components/ui/brand-icons";

const socials = [
  { href: "https://github.com/Adhik16", icon: GitHubIcon, label: "GitHub" },
  { href: "https://www.linkedin.com/in/adhik-shakya-60417232b/?skipRedirect=true", icon: LinkedInIcon, label: "LinkedIn" },
  { href: "https://www.instagram.com/ad.shakya_/", icon: InstagramIcon, label: "Instagram" },
  { href: "mailto:adhikshakya16@gmail.com", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-mono font-bold text-foreground">
              <span className="text-primary">{"<"}</span>
              Adhik Shakya
              <span className="text-primary">{"/>"}</span>
            </span>
            <span className="text-sm text-muted-foreground">
              SOC Analyst &bull; Cybersecurity Enthusiast
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2" role="list" aria-label="Social links">
            {socials.map(({ href, icon: Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                asChild
                aria-label={label}
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-border/50" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Adhik Shakya. All rights reserved.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-muted-foreground hover:text-primary gap-1"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}
