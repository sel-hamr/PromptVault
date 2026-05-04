import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { SettingsSection } from "@/components/settings/settings-section";
import { SettingsSearch } from "@/components/settings/settings-search";
import { UsernameForm } from "./profile/_components/username-form";
import { EmailForm } from "./account/_components/email-form";
import { PasswordForm } from "./account/_components/password-form";
import { DeleteAccountDialog } from "./account/_components/delete-account-dialog";
import { ThemePicker } from "./appearance/_components/theme-picker";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.login);

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, email: true },
  });
  if (!user) redirect(ROUTES.login);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        <div className="w-48 shrink-0">
          <SettingsSearch />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <section id="profile">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Profile
          </p>
          <SettingsSection
            title="Username"
            description="Your public-facing display name on the platform."
          >
            <UsernameForm currentUsername={user.username} />
          </SettingsSection>
        </section>

        <section id="appearance">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Appearance
          </p>
          <SettingsSection
            title="Theme"
            description="Choose how the interface looks. System follows your OS preference."
          >
            <ThemePicker />
          </SettingsSection>
        </section>

        <section id="account">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Account
          </p>
          <div className="flex flex-col gap-4">
            <SettingsSection
              title="Email address"
              description="Update the email you use to sign in."
            >
              <EmailForm currentEmail={user.email} />
            </SettingsSection>

            <SettingsSection
              title="Password"
              description="Change your account password."
            >
              <PasswordForm />
            </SettingsSection>
          </div>
        </section>

        <section id="danger">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Danger zone
          </p>
          <SettingsSection
            title="Delete account"
            description="Permanently delete your account and all associated data."
            danger
          >
            <p className="mb-4 text-sm text-muted-foreground">
              Once you delete your account, there is no going back. All your
              prompts, pieces, and references will be permanently removed.
            </p>
            <DeleteAccountDialog />
          </SettingsSection>
        </section>
      </div>
    </div>
  );
}
