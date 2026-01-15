import React, { useState } from "react";
import { StepProps, CreateListingFormData as  FormData } from "@/@types/create-listing";
import { X, Video, Upload } from "lucide-react";

interface ImagesStepProps extends StepProps {
  formData: FormData;
  updateForm: (field: string, value: any) => void;
}

type UploadMethod = 'upload' | 'links';

const ImagesStep = ({ formData, updateForm }: ImagesStepProps) => {
  const [activeTab, setActiveTab] = useState<UploadMethod>('upload');
  const [imageLink, setImageLink] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      updateForm("coverImage", imageUrl);
    }
  };

  const handleOtherImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    updateForm("images", [...formData.images, ...imageUrls].slice(0, 4));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      setVideoError('Please upload a valid video file (MP4, MOV, AVI)');
      return;
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      setVideoError('Video size must be less than 100MB');
      return;
    }

    setVideoError(null);
    setIsUploadingVideo(true);
    const videoUrl = URL.createObjectURL(file);
    updateForm("video", videoUrl);
    setIsUploadingVideo(false);
  };

  const handleAddImageLink = () => {
    if (imageLink && imageLink.trim()) {
      const totalImages = (formData.coverImage ? 1 : 0) + formData.images.length;
      
      if (totalImages >= 5) {
        // Maybe add a toast notification here
        return;
      }
  
      if (!formData.coverImage) {
        updateForm("coverImage", imageLink.trim());
      } else {
        const newImages = [...formData.images];
        if (newImages.length < 4) { // Limit additional images to 4
          newImages.push(imageLink.trim());
          updateForm("images", newImages);
        }
      }
      setImageLink('');
    }
  };

  const handleAddVideoLink = () => {
    if (videoLink && videoLink.trim()) {
      // Basic validation for video URLs
      const videoExtensions = ['.mp4', '.mov', '.avi'];
      const hasValidExtension = videoExtensions.some(ext => 
        videoLink.toLowerCase().includes(ext)
      );
      
      if (!hasValidExtension) {
        setVideoError('Please provide a valid video URL');
        return;
      }

      setVideoError(null);
      updateForm("video", videoLink.trim());
      setVideoLink('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Images</h3>
        <p className="text-gray-600 text-sm">
          Use high quality images to ensure clarity. Images must accurately represent the property and shouldn't exceed five (5) uploads.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`font-medium pb-2 ${
            activeTab === 'upload' 
              ? "text-indigo-600 border-b-2 border-indigo-600" 
              : "text-gray-400"
          }`}
        >
          Upload images
        </button>
        <button 
          onClick={() => setActiveTab('links')}
          className={`font-medium pb-2 ${
            activeTab === 'links' 
              ? "text-indigo-600 border-b-2 border-indigo-600" 
              : "text-gray-400"
          }`}
        >
          Use links
        </button>
      </div>

      {activeTab === 'upload' ? (
        <>
          {/* Cover Image Upload */}
          <div className="bg-[#F7F7F7] rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageUpload}
              id="cover-image-upload"
            />
            <label
              htmlFor="cover-image-upload"
              className="cursor-pointer"
            >
              <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-gray-500">+</span>
              </div>
              <h4 className="font-medium mb-2">Upload cover image</h4>
              <p className="text-gray-500 text-sm">
                This image would be used as a display image for a property listing
              </p>
            </label>
          </div>

          {/* Other Images Upload */}
          <div className="bg-[#F7F7F7] rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleOtherImagesUpload}
              id="other-images-upload"
            />
            <label
              htmlFor="other-images-upload"
              className="cursor-pointer"
            >
              <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-gray-500">+</span>
              </div>
              <h4 className="font-medium mb-2">Upload other images</h4>
              <p className="text-gray-500 text-sm">
                Upload 4 images from your device
              </p>
            </label>
          </div>

          {/* Video Upload Section */}
          <div className="bg-[#F7F7F7] rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo"
              className="hidden"
              onChange={handleVideoUpload}
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer"
            >
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-medium mb-2">Upload property video (Optional)</h4>
              <p className="text-gray-500 text-sm mb-2">
                Add a walkthrough video of your property
              </p>
              <p className="text-xs text-gray-400">
                MP4, MOV, AVI • Max 100MB • Max 3 minutes
              </p>
            </label>
            {videoError && (
              <p className="text-red-500 text-sm mt-2">{videoError}</p>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4 ">
          {/* Image Link Input */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image URL here"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            />
            <button
              onClick={handleAddImageLink}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Image
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Add up to 5 image URLs. The first image will be used as the cover image.
          </p>

          {/* Video Link Input */}
          <div className="flex gap-2 mt-6">
            <input
              type="url"
              placeholder="Paste video URL here (Optional)"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
            <button
              onClick={handleAddVideoLink}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Video
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Add a property video URL (MP4, MOV, or AVI format)
          </p>
          {videoError && (
            <p className="text-red-500 text-sm">{videoError}</p>
          )}
        </div>
      )}

      {/* Display uploaded images */}
      {(formData.images.length > 0 || formData.coverImage) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {formData.coverImage && (
            <div className="relative aspect-square">
              <img
                src={formData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => updateForm("coverImage", null)}
                className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {formData.images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  updateForm(
                    "images",
                    formData.images.filter((_, i) => i !== index)
                  );
                }}
                className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Display uploaded video */}
      {formData.video && (
        <div className="mt-6">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            Property Video
          </h4>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              src={formData.video}
              controls
              className="w-full max-h-[400px] object-contain"
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={() => updateForm("video", null)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
              title="Remove video"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
          {isUploadingVideo && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Upload className="w-4 h-4 animate-pulse" />
              <span>Uploading video...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagesStep;