/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "dummyimage.com",
      "picsum.photos",
      "placekitten.com",
      "lh3.googleusercontent.com",
      "cdn.intra.42.fr",
      "avatars.githubusercontent.com"
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint warnings
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript warnings
  },
  experimental: {
    forceSwcTransforms: true, // Force Next.js to compile without stopping
  },
  webpack: (config) => {
    config.ignoreWarnings = [/./]; // Ignore all Webpack warnings
    return config;
  },
};

export default nextConfig;
