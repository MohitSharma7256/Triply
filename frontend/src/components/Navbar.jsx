import React from 'react';
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from './input/SearchBar';
import LOGO from "../../public/images/Triply.png";

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearSearch
}) => {
  const isToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fixed: handleClearSearch already handles clearing the search query
  const onClearSearch = () => {
    console.log('Navbar: Clear search called'); // Debug log
    handleClearSearch();
  };

  const onSearch = () => {
    console.log('Navbar: Search called with:', searchQuery); // Debug log
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow-md sticky top-0 z-10'>
      <img
        src={LOGO}
        alt='Travel Story'
        className='h-12 w-auto object-contain cursor-pointer'
        onClick={() => navigate("/")}
      />

      <Link to="/about" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <span>ℹ️</span>
        About
      </Link>


      <div className='flex items-center gap-6'>
        {isToken && (
          <SearchBar
            value={searchQuery}
            onChange={(value) => {
              console.log('Navbar: Search query changed to:', value); // Debug log
              setSearchQuery(value);
            }}
            onClearSearch={onClearSearch}
            handleSearch={onSearch}
            placeholder="Search your stories..."
          />
        )}

        <Link
          to="/future-trips"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>✈️</span>
          Future Trips
        </Link>
      </div>

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;