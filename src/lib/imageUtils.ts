/**
 * Utility functions for handling image URLs and assets
 */

/**
 * Get the full URL for an image path
 * @param imagePath - The relative image path from the server
 * @returns The full image URL
 */
export const getImageUrl = (imagePath: string): string => {
  const baseUrl = import.meta.env.VITE_API_IMAGE_BASE_URL;

  if (!baseUrl) {
    console.warn(
      "VITE_API_IMAGE_BASE_URL is not defined in environment variables"
    );
    return imagePath;
  }

  // Remove leading slash from imagePath if present to avoid double slashes
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  return `${baseUrl}/${cleanPath}`;
};

/**
 * Get a fallback image URL for when an image is not available
 * @param fallbackPath - Optional custom fallback path (defaults to /image_placeholder.png)
 * @returns The fallback image URL
 */
export const getFallbackImageUrl = (
  fallbackPath = "/image_placeholder.png"
): string => {
  return fallbackPath;
};
