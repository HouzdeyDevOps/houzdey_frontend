import axios from '@/lib/axios';
import {
  Blog,
  BlogCreate,
  BlogUpdate,
  BlogFilters,
  BlogResponse,
  CategoryWithCount
} from '@/@types/blog';

export const blogApi = {
  // Public endpoints
  getBlogs: async (filters: BlogFilters = {}): Promise<BlogResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/blog?${params.toString()}`);
    return response.data;
  },

  getBlogBySlug: async (slug: string): Promise<Blog> => {
    const response = await axios.get(`/blog/slug/${slug}`);
    return response.data;
  },

  incrementViews: async (blogId: string): Promise<void> => {
    await axios.post(`/blog/${blogId}/view`);
  },

  getPopularBlogs: async (limit: number = 5): Promise<Blog[]> => {
    const response = await axios.get(`/blog/popular?limit=${limit}`);
    return response.data;
  },

  getRecentBlogs: async (limit: number = 5): Promise<Blog[]> => {
    const response = await axios.get(`/blog/recent?limit=${limit}`);
    return response.data;
  },

  getRelatedBlogs: async (blogId: string, limit: number = 3): Promise<Blog[]> => {
    const response = await axios.get(`/blog/related/${blogId}?limit=${limit}`);
    return response.data;
  },

  getAllTags: async (): Promise<string[]> => {
    const response = await axios.get('/blog/tags');
    return response.data.tags;
  },

  getCategories: async (): Promise<CategoryWithCount[]> => {
    const response = await axios.get('/blog/categories');
    return response.data.categories;
  },

  // Admin endpoints
  createBlog: async (data: BlogCreate): Promise<Blog> => {
    const response = await axios.post('/blog/', data);
    return response.data;
  },

  getAllBlogsAdmin: async (filters: BlogFilters = {}): Promise<BlogResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/blog/admin/all?${params.toString()}`);
    return response.data;
  },

  getBlogById: async (blogId: string): Promise<Blog> => {
    const response = await axios.get(`/blog/${blogId}`);
    return response.data;
  },

  updateBlog: async (blogId: string, data: BlogUpdate): Promise<Blog> => {
    const response = await axios.put(`/blog/${blogId}`, data);
    return response.data;
  },

  deleteBlog: async (blogId: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/blog/${blogId}`);
    return response.data;
  },

  generateSlug: async (title: string): Promise<{ slug: string }> => {
    const response = await axios.post(`/blog/generate-slug?title=${encodeURIComponent(title)}`);
    return response.data;
  },
};
