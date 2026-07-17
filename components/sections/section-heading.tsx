"use client";

import { motion } from "framer-motion";
import ScrollFloat from "@/components/ui/scroll-float";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <ScrollFloat
        prefix={<span className="text-primary">#</span>}
        containerClassName="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground"
        textClassName="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground"
        stagger={0.03}
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
      >
        {title}
      </ScrollFloat>
      {subtitle && (
        <motion.p
          className="mt-3 text-muted-foreground max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
      <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/30" />
    </div>
  );
}
