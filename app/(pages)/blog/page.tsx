"use client";

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { blogApi } from '@/api/blog';
import { BlogCategory } from '@/@types/blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { Search, Loader2 } from 'lucide-react';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<BlogCategory | ''>('');
  const [tag, setTag] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', page, search, category, tag],
    queryFn: () => blogApi.getBlogs({
      page,
      limit: 9,
      search: search || undefined,
      category: category || undefined,
      tag: tag || undefined,
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Houzdey Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Your guide to Nigerian real estate - tips, insights, and market trends
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800">Failed to load blog posts. Please try again later.</p>
              </div>
            ) : data?.blogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600">No blog posts found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>

                {/* Pagination */}
                {data && data.pagination.total_pages > 1 && (
                  <div className="mt-12 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!data.pagination.has_prev}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-gray-700">
                      Page {data.pagination.current_page} of {data.pagination.total_pages}
                    </span>
                    
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!data.pagination.has_next}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar 
              selectedCategory={category}
              selectedTag={tag}
              onCategoryChange={(cat) => {
                setCategory(cat);
                setPage(1);
              }}
              onTagChange={(t) => {
                setTag(t);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
