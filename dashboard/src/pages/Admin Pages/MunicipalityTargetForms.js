import React, { useState, useEffect } from 'react';

import axiosInstance from '../../component/axiosInstance';

const MunicipalityTargetForms = ({ targetData, allMunicipalityTargets }) => {
  const [type, setType] = useState(targetData?.type || '');
  const [targetYear, setTargetYear] = useState(targetData?.targetYear || '');
  const [municipalitiesTargets, setMunicipalitiesTargets] = useState([]);

  const types = [
    'HEMOSEP-CARABAO', 'HEMOSEP-CATTLE', 'HEMOSEP-GOAT/SHEEP', 'RABIES',
    'NCD-POULTRY', 'HOG CHOLERA', 'DOG', 'SWINE', 'POULTRY', 'OTHERS'
  ];

  const municipalities = [
    'Ambaguio', 'Bagabag', 'Bayombong', 'Diadi', 'Quezon', 'Solano',
    'Villaverde', 'Alfonso Castañeda', 'Aritao', 'Bambang', 'Dupax del Norte',
    'Dupax del Sur', 'Kayapa', 'Kasibu', 'Santa Fe'
  ];

  useEffect(() => {
    if (allMunicipalityTargets && allMunicipalityTargets.length > 0) {
      setMunicipalitiesTargets(allMunicipalityTargets);
    } else {
      const initialTargets = municipalities.map((municipality) => {
        const target = targetData?.municipality === municipality ? targetData : {};
        return {
          municipality,
          semiAnnualTarget: target?.semiAnnualTarget || ''
        };
      });
      setMunicipalitiesTargets(initialTargets);
    }

    if (targetData) {
      setType(targetData.type);
      setTargetYear(targetData.targetYear);
    } else {
      setTargetYear(new Date().getFullYear());
    }
  }, [targetData, allMunicipalityTargets]);

  const handleTargetChange = (index, value) => {
    const updatedTargets = [...municipalitiesTargets];
    updatedTargets[index].semiAnnualTarget = value;
    setMunicipalitiesTargets(updatedTargets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type) {
      alert('Please select a type before submitting.');
      return;
    }

    try {
      const targetsToSubmit = municipalitiesTargets.filter(target => target.semiAnnualTarget);
      const response = await axiosInstance.post(`/api/mtargets/bulk`, {
        type,
        targetYear,
        targets: targetsToSubmit
      });

      if (response.data.success) {
        alert('All targets added/updated successfully');
      } else {
        console.error('Detailed error:', response.data);
        let errorMessage = 'Some targets failed to update:\n';
        response.data.failures.forEach(failure => {
          errorMessage += `${failure.municipality}: ${failure.error}\n`;
        });
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error posting targets', error);
      alert(`Failed to add/update targets: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="block text-2xl font-medium text-[#000000]">{targetData ? 'Edit Target per Municipality' : 'Add New Target per Municipality'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 w-full" disabled={!!targetData}>
            <option value="">Select Type</option>
            {types.map((t, index) => (
              <option key={index} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Target Year</label>
          <input
            type="number"
            value={targetYear}
            onChange={(e) => setTargetYear(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter Target Year"
            disabled={!!targetData}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Municipality</th>
                <th className="border p-2">Semi Annual Target</th>
              </tr>
            </thead>
            <tbody>
              {municipalitiesTargets.map((target, index) => (
                <tr key={index}>
                  <td className="border p-2">{target.municipality}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="border p-2 w-full"
                      value={target.semiAnnualTarget}
                      onChange={(e) => handleTargetChange(index, e.target.value)}
                      placeholder="Enter Target"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="w-full mt-4 bg-darkgreen text-white p-2 rounded-md hover:bg-darkergreen">
          {targetData ? 'Update Targets' : 'Add Targets'}
        </button>
      </form>
    </div>
  );
};

export default MunicipalityTargetForms;