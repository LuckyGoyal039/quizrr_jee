/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.quizrr.in',
          },
          {
            protocol: 'https',
            hostname: 'cdn-assets.getmarks.app',
          },
          {
            protocol: 'https',
            hostname: 'img.youtube.com',
          },
          {
            protocol: 'https',
            hostname: 'www.mathongo.com',
          },
        ],
      },
};

export default nextConfig;
