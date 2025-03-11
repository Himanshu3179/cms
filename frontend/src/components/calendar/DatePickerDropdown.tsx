import React from 'react';

// Months for dropdown
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate years for dropdown (current year - 5 to current year + 5)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

interface DatePickerDropdownProps {
  currentDate: Date;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  goToToday: () => void;
}

export default function DatePickerDropdown({
  currentDate,
  handleMonthChange,
  handleYearChange,
  goToToday
}: DatePickerDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={currentDate.getMonth()}
        onChange={handleMonthChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
      >
        {months.map((month, index) => (
          <option key={month} value={index}>{month}</option>
        ))}
      </select>
      
      <select
        value={currentDate.getFullYear()}
        onChange={handleYearChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      
      <button
        onClick={goToToday}
        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
      >
        Today
      </button>
    </div>
  );
}