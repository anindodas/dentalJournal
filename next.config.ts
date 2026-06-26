import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  async redirects() {
    return [
      { source: "/journal", destination: "/", permanent: true },
      { source: "/issues", destination: "/blog", permanent: true },
      { source: "/editorial-team", destination: "/about", permanent: true },
      { source: "/submissions", destination: "/write-for-us", permanent: true },
    ];
  },
};

export default nextConfig;
