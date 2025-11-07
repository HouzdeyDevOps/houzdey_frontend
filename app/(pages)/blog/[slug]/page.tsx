import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailClient from '@/components/blog/BlogDetailClient';
import Navbar from '@/components/navbar/Navbar';

// Server-side API call
async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/slug/${slug}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found | Houzdey',
    };
  }

  return {
    title: blog.seo_title || `${blog.title} | Houzdey Blog`,
    description: blog.seo_description || blog.excerpt,
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      images: [blog.og_image || blog.featured_image],
      type: 'article',
      publishedTime: blog.published_at,
      authors: [blog.author_name || 'Houzdey Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      images: [blog.og_image || blog.featured_image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.featured_image,
    author: {
      '@type': 'Person',
      name: blog.author_name || 'Houzdey Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Houzdey',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/logo.png`,
      },
    },
    datePublished: blog.published_at,
    dateModified: blog.updated_at,
    description: blog.excerpt,
    articleBody: blog.content,
    keywords: blog.tags.join(', '),
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_APP_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Navigation */}
      <Navbar showSearch={false} showPropertyTypeFilters={false} />
      
      {/* Client Component */}
      <BlogDetailClient blog={blog} />
    </>
  );
}
