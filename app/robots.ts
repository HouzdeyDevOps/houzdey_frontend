import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/profile/',
          '/manage-listings/',
          '/wishlist/',
          '/favourites/',
          '/notifications/',
          '/analytics/',
          '/verify-email/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
