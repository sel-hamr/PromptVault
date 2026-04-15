export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Dashboard", href: "/dashboard" },
  { title: "Settings", href: "/settings" },
];

export const authNav: NavItem[] = [
  { title: "Login", href: "/login" },
  { title: "Register", href: "/register" },
];
