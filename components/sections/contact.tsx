"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./section-heading";
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
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Placeholder — no backend. Simulate submission.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", data);
    reset();
  };

  return (
    <section id="contact" className="py-24 px-6" aria-label="Contact">
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
                {isSubmitSuccessful ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Send className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-mono font-bold text-foreground">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                      Thanks for reaching out! I&apos;ll get back to you as soon as
                      possible.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 border-primary/30"
                      onClick={() => reset()}
                    >
                      Send Another
                    </Button>
                  </motion.div>
                ) : (
                  <form
                  className="space-y-5"
                  noValidate="">
                  </form>
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

                    <Button
                      type="submit"
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
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
