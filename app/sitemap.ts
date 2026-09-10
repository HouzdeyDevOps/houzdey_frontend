import { MetadataRoute } from 'next'
import { nigeriaStates } from '@/data/nigeria-states'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper to fetch all properties for sitemap with pagination
async function getAllPropertiesForSitemap() {
  try {
    const allProperties: any[] = []
    let page = 1
    let hasMore = true
    const limit = 50

    while (hasMore) {
      const res = await fetch(
        `${apiUrl}/properties?page=${page}&limit=${limit}&sort_by=created_at&sort_order=desc`,
        {
          next: { revalidate: 3600 }, // Cache for 1 hour
        }
      )

      if (!res.ok) {
        console.error(`Failed to fetch properties page ${page} for sitemap`)
        break
      }

      const data = await res.json()
      const properties = data.properties || []
      
      allProperties.push(...properties)

      // Check if there are more pages
      hasMore = data.total_pages > page
      page++

      // Safety limit to prevent infinite loops
      if (page > 500) break
    }

    return allProperties
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error)
    return []
  }
}

// Helper to fetch all blog posts for sitemap with pagination
async function getAllBlogsForSitemap() {
  try {
    const allBlogs: any[] = []
    let page = 1
    let hasMore = true
    const limit = 50

    while (hasMore) {
      const res = await fetch(`${apiUrl}/blog?page=${page}&limit=${limit}`, {
        next: { revalidate: 3600 },
      })
      if (!res.ok) break
      const data = await res.json()
      const blogs = data.blogs || []
      allBlogs.push(...blogs)
      hasMore = (data.total_pages || 1) > page
      page++
      if (page > 100) break
    }
    return allBlogs
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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/premium`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support/faqs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
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
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Fetch dynamic property routes
  const properties = await getAllPropertiesForSitemap()
  const propertyRoutes: MetadataRoute.Sitemap = properties
    .filter((property) => property.slug) // Only include properties with slugs
    .map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: new Date(property.updated_at || property.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  // Fetch dynamic blog routes
  const blogs = await getAllBlogsForSitemap()
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || blog.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const stateRoutes: MetadataRoute.Sitemap = nigeriaStates.map((s) => ({
    url: `${baseUrl}/state/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...stateRoutes, ...propertyRoutes, ...blogRoutes]
} 
