import { BASE_URL } from './constants';

// Create a base64 encoded placeholder image
const createPlaceholderImage = (width = 400, height = 300, text = 'No Image') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
};

// Get the correct image URL based on environment
export const getImageUrl = (imageUrl) => {
  // Handle null, undefined, or non-string values
  if (!imageUrl || typeof imageUrl !== 'string') {
    return createPlaceholderImage();
  }
  
  // If it's already a full URL (starts with http), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend the base URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${BASE_URL}${imageUrl}`;
  }
  
  // If it's just a filename, add the uploads path
  return `${BASE_URL}/uploads/${imageUrl}`;
};

// Handle image loading errors with fallback
export const handleImageError = (e, fallbackText = 'Image Not Available') => {
  e.target.onerror = null;
  e.target.src = createPlaceholderImage(400, 300, fallbackText);
  e.target.className = e.target.className + ' bg-gray-100';
};

// Create different sized placeholders
export const createPlaceholder = {
  small: () => createPlaceholderImage(200, 150, 'No Image'),
  medium: () => createPlaceholderImage(400, 300, 'No Image'),
  large: () => createPlaceholderImage(600, 400, 'Image Not Available'),
  story: () => createPlaceholderImage(400, 300, 'Story Image'),
  profile: () => createPlaceholderImage(100, 100, 'Profile')
};
