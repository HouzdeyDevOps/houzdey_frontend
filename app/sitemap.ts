import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.houzdey.com'
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Fetch dynamic properties for sitemap with pagination
async function getProperties() {
  try {
    const allProperties = []
    let page = 1
    let hasMore = true
    
    // Fetch up to 10 pages (500 properties max for sitemap)
    while (hasMore && page <= 10) {
      const response = await fetch(`${apiUrl}/api/v1/properties?limit=50&page=${page}`, {
        next: { revalidate: 3600 } // Revalidate every hour
      })
      
      if (!response.ok) break
      
      const data = await response.json()
      const properties = data.properties || []
      
      if (properties.length === 0) {
        hasMore = false
      } else {
        allProperties.push(...properties)
        page++
        
        // If we got less than 50, we've reached the end
        if (properties.length < 50) {
          hasMore = false
        }
      }
    }
    
    return allProperties
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error)
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

  // Fetch dynamic property routes
  const properties = await getProperties()
  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property: any) => ({
    url: `${baseUrl}/properties/${property._id || property.id}`,
    lastModified: new Date(property.updated_at || property.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...propertyRoutes]
} 
