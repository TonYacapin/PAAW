import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MunicipalityTargetForms = () => {
  const [type, setType] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [semiAnnualTarget, setSemiAnnualTarget] = useState('');
  const [targetYear, setTargetYear] = useState('');

  const types = [
    'HEMOSEP-CARABAO', 'HEMOSEP-CATTLE', 'HEMOSEP-GOAT/SHEEP', 'RABIES', 
    'NCD-POULTRY', 'HOG CHOLERA', 'DOG', 'SWINE', 'POULTRY', 'OTHERS'
  ];

  const municipalities = [
    'Ambaguio', 'Bagabag', 'Bayombong', 'Diadi', 'Quezon', 'Solano', 
    'Villaverde', 'Alfonso Castañeda', 'Aritao', 'Bambang', 'Dupax del Norte', 
    'Dupax del Sur', 'Kayapa', 'Kasibu', 'Santa Fe'
  ];

  // Set the current year as the default value for targetYear
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setTargetYear(currentYear);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/municipality-targets', {
        type,
        municipality,
        semiAnnualTarget,
        targetYear,
      });
      alert('Target added successfully');
    } catch (error) {
      console.error('Error posting target', error);
      alert('Failed to add target');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Post New Target</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 w-full">
            <option value="">Select Type</option>
            {types.map((t, index) => (
              <option key={index} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Municipality</label>
          <select value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="border p-2 w-full">
            <option value="">Select Municipality</option>
            {municipalities.map((m, index) => (
              <option key={index} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Semi Annual Target</label>
          <input
            type="number"
            value={semiAnnualTarget}
            onChange={(e) => setSemiAnnualTarget(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter Semi Annual Target"
          />
        </div>

        <div>
          <label className="block">Target Year</label>
          <input
            type="number"
            value={targetYear}
            onChange={(e) => setTargetYear(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter Target Year"
          />
        </div>

        <button type="submit" className="bg-green-500 text-white py-2 px-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MunicipalityTargetForms;
