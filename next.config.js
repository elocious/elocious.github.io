/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    unoptimized: true,
  },
  allowedDevOrigins: process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? [
        'https://3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX,
        'http://3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX,
        '3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX,
      ]
    : [],
};

module.exports = nextConfig;
