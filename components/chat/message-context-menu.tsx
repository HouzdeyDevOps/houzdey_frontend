import React from 'react';
import { Download, Trash2 } from 'lucide-react';

interface MessageContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onDownload?: () => void;
  showDownload?: boolean;
  isSender: boolean;
}

export default function MessageContextMenu({
  x,
  y,
  onClose,
  onDelete,
  onDownload,
  showDownload = false,
  isSender,
}: MessageContextMenuProps) {
  React.useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48"
      style={{
        left: x,
        top: y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {showDownload && (
        <button
          onClick={onDownload}
          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <Download size={16} />
          Download
        </button>
      )}
      {isSender && (
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      )}
    </div>
  );
} 