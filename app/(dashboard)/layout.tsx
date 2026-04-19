import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { ROUTES } from "@/constants/routes";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  return (
    <>
      <AppShell user={session.user}>{children}</AppShell>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
