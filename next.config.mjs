/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsRunning: false,   // ❌ disable the N overlay
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'riteshkumarlenka.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
