/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Point to the frontend directory for pages and components
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Add path aliases for cleaner imports
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@frontend': require('path').resolve(__dirname, 'frontend'),
      '@backend': require('path').resolve(__dirname, 'backend'),
      '@shared': require('path').resolve(__dirname, 'shared'),
    };
    
    return config;
  },
}

module.exports = nextConfig
