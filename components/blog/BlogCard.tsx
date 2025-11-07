"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Eye } from 'lucide-react';
import { Blog } from '@/@types/blog';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Featured Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={blog.featured_image}
            alt={blog.featured_image_alt || blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {blog.published_at ? format(new Date(blog.published_at), 'MMM d, yyyy') : 'Draft'}
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {blog.reading_time} min read
            </div>
            {blog.views > 0 && (
              <div className="flex items-center">
                <Eye size={14} className="mr-1" />
                {blog.views}
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {blog.excerpt}
          </p>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center text-sm text-gray-700">
            {blog.author_avatar && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={blog.author_avatar}
                  alt={blog.author_name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span>By {blog.author_name || 'Houzdey Team'}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
