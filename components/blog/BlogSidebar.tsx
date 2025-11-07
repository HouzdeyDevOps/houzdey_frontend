"use client";

import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/blog';
import { BlogCategory } from '@/@types/blog';
import { Tag, FolderOpen } from 'lucide-react';

interface BlogSidebarProps {
  selectedCategory: BlogCategory | '';
  selectedTag: string;
  onCategoryChange: (category: BlogCategory | '') => void;
  onTagChange: (tag: string) => void;
}

export default function BlogSidebar({
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}: BlogSidebarProps) {
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: blogApi.getCategories,
  });

  const { data: tagsData } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: blogApi.getAllTags,
  });

  const { data: popularBlogs } = useQuery({
    queryKey: ['popular-blogs'],
    queryFn: () => blogApi.getPopularBlogs(5),
  });

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FolderOpen size={20} className="mr-2 text-blue-600" />
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === ''
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.category}
              onClick={() => onCategoryChange(cat.category as BlogCategory)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex justify-between items-center ${
                selectedCategory === cat.category
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{cat.category}</span>
              <span className="text-sm text-gray-500">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      {tagsData && tagsData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Tag size={20} className="mr-2 text-blue-600" />
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tagsData.slice(0, 15).map((tag) => (
              <button
                key={tag}
                onClick={() => onTagChange(tag === selectedTag ? '' : tag)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Posts */}
      {popularBlogs && popularBlogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
          <div className="space-y-4">
            {popularBlogs.map((blog) => (
              <a
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="block group"
              >
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                  {blog.title}
                </h4>
                <p className="text-xs text-gray-500">{blog.views} views</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
