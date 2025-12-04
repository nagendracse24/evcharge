/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@evcharge/shared'],
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
}

module.exports = nextConfig

