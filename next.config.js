/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:8000/auth/:path*',
      },
      {
        source: '/api/projects/:path*',
        destination: 'http://localhost:8000/projects/:path*',
      },
      {
        source: '/api/dashboard/:path*',
        destination: 'http://localhost:8000/dashboard/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8000/users/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
