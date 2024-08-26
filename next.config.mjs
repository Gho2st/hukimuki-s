/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["hukimuki.s3.eu-central-1.amazonaws.com"],
    unoptimized: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
