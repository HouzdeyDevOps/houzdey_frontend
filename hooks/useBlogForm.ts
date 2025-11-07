import { useState } from 'react';
import { BlogCreate, BlogUpdate, BlogStatus, BlogCategory } from '@/@types/blog';
import { blogApi } from '@/api/blog';
import { toast } from 'sonner';

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  featured_image: string;
  status: BlogStatus;
  seo_title: string;
  seo_description: string;
}

export function useBlogForm(initialValues: Partial<BlogCreate | BlogUpdate>) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialValues.title || '',
    slug: initialValues.slug || '',
    excerpt: initialValues.excerpt || '',
    category: initialValues.category || BlogCategory.TIPS_ADVICE,
    tags: initialValues.tags || [],
    featured_image: initialValues.featured_image || '',
    status: initialValues.status || BlogStatus.DRAFT,
    seo_title: initialValues.seo_title || '',
    seo_description: initialValues.seo_description || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  const handleChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateSlug = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title first');
      return;
    }

    setIsGeneratingSlug(true);
    try {
      const response = await blogApi.generateSlug(formData.title);
      handleChange('slug', response.slug);
      toast.success('Slug generated successfully');
    } catch (error) {
      toast.error('Failed to generate slug');
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      handleChange('tags', [...formData.tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return {
    formData,
    tagInput,
    isGeneratingSlug,
    setTagInput,
    handleChange,
    handleGenerateSlug,
    handleAddTag,
    handleRemoveTag,
  };
}
