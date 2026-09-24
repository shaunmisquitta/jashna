import type { NextConfig } from "next";

// A custom GitHub Pages domain is served from the domain root. Inferring a
// base path from GITHUB_REPOSITORY would make Next.js emit URLs such as
// /weddingcard/_next/static/..., which do not exist on the custom domain.
// Keep the default root deployment while still allowing an explicit sub-path
// for anyone who intentionally deploys this build without a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
};

export default nextConfig;
