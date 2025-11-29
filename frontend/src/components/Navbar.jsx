import React, { useState } from 'react';
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from './input/SearchBar';
import LOGO from "../../public/images/Triply.png";
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearSearch
}) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const onClearSearch = () => {
    console.log('Navbar: Clear search called');
    handleClearSearch();
  };

  const onSearch = () => {
    console.log('Navbar: Search called with:', searchQuery);
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className='bg-white flex items-center justify-between px-4 md:px-6 py-3 drop-shadow-md sticky top-0 z-50'>
        {/* Logo */}
        <img
          src={LOGO}
          alt='Travel Story'
          className='h-10 md:h-12 w-auto object-contain cursor-pointer'
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation */}
        <div className='hidden lg:flex items-center gap-4 flex-1 justify-center max-w-2xl mx-4'>
          {isToken && (
            <SearchBar
              value={searchQuery}
              onChange={(value) => {
                console.log('Navbar: Search query changed to:', value);
                setSearchQuery(value);
              }}
              onClearSearch={onClearSearch}
              handleSearch={onSearch}
              placeholder="Search your stories..."
            />
          )}
        </div>

        {/* Desktop Links */}
        <div className='hidden lg:flex items-center gap-3'>
          <Link
            to="/about"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span>ℹ️</span>
            About
          </Link>

          {isToken && (
            <Link
              to="/future-trips"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <span>✈️</span>
              Future Trips
            </Link>
          )}

          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <HiX className="text-2xl" />
          ) : (
            <HiMenu className="text-2xl" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeMobileMenu}
      >
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-4">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX className="text-xl text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            {userInfo && (
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
                    {userInfo?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{userInfo.fullName}</p>
                    <p className='text-xs text-gray-500'>{userInfo.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Search */}
            {isToken && (
              <div className="pb-4 border-b border-gray-200">
                <SearchBar
                  value={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
                  onClearSearch={onClearSearch}
                  handleSearch={() => {
                    onSearch();
                    closeMobileMenu();
                  }}
                  placeholder="Search stories..."
                />
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">ℹ️</span>
                <span className="font-medium">About</span>
              </Link>

              {isToken && (
                <Link
                  to="/future-trips"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">✈️</span>
                  <span className="font-medium">Future Trips</span>
                </Link>
              )}

              {isToken && (
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">📖</span>
                  <span className="font-medium">My Stories</span>
                </Link>
              )}
            </div>

            {/* Logout Button */}
            {isToken && (
              <button
                onClick={onLogout}
                className="w-full mt-4 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;