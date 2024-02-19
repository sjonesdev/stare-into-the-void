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
      {
        hostname: "127.0.0.1", // for local development
      },
      {
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
