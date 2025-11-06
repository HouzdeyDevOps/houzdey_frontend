interface ImageOptions {
  width?: number;
  height?: number;
  defaultImage?: string;
}

/**
 * Gets an optimized image URL for Cloudinary images with proper transformations
 * @param url - The original image URL
 * @param options - Configuration options for the image
 * @returns Optimized image URL or default image URL
 */
export const getOptimizedImageUrl = (url: string | undefined, options: ImageOptions = {}) => {
  const {
    width = 200,
    height = 200,
    defaultImage = 'default-avatar'
  } = options;

  // Handle empty string, null, undefined, or whitespace-only URLs
  if (!url || url.trim() === '') return `/assets/images/${defaultImage}.png`;
  
  if (url.includes('res.cloudinary.com')) {
    const transformations = `f_auto,q_auto:good,w_${width},h_${height},c_fill,d_${defaultImage}`;
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];
    return `${baseUrl}/upload/${transformations}/${imagePath}`;
  }
  
  return url;
}; 