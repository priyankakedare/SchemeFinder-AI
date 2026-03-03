/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Expose environment variable to server runtime
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

module.exports = nextConfig;