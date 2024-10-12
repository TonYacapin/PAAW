import React, { useState } from 'react';

function SlaughterReportForm() {
  const municipalities = [
    'Ambaguio', 'Bagabag', 'Bayombong', 'Diadi', 'Quezon', 
    'Solano', 'Villaverde', 'Alfonso Castañeda', 'Aritao', 
    'Bambang', 'Dupax del Norte', 'Dupax del Sur', 'Kayapa', 
    'Kasibu', 'Santa Fe'
  ];

  const animals = ['Cattle', 'Carabao', 'Goat', 'Sheep', 'Hog', 'Chicken'];

  const [formData, setFormData] = useState({
    municipality: '',
    month: '',
    year: '',
    slaughterAnimals: animals.map(animal => ({
      name: animal,
      number: '',
      weight: ''
    }))
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'municipality' || name === 'month' || name === 'year') {
      setFormData({ ...formData, [name]: value });
    } else {
      const updatedAnimals = [...formData.slaughterAnimals];
      updatedAnimals[index][name] = value;
      setFormData({ ...formData, slaughterAnimals: updatedAnimals });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Municipality Dropdown */}
      <div>
        <label htmlFor="municipality" className="block text-sm font-medium text-darkgreen mb-1">
          Municipality
        </label>
        <select
          id="municipality"
          name="municipality"
          value={formData.municipality}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-darkgreen"
          required
        >
          <option value="">Select Municipality</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
      </div>

      {/* Month and Year Input */}
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1">
          <label htmlFor="month" className="block text-sm font-medium text-darkgreen mb-1">
            Month
          </label>
          <input
            type="number"
            id="month"
            name="month"
            value={formData.month}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-darkgreen"
            placeholder="Month"
            min="1"
            max="12"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="year" className="block text-sm font-medium text-darkgreen mb-1">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-darkgreen"
            placeholder="Year"
            min="1900"
            max="2100"
            required
          />
        </div>
      </div>

      {/* Slaughter Animals Section */}
      <div>
        <h3 className="text-lg font-medium text-darkgreen">Slaughter Animals</h3>
        {formData.slaughterAnimals.map((animal, index) => (
          <div key={animal.name} className="space-y-2 mt-4">
            <h4 className="text-md font-medium text-darkgreen">{animal.name}</h4>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label htmlFor={`number-${index}`} className="block text-sm font-medium text-darkgreen mb-1">
                  Number
                </label>
                <input
                  type="number"
                  id={`number-${index}`}
                  name="number"
                  value={animal.number}
                  onChange={(e) => handleInputChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-darkgreen"
                  placeholder="Number"
                  min="0"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`weight-${index}`} className="block text-sm font-medium text-darkgreen mb-1">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  id={`weight-${index}`}
                  name="weight"
                  value={animal.weight}
                  onChange={(e) => handleInputChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-darkgreen"
                  placeholder="Weight"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-darkgreen text-white py-2 rounded-md shadow-md hover:bg-darkergreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkgreen"
        >
          Submit Report
        </button>
      </div>
    </form>
  );
}

export default SlaughterReportForm;
