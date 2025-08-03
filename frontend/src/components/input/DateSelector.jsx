import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdOutlineDateRange, MdClose } from 'react-icons/md';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import moment from 'moment';

const DateSelector = ({ 
  date = null, 
  setDate = () => {}, 
  required = false,
  className = '',
  disabled = false
}) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setOpenDatePicker(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        className={`inline-flex items-center gap-2 font-medium ${
          date ? 'text-sky-600 bg-sky-200/40' : 'text-gray-500 bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-200/70'} rounded px-2 py-1 cursor-pointer w-full transition-colors duration-200`}
        onClick={() => !disabled && setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-lg" />
        {date ? moment(date).format("MMM D, YYYY") : "Select date"}
        {required && <span className="text-red-500 ml-1">*</span>}
      </button>

      {openDatePicker && (
        <div className='absolute z-50 mt-1 p-5 bg-white border border-sky-100 shadow-lg rounded-lg'>
          <button
            type="button"
            aria-label="Close date picker"
            className='w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 absolute top-2 right-2 hover:bg-sky-200 transition-colors'
            onClick={() => setOpenDatePicker(false)}
          >
            <MdClose className='text-xl text-sky-600' />
          </button>

          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            defaultMonth={date || new Date()}
            modifiersClassNames={{
              selected: 'bg-sky-500 text-white hover:bg-sky-600',
              today: 'font-bold text-sky-600'
            }}
            styles={{
              day: {
                transition: 'all 0.2s ease-in-out',
                margin: '0.2em',
                borderRadius: '0.25em'
              },
              caption: {
                color: '#0369a1'
              }
            }}
            captionLayout="dropdown-buttons"
            fromYear={2020}
            toYear={new Date().getFullYear() + 5}
            disabled={{ before: new Date(2020, 0, 1) }}
          />
        </div>
      )}
    </div>
  );
};

DateSelector.propTypes = {
  date: PropTypes.instanceOf(Date),
  setDate: PropTypes.func.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default DateSelector;