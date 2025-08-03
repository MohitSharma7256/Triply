import React, { useState, useEffect, useRef } from 'react';
import { MdAdd, MdEdit, MdDelete, MdLocationOn, MdCalendarToday, MdAccessTime } from 'react-icons/md';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import Modal from 'react-modal';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const FutureTrips = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const intervalRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    budget: '',
    accommodation: '',
    activities: []
  });

  // Get user info
  const getUserInfo = async () => {
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
      }
    }
  };

  // Calculate countdown
  const calculateCountdown = (targetDate) => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isOver: false };
  };

  // Update countdown every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTrips(prevTrips => [...prevTrips]); // Force re-render
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Fetch trips and user info on component mount
  useEffect(() => {
    getUserInfo();
    fetchTrips();
    Modal.setAppElement('#root');
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axiosInstance.get('/future-trips');
      setTrips(response.data.trips || []);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      // For now, let's add some dummy data to test the UI
      setTrips([
        {
          _id: '1',
          title: 'Summer Vacation',
          destination: 'Paris, France',
          startDate: '2024-07-15T00:00:00.000Z',
          endDate: '2024-07-22T00:00:00.000Z',
          description: 'A wonderful trip to Paris',
          budget: '5000',
          accommodation: 'Hotel',
          activities: ['Visit Eiffel Tower', 'Louvre Museum', 'Seine River Cruise']
        },
        {
          _id: '2',
          title: 'Beach Holiday',
          destination: 'Bali, Indonesia',
          startDate: '2024-08-01T00:00:00.000Z',
          endDate: '2024-08-08T00:00:00.000Z',
          description: 'Relaxing beach vacation',
          budget: '3000',
          accommodation: 'Resort',
          activities: ['Beach activities', 'Temple visits', 'Spa treatments']
        }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const tripData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        activities: formData.activities.filter(activity => activity.trim() !== '')
      };

      if (editingTrip) {
        await axiosInstance.put(`/future-trips/${editingTrip._id}`, tripData);
        toast.success('Trip updated successfully!');
      } else {
        await axiosInstance.post('/future-trips', tripData);
        toast.success('Trip added successfully!');
      }

      fetchTrips();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save trip');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axiosInstance.delete(`/future-trips/${tripId}`);
        toast.success('Trip deleted successfully!');
        fetchTrips();
      } catch (error) {
        toast.error('Failed to delete trip');
      }
    }
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.split('T')[0],
      endDate: trip.endDate.split('T')[0],
      description: trip.description,
      budget: trip.budget,
      accommodation: trip.accommodation,
      activities: trip.activities || []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrip(null);
    setFormData({
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      description: '',
      budget: '',
      accommodation: '',
      activities: []
    });
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, '']
    }));
  };

  const updateActivity = (index, value) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => 
        i === index ? value : activity
      )
    }));
  };

  const removeActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const getTripStatus = (trip) => {
    const countdown = calculateCountdown(trip.startDate);
    if (countdown.isOver) {
      return 'ongoing';
    }
    if (countdown.days <= 7) {
      return 'soon';
    }
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'soon': return 'bg-orange-100 text-orange-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Navbar userInfo={userInfo} />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Future Trips</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdAdd className="text-xl" />
            Add New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No future trips planned</h3>
            <p className="text-gray-500">Start planning your next adventure!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const countdown = calculateCountdown(trip.startDate);
              const status = getTripStatus(trip);
              
              return (
                <div key={trip._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{trip.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdLocationOn className="text-lg" />
                        <span>{trip.destination}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdCalendarToday className="text-lg" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      {trip.budget && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">💰</span>
                          <span>Budget: &#x20B9;{trip.budget}</span>
                        </div>
                      )}
                    </div>

                    {!countdown.isOver ? (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Countdown to Trip</h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-white rounded p-2">
                            <div className="text-lg font-bold text-blue-600">{countdown.days}</div>
                            <div className="text-xs text-gray-500">Days</div>
                          </div>
                          <div className="bg-white rounded p-2">
                            <div className="text-lg font-bold text-blue-600">{countdown.hours}</div>
                            <div className="text-xs text-gray-500">Hours</div>
                          </div>
                          <div className="bg-white rounded p-2">
                            <div className="text-lg font-bold text-blue-600">{countdown.minutes}</div>
                            <div className="text-xs text-gray-500">Minutes</div>
                          </div>
                          <div className="bg-white rounded p-2">
                            <div className="text-lg font-bold text-blue-600">{countdown.seconds}</div>
                            <div className="text-xs text-gray-500">Seconds</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 rounded-lg p-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🎉</div>
                          <p className="text-green-800 font-medium">Your trip is ongoing!</p>
                        </div>
                      </div>
                    )}

                    {trip.description && (
                      <p className="text-gray-600 text-sm mb-4">{trip.description}</p>
                    )}

                    {trip.activities && trip.activities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Planned Activities</h4>
                        <div className="flex flex-wrap gap-1">
                          {trip.activities.map((activity, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTrip(trip)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <MdEdit className="text-sm" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip._id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        <MdDelete className="text-sm" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Trip Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {editingTrip ? 'Edit Trip' : 'Add New Trip'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trip Title*</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Summer Vacation 2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination*</label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Paris, France"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Tell us about your trip plans..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                    <input
                      type="text"
                      value={formData.accommodation}
                      onChange={(e) => setFormData(prev => ({ ...prev, accommodation: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Hotel, Airbnb, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planned Activities</label>
                  <div className="space-y-2">
                    {formData.activities.map((activity, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => updateActivity(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Activity name"
                        />
                        <button
                          type="button"
                          onClick={() => removeActivity(index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addActivity}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      <MdAdd className="text-sm" />
                      Add Activity
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingTrip ? 'Update Trip' : 'Add Trip'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default FutureTrips;