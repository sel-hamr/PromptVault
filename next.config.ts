import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-pg",
    "@prisma/client-runtime-utils",
    "pg",
  ],
  outputFileTracingIncludes: {
    "/**/*": [
      "./node_modules/.prisma/**/*",
      "./node_modules/@prisma/**/*",
    ],
  },
};

export default nextConfig;
