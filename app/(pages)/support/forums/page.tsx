"use client";

import { useState } from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';

interface ForumPost {
  id: number;
  title: string;
  author: string;
  date: string;
  replies: number;
  likes: number;
  category: string;
}

export default function CommunityForumsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const forumPosts: ForumPost[] = [
    {
      id: 1,
      title: "Tips for first-time property renters",
      author: "John Doe",
      date: "2 hours ago",
      replies: 15,
      likes: 24,
      category: "tips"
    },
    {
      id: 2,
      title: "Understanding rental agreements",
      author: "Jane Smith",
      date: "1 day ago",
      replies: 8,
      likes: 12,
      category: "legal"
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Community Forums</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          New Post
        </button>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto">
        {['all', 'tips', 'legal', 'maintenance', 'safety'].map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {forumPosts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-medium mb-2">{post.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{post.author}</span>
              <span>{post.date}</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 