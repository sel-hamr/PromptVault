"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { contactFormSchema, type ContactFormInput } from "@/lib/validators";
import { sendContactEmailAction } from "@/lib/actions/contact.actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const { execute, isPending } = useAction(sendContactEmailAction, {
    onSuccess: ({ data }) => {
      if (data && "success" in data && data.success) {
        toast.success("Message sent! I'll get back to you soon.");
        form.reset();
      }
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const inputCls = (hasError?: boolean) =>
    cn(
      "h-11 text-[0.9rem] placeholder:text-muted-foreground/40",
      "border-border/60 bg-background/70",
      "focus-visible:border-violet-500/40 focus-visible:ring-2 focus-visible:ring-violet-500/15",
      "transition-all duration-200",
      hasError && "border-destructive",
    );

  return (
    <form
      className="relative grid gap-5"
      noValidate
      onSubmit={(e) => void form.handleSubmit((v) => execute(v))(e)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="cf-name" className="text-[0.8375rem] font-medium">
            Name
          </Label>
          <Input
            id="cf-name"
            placeholder="Your name"
            className={inputCls(!!form.formState.errors.name)}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-[0.775rem] text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="cf-email" className="text-[0.8375rem] font-medium">
            Email address
          </Label>
          <Input
            id="cf-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputCls(!!form.formState.errors.email)}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-[0.775rem] text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="cf-subject" className="text-[0.8375rem] font-medium">
          Subject
        </Label>
        <Input
          id="cf-subject"
          placeholder="What's this about?"
          className={inputCls(!!form.formState.errors.subject)}
          {...form.register("subject")}
        />
        {form.formState.errors.subject && (
          <p className="text-[0.775rem] text-destructive">
            {form.formState.errors.subject.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="cf-message" className="text-[0.8375rem] font-medium">
          Message
        </Label>
        <Textarea
          id="cf-message"
          rows={5}
          placeholder="Tell me what's on your mind..."
          className={cn(
            "resize-none text-[0.9rem] placeholder:text-muted-foreground/40",
            "border-border/60 bg-background/70",
            "focus-visible:border-violet-500/40 focus-visible:ring-2 focus-visible:ring-violet-500/15",
            "transition-all duration-200",
            form.formState.errors.message && "border-destructive",
          )}
          {...form.register("message")}
        />
        {form.formState.errors.message && (
          <p className="text-[0.775rem] text-destructive">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "group relative mt-1 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl",
          "bg-violet-600 text-sm font-semibold text-white",
          "shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_4px_24px_rgba(139,92,246,0.35)]",
          "transition-all duration-300",
          "hover:bg-violet-500 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.7),0_8px_40px_rgba(139,92,246,0.55)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-500 group-hover:translate-x-full"
          aria-hidden="true"
        />
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
