/**
 * Server-side API utilities for SSR and SSG
 * Uses native fetch instead of axios for compatibility with Server Components
 */

import { PropertyDetail, Property, PropertyResponse } from '@/@types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch a single property by ID (Server-side)
 * Used in generateMetadata and Server Components
 */
export async function getPropertyByIdServer(id: string): Promise<PropertyDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch property ${id}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

/**
 * Fetch a single property by SEO-friendly slug (Server-side)
 * Used in generateMetadata and Server Components for SEO-optimized URLs
 */
export async function getPropertyBySlugServer(slug: string): Promise<PropertyDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/slug/${slug}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch property with slug ${slug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property by slug:', error);
    return null;
  }
}

/**
 * Fetch all properties with pagination (Server-side)
 * Used in sitemap generation and listing pages
 */
export async function getPropertiesServer(params: {
  page?: number;
  limit?: number;
  listing_type?: string;
  state?: string;
} = {}): Promise<PropertyResponse | null> {
  try {
    const { page = 1, limit = 50 } = params;
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (params.listing_type) {
      searchParams.append('listing_type', params.listing_type);
    }

    if (params.state) {
      searchParams.append('state', params.state);
    }

    const response = await fetch(
      `${API_BASE_URL}/properties?${searchParams.toString()}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch properties: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return null;
  }
}

/**
 * Fetch all properties for sitemap (with pagination)
 * Fetches up to 2 pages (100 properties) to prevent build timeout
 */
export async function getAllPropertiesForSitemap(): Promise<Property[]> {
  const allProperties: Property[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore && page <= 2) {
      const response = await getPropertiesServer({ page, limit: 50 });
      
      if (!response || !response.properties || response.properties.length === 0) {
        hasMore = false;
        break;
      }

      allProperties.push(...response.properties);

      // Check if there are more pages
      if (!response.pagination.has_next || response.properties.length < 50) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allProperties;
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
    return [];
  }
}
