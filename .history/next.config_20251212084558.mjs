/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // REMOVE THE N DEV OVERLAY
  devIndicators: {
    appIsRunning: false,
  },
};

export default nextConfig;
