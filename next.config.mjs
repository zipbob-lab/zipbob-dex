/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.foodsafetykorea.go.kr",
        port: "",
        pathname: "/**"
      }
    ],
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
