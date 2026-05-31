/** @type {import('next').NextConfig} */
const nextConfig = {
  // The constants/ + metrics/ directories sit OUTSIDE
  // app/web (at the template root). Next.js needs to be
  // told it can transpile sibling-package code so the
  // imports from "../../../constants/app" work in
  // production builds.
  transpilePackages: [],
  typedRoutes: false,
};

export default nextConfig;
