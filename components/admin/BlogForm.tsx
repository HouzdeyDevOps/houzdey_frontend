"use client";

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { BlogCreate, BlogUpdate, BlogStatus, BlogCategory } from '@/@types/blog';
import { blogApi } from '@/api/blog';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading2, 
  Heading3,
  Link2,
  ImageIcon,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface BlogFormProps {
  initialValues: Partial<BlogCreate | BlogUpdate>;
  onSubmit: (data: BlogCreate | BlogUpdate) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export default function BlogForm({ initialValues, onSubmit, isSubmitting, isEdit = false }: BlogFormProps) {
  const [formData, setFormData] = useState({
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
    ],
    content: (initialValues as any)?.content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && (initialValues as any)?.content && editor.getHTML() !== (initialValues as any).content) {
      editor.commands.setContent((initialValues as any).content);
    }
  }, [editor, initialValues]);

  const handleChange = (field: string, value: any) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const content = editor?.getHTML() || '';
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Please enter or generate a slug');
      return;
    }
    if (!content.trim() || content === '<p></p>') {
      toast.error('Please enter blog content');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Please enter an excerpt');
      return;
    }

    const submitData: any = {
      ...formData,
      content,
    };

    onSubmit(submitData);
  };

  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Quote"
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter link URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Add Link"
        >
          <Link2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Image"
        >
          <ImageIcon size={18} />
        </button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border p-6 space-y-6">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="blog-post-slug"
                required
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                disabled={isGeneratingSlug || !formData.title.trim()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isGeneratingSlug ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value as BlogCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {Object.values(BlogCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as BlogStatus)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {Object.values(BlogStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief summary of the blog post (150-200 characters)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length} characters</p>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <MenuBar />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL
          </label>
          <input
            type="url"
            value={formData.featured_image}
            onChange={(e) => handleChange('featured_image', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {formData.featured_image && (
            <div className="mt-2">
              <img 
                src={formData.featured_image} 
                alt="Preview" 
                className="h-32 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-lg border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={formData.seo_title}
            onChange={(e) => handleChange('seo_title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="SEO title (leave empty to use blog title)"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.seo_title.length}/60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={formData.seo_description}
            onChange={(e) => handleChange('seo_description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="SEO description (leave empty to use excerpt)"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.seo_description.length}/160 characters</p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => handleChange('status', BlogStatus.DRAFT)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting && formData.status === BlogStatus.DRAFT && (
            <Loader2 size={18} className="mr-2 animate-spin" />
          )}
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => handleChange('status', BlogStatus.PUBLISHED)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting && formData.status === BlogStatus.PUBLISHED && (
            <Loader2 size={18} className="mr-2 animate-spin" />
          )}
          {isEdit ? 'Update' : 'Publish'}
        </button>
      </div>
    </form>
  );
}
