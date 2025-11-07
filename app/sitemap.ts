import { MetadataRoute } from 'next'
import { getAllPropertiesForSitemap } from '@/lib/server-api'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper to fetch all blog posts for sitemap
async function getAllBlogsForSitemap() {
  try {
    const res = await fetch(`${apiUrl}/api/v1/blog?limit=500`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!res.ok) {
      console.error('Failed to fetch blogs for sitemap')
      return []
    }
    
    const data = await res.json()
    return data.blogs || []
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes with priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Fetch dynamic property routes using server-side API
  const properties = await getAllPropertiesForSitemap()
  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: new Date(property.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Fetch dynamic blog routes
  const blogs = await getAllBlogsForSitemap()
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || blog.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes]
} 
