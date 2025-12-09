/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 生产环境优化
  compress: true,
  poweredByHeader: false,
  // 性能优化
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
