/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites(){
    return [
      { source: '/api/:path*', destination: 'http://localhost:4000/:path*' }
    ]
  },
  // enable modern image handling and strict mode accessibility checks
  images: { unoptimized: true }
}
module.exports = nextConfig
