/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  images: {
    domains: ['via.placeholder.com'],
  },
}

module.exports = nextConfig
