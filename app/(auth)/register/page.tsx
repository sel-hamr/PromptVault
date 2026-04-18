import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { SocialAuthButtons } from "@/components/forms/social-auth-buttons";
import { RegisterForm } from "@/components/forms/register-form";
import { AuthShell } from "@/components/layouts/auth-shell";

export const metadata = {
  title: "Create your account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Start your vault"
      subtitle=""
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={ROUTES.login}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <SocialAuthButtons />

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border/60" />
        <span className="text-[0.75rem] font-medium text-muted-foreground/60">
          or sign up with email
        </span>
        <span className="h-px flex-1 bg-border/60" />
      </div>

      <RegisterForm />
    </AuthShell>
  );
}
