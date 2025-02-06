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
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [/./];
    return config;
  },
};

export default nextConfig;
