import React, { useState, useRef, useCallback } from 'react';
import { MdDeleteOutline, MdAdd, MdUpdate, MdClose } from 'react-icons/md';
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import moment from 'moment';

const AddEditTravelStory = ({
  storyInfo = {},
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo.title || "");
  const [imageUrls, setImageUrls] = useState(
    Array.isArray(storyInfo.imageUrl) 
      ? storyInfo.imageUrl 
      : storyInfo.imageUrl 
        ? [storyInfo.imageUrl] 
        : []
  );
  const [story, setStory] = useState(storyInfo.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    Array.isArray(storyInfo.visitedLocation)
      ? storyInfo.visitedLocation
      : storyInfo.visitedLocation
      ? [storyInfo.visitedLocation]
      : []
  );
  const [visitedDate, setVisitedDate] = useState(storyInfo.visitedDate || null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddImages = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axiosInstance.post('/image-upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data.imageUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      setImageUrls(prev => [...prev, ...newImageUrls]);
      setError("");
      toast.success(`${newImageUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      setError("Failed to upload some images. Please try again.");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDeleteImage = useCallback((indexToDelete) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToDelete));
  }, []);

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    handleAddImages(e.target.files);
    e.target.value = '';
  };

  const validateForm = useCallback(() => {
    if (!title.trim()) {
      setError("Please enter the title");
      return false;
    }
    if (!story.trim()) {
      setError("Please enter the story");
      return false;
    }
    if (!imageUrls || imageUrls.length === 0) {
      setError("Please upload at least one image");
      return false;
    }
    if (!visitedLocation || visitedLocation.length === 0) {
      setError("Please add at least one location");
      return false;
    }
    if (!visitedDate) {
      setError("Please select a visited date");
      return false;
    }
    setError("");
    return true;
  }, [title, story, imageUrls, visitedLocation, visitedDate]);

  const submitStory = useCallback(async () => {
    if (!validateForm()) return;

    try {
      // For now, use only the first image to match your backend
      // If you want multiple images, you'll need to update your backend
      const storyData = {
        title: title.trim(),
        story: story.trim(),
        imageUrl: imageUrls[0], // Send only first image as string
        visitedLocation,
        visitedDate: new Date(visitedDate).toISOString()
      };

      const endpoint = type === "edit"
        ? `/edit-travel-story/${storyInfo._id}`
        : "/add-travel-story";

      const method = type === "edit" ? "put" : "post";

      const response = await axiosInstance[method](endpoint, storyData);

      if (response.data?.story || response.data?.data) {
        toast.success(`Story ${type === "edit" ? "updated" : "added"} successfully`);
        getAllTravelStories();
        onClose();
      } else {
        setError("Failed to save story. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      setError(error.response?.data?.message || "An unexpected error occurred");
    }
  }, [
    title,
    story,
    imageUrls,
    visitedLocation,
    visitedDate,
    type,
    storyInfo._id,
    validateForm,
    getAllTravelStories,
    onClose
  ]);

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-md w-full h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-2xl font-semibold text-gray-800">
          {type === "add" ? "Add New Story" : "Edit Story"}
        </h5>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          <MdClose className="text-xl" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="A day at the Beautiful Place"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visited Date*</label>
          <DateSelector
            date={visitedDate}
            setDate={setVisitedDate}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Story Images* ({imageUrls.length} uploaded)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageUrls.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Story image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MdDeleteOutline className="text-sm" />
                  </button>
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 mt-4"
            onClick={handleImageClick}
          >
            <MdAdd className="text-3xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              {isUploading ? "Uploading..." : "Click to upload images"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              You can select multiple images (first image will be used as primary)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visited Locations*</label>
          <TagInput
            tags={visitedLocation}
            setTags={setVisitedLocation}
            placeholder="Add locations (press enter after each)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Story*</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell your story here..."
            rows={8}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submitStory}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={isUploading}
          >
            {type === "add" ? (
              <>
                <MdAdd className="text-lg" /> Add Story
              </>
            ) : (
              <>
                <MdUpdate className="text-lg" /> Update Story
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;