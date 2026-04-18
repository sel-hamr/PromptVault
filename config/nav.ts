import { ROUTES } from "@/constants/routes";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export const mainNav: NavItem[] = [
  { title: "Home", href: ROUTES.home },
  { title: "Dashboard", href: ROUTES.dashboard },
  { title: "Settings", href: ROUTES.settings },
];

export const authNav: NavItem[] = [
  { title: "Login", href: ROUTES.login },
  { title: "Register", href: ROUTES.register },
];
