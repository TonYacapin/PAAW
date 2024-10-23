import React, { useState } from 'react';

const FilterComponent = ({ municipalities, onFilter }) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilters = () => {
    // Pass the selected filter values back to the parent component
    onFilter({
      municipality: selectedMunicipality,
      startDate,
      endDate,
    });
  };

  return (
    <div className="filter-container p-4 bg-white shadow-lg rounded-lg flex flex-col sm:flex-row gap-4 items-center">
      <div className="w-full sm:w-auto">
        <label className="block text-gray-700 mb-1" htmlFor="municipality-select">
          Municipality
        </label>
        <select
          id="municipality-select"
          value={selectedMunicipality}
          onChange={(e) => setSelectedMunicipality(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        >
          <option value="">Select Municipality</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <label className="block text-gray-700 mb-1" htmlFor="start-date">
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      <div className="w-full sm:w-auto">
        <label className="block text-gray-700 mb-1" htmlFor="end-date">
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      <button
        onClick={handleApplyFilters}
        className="apply-filters-btn p-2 bg-darkgreen text-white rounded-md hover:bg-darkergreen transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterComponent;
