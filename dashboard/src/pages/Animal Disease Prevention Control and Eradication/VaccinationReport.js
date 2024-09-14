import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import ConfirmationModal from '../../component/ConfirmationModal'; // Import the ConfirmationModal component

function VaccinationReport() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [entryToRemove, setEntryToRemove] = useState(null);

  // Main fields state
  const [municipality, setMunicipality] = useState('');
  const [province, setProvince] = useState('Nueva Vizcaya'); // Preset province
  const [dateReported, setDateReported] = useState('');
  const [vaccineType, setVaccineType] = useState(''); // New field for vaccine type
  const [batchLotNo, setBatchLotNo] = useState('');
  const [vaccineSource, setVaccineSource] = useState('');
  const [agriculturalExtensionWorker, setAgriculturalExtensionWorker] = useState('');

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        no: entries.length + 1,
        date: '',
        barangay: '',
        reason: '', // New reason field
        clientInfo: {
          firstName: '',
          lastName: '',
          gender: '',
          birthday: '',
          contactNo: ''
        },
        animalInfo: {
          species: '',
          sex: '',
          age: '',
          registered: '', // New animal registered field
          remarks: ''
        }
      }
    ]);
    setSelectedEntry(entries.length);
  };

  const openConfirmationModal = (index) => {
    setEntryToRemove(index);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (entryToRemove !== null) {
      const newEntries = entries.filter((_, i) => i !== entryToRemove);

      const updatedEntries = newEntries.map((entry, i) => ({
        ...entry,
        no: i + 1
      }));

      setEntries(updatedEntries);

      if (selectedEntry === entryToRemove) {
        setSelectedEntry(null);
      } else if (selectedEntry > entryToRemove) {
        setSelectedEntry(selectedEntry - 1);
      }
    }
    setIsConfirmationModalOpen(false);
    setEntryToRemove(null);
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleClientInfoChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index].clientInfo[field] = value;
    setEntries(newEntries);
  };

  const handleAnimalInfoChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index].animalInfo[field] = value;
    setEntries(newEntries);
  };

  const openModal = (index) => {
    setSelectedEntry(index);
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  // Function to save all entries
  const saveEntries = async () => {
    try {
      console.log(entries);
      const response = await axios.post('http://localhost:5000/api/reports', {
        municipality,
        province,
        dateReported,
        vaccineType,
        batchLotNo,
        vaccineSource,
        agriculturalExtensionWorker,
        entries
      });
      if (response.status === 201) {
        alert('Entries saved successfully');
        setEntries([]);
        setMunicipality('');
        setProvince('Nueva Vizcaya');
        setDateReported('');
        setVaccineType('');
        setBatchLotNo('');
        setVaccineSource('');
        setAgriculturalExtensionWorker('');
      }
    } catch (error) {
      console.error('Error saving entries:', error);
      alert('Failed to save entries');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Vaccination Report</h2>

      {/* Main fields */}
      <div className="grid grid-cols-1 gap-4 mb-4">
      <select
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Municipality</option>
          <option value="Ambaguio">Ambaguio</option>
          <option value="Bagabag">Bagabag</option>
          <option value="Bayombong">Bayombong</option>
          <option value="Diadi">Diadi</option>
          <option value="Quezon">Quezon</option>
          <option value="Solano">Solano</option>
          <option value="Villaverde">Villaverde</option>
          <option value="Alfonso Castañeda">Alfonso Castañeda</option>
          <option value="Aritao">Aritao</option>
          <option value="Bambang">Bambang</option>
          <option value="Dupax del Norte">Dupax del Norte</option>
          <option value="Dupax del Sur">Dupax del Sur</option>
          <option value="Kayapa">Kayapa</option>
          <option value="Kasibu">Kasibu</option>
          <option value="Santa Fe">Santa Fe</option>
        </select>
        <input
          type="date"
          placeholder="Date Reported"
          value={dateReported}
          onChange={(e) => setDateReported(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={vaccineType}
          onChange={(e) => setVaccineType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="" disabled>Select Vaccine Type</option>
          <option value="Live">Live</option>
          <option value="Killed">Killed</option>
          <option value="Attenuated">Attenuated</option>
        </select>
        <input
          type="text"
          placeholder="Batch/Lot No."
          value={batchLotNo}
          onChange={(e) => setBatchLotNo(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={vaccineSource}
          onChange={(e) => setVaccineSource(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="" disabled>Select Vaccine Source</option>
          <option value="MLGU">MLGU</option>
          <option value="PLGU">PLGU</option>
          <option value="RFU">RFU</option>
        </select>
        <input
          type="text"
          placeholder="Agricultural Extension Worker"
          value={agriculturalExtensionWorker}
          onChange={(e) => setAgriculturalExtensionWorker(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Entries section */}
      <div>
        <button
          type="button"
          onClick={addEntry}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Add Entry
        </button>

        {entries.map((entry, index) => (
          <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">Entry {entry.no}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <p>Date: {entry.date || 'N/A'}</p>
              <p>Barangay: {entry.barangay || 'N/A'}</p>
              <p>Client: {entry.clientInfo.firstName || 'N/A'} {entry.clientInfo.lastName || ''}</p>
            </div>
            <button
              type="button"
              onClick={() => openModal(index)}
              className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => openConfirmationModal(index)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Save Entries Button */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={saveEntries}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Save Entries
        </button>
      </div>

      {/* Modal for Editing Entries */}
      {selectedEntry !== null && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Entry {entries[selectedEntry].no}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="date"
                placeholder="Date"
                value={entries[selectedEntry].date}
                onChange={(e) =>
                  handleEntryChange(selectedEntry, 'date', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Barangay"
                value={entries[selectedEntry].barangay}
                onChange={(e) =>
                  handleEntryChange(selectedEntry, 'barangay', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              {/* <select
                value={entries[selectedEntry].category}
                onChange={(e) =>
                  handleEntryChange(selectedEntry, 'category', e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                <option value="" disabled>Select Category</option>
                <option value="Owner">Owner</option>
                <option value="Client">Client</option>
              </select> */}
              <select
                value={entries[selectedEntry].reason}
                onChange={(e) =>
                  handleEntryChange(selectedEntry, 'reason', e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                <option value="" disabled>Select Reason</option>
                <option value="Mass">Mass</option>
                <option value="Routine">Routine</option>
                <option value="Outbreak">Outbreak</option>
              </select>


            </div>

            {/* Client Information */}
            <h4 className="text-xl font-semibold mb-2">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={entries[selectedEntry].clientInfo.firstName}
                onChange={(e) =>
                  handleClientInfoChange(selectedEntry, 'firstName', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={entries[selectedEntry].clientInfo.lastName}
                onChange={(e) =>
                  handleClientInfoChange(selectedEntry, 'lastName', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <select
                value={entries[selectedEntry].clientInfo.gender}
                onChange={(e) =>
                  handleClientInfoChange(selectedEntry, 'gender', e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                placeholder="Birthday"
                value={entries[selectedEntry].clientInfo.birthday}
                onChange={(e) =>
                  handleClientInfoChange(selectedEntry, 'birthday', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Contact No."
                value={entries[selectedEntry].clientInfo.contactNo}
                onChange={(e) =>
                  handleClientInfoChange(selectedEntry, 'contactNo', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Animal Information */}
            <h4 className="text-xl font-semibold mb-2">Animal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

              <input
                type="text"
                placeholder="Species"
                value={entries[selectedEntry].animalInfo.species}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'species', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <select
                value={entries[selectedEntry].animalInfo.sex}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'sex', e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                <option value="" disabled>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                placeholder="Age"
                value={entries[selectedEntry].animalInfo.age}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'age', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <select
                value={entries[selectedEntry].animalInfo.registered}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'registered', e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                <option value="" disabled>Animal Registered</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <input
                type="text"
                placeholder="Remarks"
                value={entries[selectedEntry].animalInfo.remarks}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'remarks', e.target.value)
                }
                className="border p-2 rounded w-full"
              />

            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Close
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Removing Entries */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmRemove}
          message="Are you sure you want to remove this entry?"
        />
      )}
    </div>
  );
}

export default VaccinationReport;
