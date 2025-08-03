import React, { useRef } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import PropTypes from 'prop-types';

const SearchBar = ({ 
  value = '', 
  onChange = () => {}, 
  onClearSearch = () => {}, 
  handleSearch = () => {},
  placeholder = 'Search stories...',
  className = '',
  disabled = false
}) => {
  const inputRef = useRef(null);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleClearClick = () => {
    onChange(''); // Clear input value
    // Check if onClearSearch exists before calling
    if (typeof onClearSearch === 'function') {
      onClearSearch(); 
    }
    inputRef.current?.focus(); // Return focus to input
  };

  return (
    <div 
      className={`relative flex items-center bg-slate-100 rounded-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/50 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      role="search"
    >
      <input 
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="search-input w-full text-sm bg-transparent py-3 px-4 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label="Search travel stories"
        disabled={disabled}
      />

      <div className="flex items-center pr-3 space-x-2">
        {value && (
          <button
            onClick={handleClearClick}
            className="text-slate-500 hover:text-black transition-colors disabled:opacity-50"
            aria-label="Clear search"
            disabled={disabled}
          >
            <IoMdClose className="text-xl" />
          </button>
        )}
        
        <button
          onClick={() => value.trim() && handleSearch()}
          className={`text-slate-400 hover:text-black transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Submit search"
          disabled={disabled || !value.trim()}
        >
          <FaMagnifyingGlass />
        </button>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClearSearch: PropTypes.func,
  handleSearch: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SearchBar;