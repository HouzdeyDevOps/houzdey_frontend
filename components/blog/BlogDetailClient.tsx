"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Eye, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
import { Blog } from '@/@types/blog';
import { blogApi } from '@/api/blog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import BlogCard from './BlogCard';
import { optimizeCloudinaryImage } from '@/utils/cloudinaryOptimize';

interface BlogDetailClientProps {
  blog: Blog;
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  // Increment views when component mounts
  useEffect(() => {
    blogApi.incrementViews(blog.id).catch(() => {
      // Silently fail
    });
  }, [blog.id]);

  // Fetch related blogs
  const { data: relatedBlogs } = useQuery({
    queryKey: ['related-blogs', blog.id],
    queryFn: () => blogApi.getRelatedBlogs(blog.id, 3),
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blog.title;

  const handleShare = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
      return;
    }

    window.open(urls[platform as keyof typeof urls], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Link>

          <div className="mb-4">
            <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              {blog.author_avatar && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={optimizeCloudinaryImage(blog.author_avatar, { width: 80, height: 80, crop: 'thumb' })}
                    alt={blog.author_name || 'Author'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{blog.author_name || 'Houzdey Team'}</p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {blog.published_at && format(new Date(blog.published_at), 'MMMM d, yyyy')}
            </div>

            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {blog.reading_time} min read
            </div>

            <div className="flex items-center">
              <Eye size={16} className="mr-2" />
              {blog.views} views
            </div>
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <img
            src={optimizeCloudinaryImage(blog.featured_image, { width: 1200, quality: 85 })}
            alt={blog.featured_image_alt || blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Share2 size={20} className="mr-2" />
              Share this article
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook size={18} className="mr-2" />
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Twitter size={18} className="mr-2" />
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Linkedin size={18} className="mr-2" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 size={18} className="mr-2" />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to find your dream home?</h3>
          <p className="text-blue-100 mb-6">Browse 500+ verified properties for rent and sale across Nigeria</p>
          <Link
            href="/properties"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse Properties
          </Link>
        </div>

        {/* Related Posts */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
