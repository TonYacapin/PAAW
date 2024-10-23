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
      <select
        value={selectedMunicipality}
        onChange={(e) => setSelectedMunicipality(e.target.value)}
        className="w-full sm:w-auto p-2 border border-gray-300 rounded-md text-black"
      >
        <option value="">Select Municipality</option>
        {municipalities.map((municipality) => (
          <option key={municipality} value={municipality}>
            {municipality}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full sm:w-auto p-2 border border-gray-300 rounded-md text-black"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full sm:w-auto p-2 border border-gray-300 rounded-md text-black"
      />

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
