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
    <div className="filter-container">
      <select
        value={selectedMunicipality}
        onChange={(e) => setSelectedMunicipality(e.target.value)}
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
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button onClick={handleApplyFilters} className="apply-filters-btn">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterComponent;
