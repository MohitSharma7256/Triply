import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment';
import { getImageUrl, handleImageError, createPlaceholder } from '../../utils/imageUtils';

const TravelStoryCard = ({
  imgUrl,
  title = 'Untitled Story',
  story = '',
  date,
  visitedLocation = [],
  isFavourite = false,
  onEdit,
  onClick,
  onFavouriteClick
}) => {
  // Debug logging for image URL
  console.log('TravelStoryCard - Raw imgUrl:', imgUrl);
  console.log('TravelStoryCard - Processed URL:', imgUrl ? getImageUrl(imgUrl) : 'No image');

  // Handle image loading errors with local fallback
  const handleImageLoadError = (e) => {
    console.log('Image load error for URL:', e.target.src);
    handleImageError(e, 'Story Image');
  };

  // Format the story snippet
  const getStorySnippet = () => {
    if (!story) return 'No description available';
    return story.length > 100 ? `${story.substring(0, 100)}...` : story;
  };

  // Format the date
  const formattedDate = date ? moment(date).format("DD MMM YYYY") : 'Date not specified';

  return (
    <div 
      className="border relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 group"
      role="article"
      aria-label={`Travel story: ${title}`}
    >
      {/* Image Section with fallback */}
      <div className="w-full h-60 bg-gray-100 overflow-hidden">
        {imgUrl ? (
          <img
            src={getImageUrl(imgUrl)}
            alt={title}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={onClick}
            onError={handleImageLoadError}
            loading="lazy"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer"
            onClick={onClick}
          >
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Favourite Button */}
      <button
        className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-full absolute top-4 right-4 backdrop-blur-sm shadow-sm hover:bg-white transition-colors duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onFavouriteClick?.();
        }}
        aria-label={isFavourite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavourite ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-gray-600 text-lg hover:text-red-500" />
        )}
      </button>

      {/* Details Section */}
      <div className="p-4 cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
              {title}
            </h3>
            <time 
              className="text-xs text-gray-500"
              dateTime={date ? moment(date).format('YYYY-MM-DD') : undefined}
            >
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Story Snippet */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 min-h-[40px]">
          {getStorySnippet()}
        </p>

        {/* Visited Locations */}
        {visitedLocation.length > 0 && (
          <div className="inline-flex items-center gap-2 text-xs text-cyan-800 bg-cyan-50 rounded-full mt-3 px-3 py-1.5 w-full">
            <GrMapLocation className="text-sm flex-shrink-0" />
            <span className="truncate">
              {visitedLocation.join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelStoryCard;