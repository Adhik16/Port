"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Mail, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./section-heading";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";
import { CreationOfAdamAscii } from "@/components/ui/creation-of-adam-ascii";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional(), // honeypot — bots fill this, humans don't
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
    setError,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  // ── Submit handler ───────────────────────────────────────────────────────
  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    setSubmitStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          website: data.website || "",
          turnstileToken: turnstileToken,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (res.status === 429) {
          setSubmitError(result.error || "Too many messages. Please wait and try again.");
        } else if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof ContactFormData, {
              type: "server",
              message: message as string,
            });
          });
          setSubmitError("Please fix the highlighted fields.");
        } else {
          setSubmitError(result.error || "Something went wrong. Please try again.");
        }
        setSubmitStatus("error");
        setTurnstileToken(null);
        setTurnstileKey((k) => k + 1);
        return;
      }

      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setSubmitStatus("error");
      setTurnstileToken(null);
      setTurnstileKey((k) => k + 1);
    }
  };

  const handleSendAnother = () => {
    setSubmitStatus("idle");
    setSubmitError(null);
    setTurnstileToken(null);
    setTurnstileKey((k) => k + 1);
    reset();
  };

  return (
    <section id="contact" className="py-24 px-6 scroll-mt-20" aria-label="Contact">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a question, opportunity, or just want to chat security? I'd love to hear from you."
        />

        <motion.div
          className="grid md:grid-cols-5 gap-8 mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Contact form */}
          <div className="md:col-span-3">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                {submitStatus === 'success' || isSubmitSuccessful ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="relative mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      {/* Pulsing glow ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      <div className="relative h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <motion.div
                          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle2 className="h-10 w-10 text-primary" />
                        </motion.div>
                      </div>
                    </motion.div>
                    <motion.h3
                      className="text-xl font-mono font-bold text-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground mt-2 max-w-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Thanks for reaching out! I&apos;ll get back to you as soon as
                      possible.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button
                        variant="outline"
                        className="mt-6 border-primary/30"
                        onClick={handleSendAnother}
                      >
                        Send Another
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  // eslint-disable-next-line react-hooks/refs -- onSubmit only accesses refs in callbacks, not during render
                  <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Honeypot — invisible to humans, unautofillable by browsers */}
                    <div
                      className="sr-only"
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: '-9999px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                      }}
                    >
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="new-password"
                        data-lpignore="true"
                        data-form-type="other"
                        defaultValue=""
                        {...register('website')}
                      />
                    </div>

                    {/* Name + Email row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          {...register("name")}
                          aria-invalid={!!errors.name}
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                          className="bg-background border-border/50 focus-visible:ring-primary"
                        />
                        {errors.name && (
                          <p
                            id="name-error"
                            className="text-xs text-destructive"
                            role="alert"
                          >
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...register("email")}
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email ? "email-error" : undefined
                          }
                          className="bg-background border-border/50 focus-visible:ring-primary"
                        />
                        {errors.email && (
                          <p
                            id="email-error"
                            className="text-xs text-destructive"
                            role="alert"
                          >
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        {...register("subject")}
                        aria-invalid={!!errors.subject}
                        aria-describedby={
                          errors.subject ? "subject-error" : undefined
                        }
                        className="bg-background border-border/50 focus-visible:ring-primary"
                      />
                      {errors.subject && (
                        <p
                          id="subject-error"
                          className="text-xs text-destructive"
                          role="alert"
                        >
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        rows={5}
                        {...register("message")}
                        aria-invalid={!!errors.message}
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                        className="bg-background border-border/50 focus-visible:ring-primary resize-none"
                      />
                      {errors.message && (
                        <p
                          id="message-error"
                          className="text-xs text-destructive"
                          role="alert"
                        >
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Turnstile widget — neon purple themed */}
                    <div className="space-y-1.5" key={turnstileKey}>
                      <span className="text-xs font-medium text-muted-foreground">
                        Security Check
                      </span>
                      <div
                        className="relative rounded-lg border border-primary/20 bg-background/60 p-[1px] overflow-hidden"
                        style={{ minHeight: 72 }}
                      >
                        {/* Neon glow accent */}
                        <div
                          className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(ellipse at top left, rgba(168,85,247,0.15), transparent 70%)",
                          }}
                        />
                        <TurnstileWidget
                          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                          onVerify={(token) => setTurnstileToken(token)}
                          onExpire={() => setTurnstileToken(null)}
                        />
                      </div>
                    </div>

                    {/* Submit error banner */}
                    {submitError && (
                      <motion.div
                        className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {submitError}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                      disabled={submitStatus === 'sending' || !turnstileToken}
                    >
                      {submitStatus === 'sending' ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact info */}
          <div className="md:col-span-2 space-y-5">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-mono font-semibold text-foreground">
                  Contact Info
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:adhikshakya16@gmail.com"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    adhikshakya16@gmail.com
                  </a>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Available for remote opportunities
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Creation of Adam — ASCII art divider */}
            <Card className="bg-card/50 border-border/50 overflow-hidden">
              <CardContent className="p-4 flex justify-center">
                <CreationOfAdamAscii />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-mono font-semibold text-foreground">
                  Social Links
                </h3>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/50 hover:border-primary/50 hover:text-primary"
                        asChild
                        aria-label="GitHub"
                      >
                        <a
                          href="https://github.com/Adhik16"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitHubIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>GitHub</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/50 hover:border-primary/50 hover:text-primary"
                        asChild
                        aria-label="LinkedIn"
                      >
                        <a
                          href="https://www.linkedin.com/in/adhik-shakya-60417232b/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedInIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>LinkedIn</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
