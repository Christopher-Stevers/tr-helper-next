/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || "http://64.227.3.191:3000",
  },
};

export default nextConfig;
