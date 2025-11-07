import Image from "next/image";

interface ImagePreviewProps {
  imagePreview: string;
  isUploading: boolean;
  onUpload: () => void;
  onCancel: () => void;
}

export default function ImagePreview({
  imagePreview,
  isUploading,
  onUpload,
  onCancel
}: ImagePreviewProps) {
  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <Image
            src={imagePreview}
            alt="Preview"
            width={80}
            height={80}
            className="object-cover rounded-lg"
            style={{
              width: '80px',
              height: '80px'
            }}
            sizes="80px"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isUploading ? "Sending..." : "Send"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
