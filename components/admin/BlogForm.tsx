"use client";

import { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import { BlogCreate, BlogUpdate, BlogStatus, BlogCategory } from '@/@types/blog';
import { Loader2, Sparkles, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useBlogForm } from '@/hooks/useBlogForm';
import BlogEditorMenuBar from './blog/BlogEditorMenuBar';
import FeaturedImageUpload from './blog/FeaturedImageUpload';

interface BlogFormProps {
  initialValues: Partial<BlogCreate | BlogUpdate>;
  onSubmit: (data: BlogCreate | BlogUpdate) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export default function BlogForm({ initialValues, onSubmit, isSubmitting, isEdit = false }: BlogFormProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    formData,
    tagInput,
    isGeneratingSlug,
    setTagInput,
    handleChange,
    handleGenerateSlug,
    handleAddTag,
    handleRemoveTag,
  } = useBlogForm(initialValues);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded p-4 my-2 font-mono text-sm',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
    ],
    content: (initialValues as any)?.content || '<p></p>',
    editable: true,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor max-w-none focus:outline-none min-h-[400px] p-4 border-0',
      },
      // Handle paste to prevent unwanted heading formatting
      transformPastedHTML: (html) => {
        // Don't auto-convert pasted content to headings
        // This preserves intentional formatting but prevents accidental H1s
        return html;
      },
    },
  });

  // Track changes to set unsaved state
  useEffect(() => {
    if (editor && (initialValues as any)?.content && editor.getHTML() !== (initialValues as any).content) {
      editor.commands.setContent((initialValues as any).content);
      setHasUnsavedChanges(false);
    }
  }, [editor, initialValues]);

  // Mark as changed when editor content changes
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setHasUnsavedChanges(true);
      
      // Auto-save to localStorage after 3 seconds of inactivity
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        saveToLocalStorage();
      }, 3000);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [editor]);

  // Mark as changed when form data changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [formData]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDraft = loadFromLocalStorage();
    if (savedDraft && !isEdit && editor) {
      const shouldRestore = confirm('Found an unsaved draft. Would you like to restore it?');
      if (shouldRestore) {
        // Restore form data
        if (savedDraft.title) handleChange('title', savedDraft.title);
        if (savedDraft.slug) handleChange('slug', savedDraft.slug);
        if (savedDraft.excerpt) handleChange('excerpt', savedDraft.excerpt);
        if (savedDraft.category) handleChange('category', savedDraft.category);
        if (savedDraft.tags) handleChange('tags', savedDraft.tags);
        if (savedDraft.featured_image) handleChange('featured_image', savedDraft.featured_image);
        if (savedDraft.status) handleChange('status', savedDraft.status);
        if (savedDraft.seo_title) handleChange('seo_title', savedDraft.seo_title);
        if (savedDraft.seo_description) handleChange('seo_description', savedDraft.seo_description);
        
        // Restore editor content
        if (savedDraft.content) {
          editor.commands.setContent(savedDraft.content);
        }
        
        toast.success('Draft restored');
        setHasUnsavedChanges(false);
      } else {
        clearLocalStorage();
      }
    }
  }, [isEdit, editor]);

  const saveToLocalStorage = () => {
    if (!editor) return;
    
    const draft = {
      ...formData,
      content: editor.getHTML(),
      savedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('blog_draft', JSON.stringify(draft));
    setLastSaved(new Date());
    toast.success('Draft auto-saved', { duration: 2000 });
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('blog_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('blog_draft');
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

    // Clear unsaved state and localStorage on successful submit
    setHasUnsavedChanges(false);
    clearLocalStorage();
    
    onSubmit(submitData);
  };

  return (
    <>
      <style jsx global>{`
        /* TipTap Editor Heading Styles */
        .tiptap-editor h1 {
          font-size: 2.25em;
          font-weight: 800;
          line-height: 1.2;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
          color: #1a202c;
        }
        
        .tiptap-editor h2 {
          font-size: 1.875em;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
          color: #1a202c;
        }
        
        .tiptap-editor h3 {
          font-size: 1.5em;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1em;
          margin-bottom: 1em;
          color: #1a202c;
        }
        
        .tiptap-editor h4 {
          font-size: 1.25em;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
          color: #2d3748;
        }
        
        .tiptap-editor h5 {
          font-size: 1.125em;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 1.67em;
          margin-bottom: 1.67em;
          color: #2d3748;
        }
        
        .tiptap-editor h6 {
          font-size: 1em;
          font-weight: 600;
          line-height: 1.6;
          margin-top: 2.33em;
          margin-bottom: 2.33em;
          color: #4a5568;
        }
        
        .tiptap-editor p {
          margin-top: 1em;
          margin-bottom: 1em;
          line-height: 1.75;
        }
        
        .tiptap-editor ul,
        .tiptap-editor ol {
          padding-left: 1.625em;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        
        .tiptap-editor li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        
        .tiptap-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1em;
          font-style: italic;
          color: #4a5568;
          margin: 1.5em 0;
        }
        
        .tiptap-editor strong {
          font-weight: 600;
          color: #1a202c;
        }
        
        .tiptap-editor em {
          font-style: italic;
        }
        
        .tiptap-editor code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.875em;
          font-family: 'Courier New', Courier, monospace;
        }
        
        .tiptap-editor mark {
          background-color: #fef08a;
          padding: 0.125em 0;
        }
        
        .tiptap-editor hr {
          border: 0;
          border-top: 2px solid #e5e7eb;
          margin: 2em 0;
        }
        
        .tiptap-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        
        /* Placeholder styling */
        .tiptap-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center">
            <Save className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-green-800">
              Draft auto-saved at {lastSaved.toLocaleTimeString()}
            </span>
          </div>
          {hasUnsavedChanges && (
            <span className="text-xs text-orange-600">● Unsaved changes</span>
          )}
        </div>
      )}
      
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
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <BlogEditorMenuBar editor={editor} />
            <div className="max-h-[600px] overflow-y-auto">
              <EditorContent editor={editor} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use the toolbar to format your content. Tip: You can paste formatted text from Word or Google Docs.
          </p>
        </div>

        {/* Featured Image */}
        <FeaturedImageUpload
          value={formData.featured_image}
          onChange={(url) => handleChange('featured_image', url)}
        />

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
    </>
  );
}
