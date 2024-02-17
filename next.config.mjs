/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "apod.nasa.gov",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "images-assets.nasa.gov",
      },
    ],
  },
};

export default nextConfig;
