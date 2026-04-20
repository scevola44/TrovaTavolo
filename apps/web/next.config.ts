import type { NextConfig } from 'next';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@trova-tavolo/core', '@trova-tavolo/ui'],
  // Produce a minimal self-contained server at .next/standalone for Docker.
  output: 'standalone',
  // Monorepo: trace files starting from the repo root so workspace packages
  // are included in the standalone bundle.
  outputFileTracingRoot: path.resolve(__dirname, '../..'),
};

export default withNextIntl(nextConfig);
