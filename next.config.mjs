const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/organizer', destination: '/api/organizer', permanent: false }
    ]
  }
};

export default nextConfig;