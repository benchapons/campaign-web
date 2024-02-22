/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    unoptimized: true,
    domains: [
      'onesiam-campaign-dev.obs.ap-southeast-2.myhuaweicloud.com',
      'onesiam-campaign-qa.obs.ap-southeast-2.myhuaweicloud.com',
      'onesiam-campaign-prod.obs.ap-southeast-2.myhuaweicloud.com',
    ],
  },
  headers: () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Xss-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
