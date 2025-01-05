/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true // turn off it when develop to check syntax
    },
    eslint: {
        ignoreDuringBuilds: true // turn off it when develop to check syntax
    },
};git

export default nextConfig;
