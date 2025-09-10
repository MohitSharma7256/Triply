import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { MdAdd, MdSearch, MdFilterList, MdClear } from 'react-icons/md';
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import moment from 'moment';
import Navbar from '../../components/Navbar';

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: {},
  });

  const [openViewModel, setOpenViewModel] = useState({
    isShown: false,
    data: null
  });

  // Get user info
  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to fetch user information");
      }
    }
  }, [navigate]);

  // Get all travel stories
  const getAllTravelStories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      toast.error("Failed to fetch stories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear search and reset filters
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    resetFilters();
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilterType("");
    setSelectedDate(null);
    getAllTravelStories();
  }, [getAllTravelStories]);

  // Search stories by query
  const onSearchStory = useCallback(async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      handleClearSearch();
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/search/filter", {
        params: {
          query: trimmedQuery
        }
      });

      if (response.data?.error === false) {
        setFilterType("search");
        setAllStories(response.data.stories || []);

        if (response.data.stories?.length === 0) {
          toast.info(`No stories found for "${trimmedQuery}"`);
        }
      } else {
        setAllStories([]);
        toast.error(response.data?.message || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(error.response?.data?.message || "Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [handleClearSearch]);

  // Filter stories by date
  const filterStoriesByDate = useCallback(async (date) => {
    try {
      if (!date) {
        resetFilters();
        return;
      }

      setSelectedDate(date);
      setIsLoading(true);

      // Convert to start and end of day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await axiosInstance.get("/travel-stories/filter", {
        params: {
          startDate: startOfDay.getTime(),
          endDate: endOfDay.getTime()
        }
      });

      if (response.data?.error === false) {
        setFilterType("date");
        setAllStories(response.data.stories || []);
        toast.success(`Showing stories from ${moment(date).format('MMM D, YYYY')}`);
      } else {
        setAllStories([]);
        toast.info(`No stories found for ${moment(date).format('MMM D, YYYY')}`);
      }
    } catch (error) {
      console.error("Date filter error:", error);
      toast.error("Failed to filter by date");
    } finally {
      setIsLoading(false);
    }
  }, [resetFilters]);

  // Handle story edit
  const handleEdit = useCallback((story) => {
    setOpenAddEditModel({ isShown: true, type: "edit", data: story });
  }, []);

  // Handle view story
  const handleViewStory = useCallback((story) => {
    setOpenViewModel({ isShown: true, data: story });
  }, []);

  // Update favorite status
  const updateIsFavourite = useCallback(async (story) => {
    try {
      const updatedStatus = !story.isFavourite;
      const response = await axiosInstance.put(`/update-favourite/${story._id}`, {
        isFavourite: updatedStatus,
      });

      if (response.data && !response.data.error) {
        setAllStories((prevStories) =>
          prevStories.map((s) =>
            s._id === story._id ? { ...s, isFavourite: updatedStatus } : s
          )
        );

        toast.success(
          updatedStatus
            ? "Added to favorites"
            : "Removed from favorites"
        );
      } else {
        toast.error("Failed to update favorite status.");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Server error while updating favorite status.");
    }
  }, []);

  // Delete travel story
  const deleteTravelStory = useCallback(async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-travel-story/${storyId}`);
      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully");
        setOpenViewModel((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.error("Failed to delete story:", error);
      toast.error("Failed to delete story");
    }
  }, [getAllTravelStories]);

  // Close add/edit modal
  const closeAddEditModal = useCallback(() => {
    setOpenAddEditModel({ isShown: false, type: "add", data: {} });
  }, []);

  // Close view modal
  const closeViewModal = useCallback(() => {
    setOpenViewModel({ isShown: false, data: null });
  }, []);

  // Handle edit from view modal
  const handleEditFromView = useCallback(() => {
    if (openViewModel.data) {
      setOpenViewModel({ isShown: false, data: null });
      handleEdit(openViewModel.data);
    }
  }, [openViewModel.data, handleEdit]);

  // Handle delete from view modal
  const handleDeleteFromView = useCallback(() => {
    if (openViewModel.data) {
      deleteTravelStory(openViewModel.data);
    }
  }, [openViewModel.data, deleteTravelStory]);

  // Open add story modal
  const openAddStoryModal = useCallback(() => {
    setOpenAddEditModel({ isShown: true, type: "add", data: { imageUrl: [] } });
  }, []);

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
    if (typeof document !== 'undefined') {
      Modal.setAppElement('#root');
    }
  }, [getUserInfo, getAllTravelStories]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => onSearchStory(searchQuery)}
        handleClearSearch={handleClearSearch}
      />

      {/* Enhanced Header Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Your Travel <span className="text-yellow-300">Stories</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Capture, share, and relive your adventures around the world
            </p>
            
            {/* Interactive Search Bar */}
            <motion.div 
              className="max-w-md mx-auto relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`relative flex items-center bg-white rounded-full shadow-lg transition-all duration-300 ${
                isSearchFocused ? 'ring-2 ring-blue-400 shadow-xl' : ''
              }`}>
                <MdSearch className="absolute left-4 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search your stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearchStory(searchQuery)}
                  className="w-full pl-12 pr-12 py-3 rounded-full focus:outline-none text-gray-800"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={handleClearSearch}
                    className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MdClear className="text-xl" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-10 left-10 text-3xl"
        >
          ✈️
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-20 right-20 text-2xl"
        >
          🌍
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-10 left-1/4 text-xl"
        >
          🗺️
        </motion.div>
      </motion.div>

      <div className='container mx-auto py-10 px-6'>
        <FilterInfoTitle
          activeFilter={filterType}
          filterDate={selectedDate}
          searchQuery={searchQuery}
          onClear={resetFilters}
        />

        <div className='flex gap-7'>
          <div className='flex-1'>
            {isLoading ? (
              <motion.div 
                className='text-center py-20'
                variants={loadingVariants}
                animate="animate"
              >
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className='text-gray-600 text-lg'>Loading your stories...</p>
              </motion.div>
            ) : allStories.length > 0 ? (
              <motion.div 
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {allStories.map((item, index) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="transform transition-all duration-300"
                    >
                      <TravelStoryCard
                        imgUrl={Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl}
                        title={item.title}
                        story={item.story}
                        date={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavourite}
                        onEdit={() => handleEdit(item)}
                        onClick={() => handleViewStory(item)}
                        onFavouriteClick={() => updateIsFavourite(item)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                className='text-center py-20'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {filterType === "search" ? `No stories found for "${searchQuery}"` :
                    filterType === "date" ? "No stories found for selected date." :
                      "Start Your Journey"}
                </h3>
                <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
                  {filterType === "search" ? "Try different keywords or browse all stories." :
                    filterType === "date" ? "Try selecting a different date or browse all stories." :
                      "Create your first travel story and begin documenting your adventures!"}
                </p>
                {!filterType && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openAddStoryModal}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  >
                    Create Your First Story
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className='hidden lg:block w-[320px]'>
            <motion.div 
              className='bg-white border border-slate-200 shadow-xl shadow-slate-200/20 rounded-2xl sticky top-4 overflow-hidden'
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4'>
                <h3 className='text-lg font-semibold flex items-center'>
                  <MdFilterList className="mr-2" />
                  Filter by Date
                </h3>
              </div>
              <div className='p-4'>
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="single"
                  selected={selectedDate}
                  onSelect={filterStoriesByDate}
                  pagedNavigation
                  fromYear={2020}
                  toYear={new Date().getFullYear() + 5}
                  className="!m-0"
                  classNames={{
                    day_selected: "bg-blue-600 text-white",
                    day_today: "bg-blue-100 text-blue-600 font-bold",
                    day: "hover:bg-blue-100 rounded-full transition-colors"
                  }}
                />
                {selectedDate && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={resetFilters}
                    className='w-full mt-4 px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md'
                  >
                    Clear Date Filter
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={closeAddEditModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
            backdropFilter: "blur(5px)"
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '900px',
            width: '95%',
            padding: 0,
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
        ariaHideApp={false}
      >
        <AddEditTravelStory
          type={openAddEditModel.type}
          storyInfo={openAddEditModel.data || {}}
          onClose={closeAddEditModal}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal
        isOpen={openViewModel.isShown}
        onRequestClose={closeViewModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
            backdropFilter: "blur(5px)"
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '900px',
            width: '95%',
            padding: 0,
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
        ariaHideApp={false}
      >
        <ViewTravelStory
          storyInfo={openViewModel.data}
          onClose={closeViewModal}
          onEditClick={handleEditFromView}
          onDeleteClick={handleDeleteFromView}
        />
      </Modal>

      {/* Enhanced Floating Action Button */}
      {userInfo && (
        <motion.button
          className='w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 fixed right-10 bottom-10 transition-all duration-300 shadow-2xl hover:shadow-3xl'
          onClick={openAddStoryModal}
          aria-label="Add new travel story"
          title="Add new travel story"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <MdAdd className="text-[32px] text-white" />
        </motion.button>
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Home;