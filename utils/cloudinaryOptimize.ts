/**
 * Optimize Cloudinary image URLs with transformations
 * This bypasses Next.js image optimization and uses Cloudinary's built-in optimization
 */

export function optimizeCloudinaryImage(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  } = {}
): string {
  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  // Build transformation string
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push(`c_${crop}`);
  transformations.push('dpr_auto'); // Auto device pixel ratio

  const transformStr = transformations.join(',');

  // Insert transformations into Cloudinary URL
  // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  return `${url.substring(0, uploadIndex)}/upload/${transformStr}/${url.substring(uploadIndex + 8)}`;
}

/**
 * Get optimized Cloudinary URL for different screen sizes
 */
export function getResponsiveCloudinaryUrl(
  url: string,
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge'
): string {
  const sizes = {
    thumbnail: { width: 150, height: 150, quality: 80 },
    small: { width: 400, quality: 80 },
    medium: { width: 800, quality: 85 },
    large: { width: 1200, quality: 85 },
    xlarge: { width: 1920, quality: 90 },
  };

  return optimizeCloudinaryImage(url, sizes[size]);
}
