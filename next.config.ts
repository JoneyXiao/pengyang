import type { NextConfig } from "next";

const defaultServerActionOrigins = ["pengyang.zh-cn.edgeone.cool"];

const envServerActionOrigins = (process.env.SERVER_ACTIONS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [...new Set([...defaultServerActionOrigins, ...envServerActionOrigins])],
    },
  },
};

export default nextConfig;
