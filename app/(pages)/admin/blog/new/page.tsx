"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { blogApi } from '@/api/blog';
import { BlogCreate, BlogUpdate, BlogStatus, BlogCategory } from '@/@types/blog';
import BlogForm from '@/components/admin/BlogForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewBlogPage() {
  const router = useRouter();
  const [initialValues] = useState<Partial<BlogCreate>>({
    status: BlogStatus.DRAFT,
    tags: [],
  });

  const createMutation = useMutation({
    mutationFn: (data: BlogCreate) => blogApi.createBlog(data),
    onSuccess: () => {
      toast.success('Blog post created successfully');
      router.push('/admin/blog');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create blog post');
    },
  });

  const handleSubmit = (data: BlogCreate | BlogUpdate) => {
    createMutation.mutate(data as BlogCreate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/blog"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
          <p className="text-gray-600">Write and publish a new blog post</p>
        </div>
      </div>

      {/* Form */}
      <BlogForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
