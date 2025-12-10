import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000", "https://social-campus-v2.vercel.app"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};
export default nextConfig;
