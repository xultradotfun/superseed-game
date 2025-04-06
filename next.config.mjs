/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  output: "standalone",
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
};

export default nextConfig;
