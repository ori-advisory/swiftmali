import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@swiftmali/ui', '@swiftmali/supabase'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: { typedRoutes: true },
};

export default nextConfig;
