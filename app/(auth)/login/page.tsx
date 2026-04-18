import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { SocialAuthButtons } from "@/components/forms/social-auth-buttons";
import { LoginForm } from "@/components/forms/login-form";
import { AuthShell } from "@/components/layouts/auth-shell";

export const metadata = {
  title: "Log in",
  description: "Log in to continue to your workspace.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your vault — your prompts, pieces, and compositions are waiting."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link
            href={ROUTES.register}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Sign up free
          </Link>
        </>
      }
    >
      <SocialAuthButtons />

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border/60" />
        <span className="text-[0.75rem] font-medium text-muted-foreground/60">
          or continue with email
        </span>
        <span className="h-px flex-1 bg-border/60" />
      </div>

      <LoginForm />
    </AuthShell>
  );
}
