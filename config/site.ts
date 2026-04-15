export const siteConfig = {
  name: "My App",
  description: "A modern Next.js application",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com",
  },
};

export type SiteConfig = typeof siteConfig;
