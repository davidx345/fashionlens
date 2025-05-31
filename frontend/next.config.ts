import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
