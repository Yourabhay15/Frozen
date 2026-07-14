if (typeof window === 'undefined' && typeof global !== 'undefined' && global.localStorage) {
  try {
    delete global.localStorage;
  } catch (e) {}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
