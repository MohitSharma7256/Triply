import React from 'react';
import moment from 'moment';
import { MdOutlineClose } from 'react-icons/md';
import PropTypes from 'prop-types';

const FilterInfoTitle = ({
  activeFilter = "",
  filterDate = null,
  searchQuery = "",
  onClear,
  className = ""
}) => {
  const formatDate = (date) => (date ? moment(date).format("MMM D, YYYY") : "");

  // Don't render if no active filter or no relevant filter data
  if (!activeFilter || (activeFilter === "search" && !searchQuery) || (activeFilter === "date" && !filterDate)) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 mb-4 ${className}`}>
      {activeFilter === "search" && (
        <>
          <span className="text-base font-medium text-gray-700">
            Search results for: <span className="text-blue-600">"{searchQuery}"</span>
          </span>
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            aria-label="Clear search filter"
          >
            <MdOutlineClose size={14} />
            <span>Clear</span>
          </button>
        </>
      )}

      {activeFilter === "date" && (
        <>
          <span className="text-base font-medium text-gray-700">Filtered by date:</span>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-700">
              {formatDate(filterDate)}
            </span>
            <button
              onClick={onClear}
              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
              aria-label="Clear date filter"
            >
              <MdOutlineClose size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

FilterInfoTitle.propTypes = {
  activeFilter: PropTypes.oneOf(["", "search", "date"]),
  filterDate: PropTypes.instanceOf(Date),
  searchQuery: PropTypes.string,
  onClear: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default FilterInfoTitle;