/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/api/videos',
        headers: [
          {
            key: 'Content-Length',
            value: '100MB',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
