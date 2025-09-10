import React, { useState, useEffect } from 'react';
import { MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

const ViewTravelStory = ({ 
  storyInfo = {},
  onClose,
  onEditClick,
  onDeleteClick
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localData, setLocalData] = useState(storyInfo);

  // Update local data when props change
  useEffect(() => {
    setLocalData(storyInfo);
  }, [storyInfo]);

  const {
    _id,
    title = 'Travel Story',
    imageUrl = '',
    visitedDate = '',
    visitedLocation = [],
    story: storyContent = 'No story content available.'
  } = localData || {};

  // Handle edit with confirmation
  const handleEdit = async () => {
    setIsProcessing(true);
    try {
      await onEditClick(localData);
    } catch (error) {
      toast.error(error.message || "Failed to update story");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    
    setIsProcessing(true);
    try {
      await onDeleteClick(localData);
    } catch (error) {
      toast.error(error.message || "Failed to delete story");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-6 w-full h-[650px] mx-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleEdit}
            disabled={isProcessing}
            className={`flex items-center gap-1 px-4 py-2 rounded-md ${
              isProcessing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            <MdUpdate className="text-lg" /> 
            {isProcessing ? 'Updating...' : 'Update'}
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isProcessing}
            className={`flex items-center gap-1 px-4 py-2 rounded-md ${
              isProcessing ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            } text-white transition-colors`}
          >
            <MdDeleteOutline className="text-lg" /> 
            {isProcessing ? 'Deleting...' : 'Delete'}
          </button>
          
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {imageUrl && (
          <div className="rounded-lg overflow-hidden flex justify-center bg-gray-100 min-h-[200px]">
            <img 
              src={getImageUrl(imageUrl)} 
              alt={title} 
              className="max-h-[400px] w-auto object-contain"
              onError={(e) => {
                handleImageError(e, 'Image Not Available');
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-medium">Visited:</span>
          <span>
            {visitedDate ? new Date(visitedDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        {visitedLocation?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {visitedLocation.map((location, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {location}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">
            {storyContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;