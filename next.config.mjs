/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['nrityapriyadanceacademy.vercel.app'],
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(jpe?g|png|svg|gif)$/i,
      type: 'asset/resource'
    });
    return config;
  }
}

// Use export default for .mjs files
export default nextConfig