import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // allow importing local images via next/image
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig
