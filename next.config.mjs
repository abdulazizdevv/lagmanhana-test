/**
 * @type {import('next').NextConfig}
 */

const baseUrl = 'https://cdn.delever.uz/delever/'

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  swcMinify: true,
  experimental: { useWasmBinary: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.delever.uz',
        port: '',
        pathname: '/delever/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
  },
  env: {
    BASE_URL: baseUrl,
  },
  async redirects() {
    return [
      {
        source: '/ru/index.html',
        destination: '/ru',
        permanent: true,
      },
      {
        source: '/en/index.html',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/uz/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ru/index.php',
        destination: '/ru',
        permanent: true,
      },
      {
        source: '/en/index.php',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/uz/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
