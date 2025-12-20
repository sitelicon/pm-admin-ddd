/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';

  media-src 'self' http://localhost:8000 https://paco-martinez-assets.s3.eu-west-1.amazonaws.com;

  script-src 'self' http://localhost:8000 https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js 'unsafe-inline' 'unsafe-eval';

  worker-src 'self' blob:;

  style-src 'self' http://localhost:8000 https://cdnjs.cloudflare.com https://fonts.googleapis.com 'unsafe-inline';

  img-src 'self' data: blob: http://localhost:8000 https://paco-martinez-assets.s3.eu-west-1.amazonaws.com https://www.admin.pacomartinez.com https://admin.pacomartinez.com https://admin.devpacomartinez.com ;

  font-src 'self' http://localhost:8000 https://cdnjs.cloudflare.com https://fonts.gstatic.com;

  connect-src 'self' http://localhost:8000  https://api.pacomartinez.com https://api.devpacomartinez.com https://api.ipgeolocation.io https://paco-martinez-assets.s3.eu-west-1.amazonaws.com; 

  frame-src 'self' http://localhost:8000  https://paco-martinez-assets.s3.eu-west-1.amazonaws.com;

  frame-ancestors 'self';
`;

const config = {
  reactStrictMode: false,
  trailingSlash: false,
  turbopack:{},
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
    async headers() {
    return [
      {
        source: '/(.*)',
        headers:  [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=()'
          }
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/welcome',
        permanent: true
      }
    ];
  }
};

module.exports = config;

