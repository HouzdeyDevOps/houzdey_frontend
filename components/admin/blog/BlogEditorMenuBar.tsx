"use client";

import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link2,
  ImageIcon,
  Code,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Strikethrough,
  MinusSquare,
  Pilcrow
} from 'lucide-react';

interface BlogEditorMenuBarProps {
  editor: Editor | null;
}

export default function BlogEditorMenuBar({ editor }: BlogEditorMenuBarProps) {
  const [, setUpdateTrigger] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setUpdateTrigger(prev => prev + 1);
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border-b border-gray-300 bg-gray-50 p-3">
      <div className="flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('underline') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('strike') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('highlight') ? 'bg-gray-300 text-yellow-400' : ''
            }`}
            title="Highlight"
          >
            <Highlighter size={18} />
          </button>
        </div>

        {/* Paragraph & Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setParagraph().run();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('paragraph') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Paragraph"
          >
            <Pilcrow size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 4 }).run();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 4 }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Heading 4"
          >
            <Heading4 size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 5 }).run();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 5 }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Heading 5"
          >
            <Heading5 size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 6 }).run();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 6 }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Heading 6"
          >
            <Heading6 size={18} />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Justify"
          >
            <AlignJustify size={18} />
          </button>
        </div>

        {/* Lists & Quote */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Quote"
          >
            <Quote size={18} />
          </button>
        </div>

        {/* Code & Horizontal Rule */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('code') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Inline Code"
          >
            <Code size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Horizontal Line"
          >
            <MinusSquare size={18} />
          </button>
        </div>

        {/* Link & Image */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('link') ? 'bg-gray-300 text-blue-600' : ''
            }`}
            title="Add/Edit Link"
          >
            <Link2 size={18} />
          </button>
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Add Image"
          >
            <ImageIcon size={18} />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
