/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'img.rocket.new',
      },
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/sumshinebysums' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sumshinebysums/' : '', 
  async redirects() {
    return [
      {
        source: '/',
        destination: '/homepage',
        permanent: false,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(jsx|tsx)$/,
      exclude: [/node_modules/],
      use: [{
        loader: '@dhiwise/component-tagger/nextLoader',
      }],
    });
    return config;
  },
};

export default nextConfig;
