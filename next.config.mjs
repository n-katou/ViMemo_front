/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/_next/static/sitemap.xml',
      },
      {
        source: '/robots.txt',
        destination: '/_next/static/robots.txt',
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
