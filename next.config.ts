import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/careers/jobs",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/jobs/:path*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/category/:path*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/companies",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/employers",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/insights",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/insights/:path*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/reports",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/reports/:path*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/resources",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/saved-jobs",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/post-a-job",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/post-a-job/:path*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/applyready",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/applyready/:path*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/careers/admin/:path*",
        destination: "/careers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
