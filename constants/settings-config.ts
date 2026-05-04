export type SettingsItem = {
  id: string;
  title: string;
  description: string;
  section: string;
  href: string;
  keywords: string[];
};

export const SETTINGS_ITEMS: SettingsItem[] = [
  {
    id: "profile-username",
    title: "Username",
    description: "Change your display name and username",
    section: "Profile",
    href: "/settings#profile",
    keywords: ["name", "username", "display", "handle", "profile"],
  },
  {
    id: "account-email",
    title: "Email address",
    description: "Update the email address associated with your account",
    section: "Account",
    href: "/settings#account",
    keywords: ["email", "address", "contact", "login", "account"],
  },
  {
    id: "account-password",
    title: "Change password",
    description: "Set a new password for your account",
    section: "Account",
    href: "/settings#account",
    keywords: ["password", "security", "change password", "credentials"],
  },
  {
    id: "account-delete",
    title: "Delete account",
    description: "Permanently delete your account and all data",
    section: "Account",
    href: "/settings#danger",
    keywords: ["delete", "remove", "deactivate", "close account", "danger"],
  },
  {
    id: "appearance-theme",
    title: "Theme",
    description: "Switch between light, dark, or system theme",
    section: "Appearance",
    href: "/settings#appearance",
    keywords: ["theme", "dark", "light", "system", "color", "mode", "appearance"],
  },
];
