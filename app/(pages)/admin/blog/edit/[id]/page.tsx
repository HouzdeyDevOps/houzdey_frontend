"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/blog';
import BlogForm from '@/components/admin/BlogForm';
import { BlogUpdate, BlogStatus } from '@/@types/blog';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogApi.getBlogById(blogId),
    enabled: !!blogId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: BlogUpdate) => blogApi.updateBlog(blogId, data),
    onSuccess: () => {
      toast.success('Blog post updated successfully');
      router.push('/admin/blog');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update blog post');
    },
  });

  const handleSubmit = (data: BlogUpdate) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          </div>
        </div>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Failed to load blog post. Please try again later.</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600">Update your blog post</p>
        </div>
      </div>

      {/* Form */}
      <BlogForm
        initialValues={blog}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        isEdit
      />
    </div>
  );
}
