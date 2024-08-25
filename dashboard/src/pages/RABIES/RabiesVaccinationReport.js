import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

function RabiesVaccinationReport() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Main fields state
  const [municipality, setMunicipality] = useState('');
  const [dateReported, setDateReported] = useState('');
  const [vaccineUsed, setVaccineUsed] = useState('');
  const [batchLotNo, setBatchLotNo] = useState('');
  const [vaccineSource, setVaccineSource] = useState('');

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        no: entries.length + 1,
        date: '',
        barangay: '',
        clientInfo: {
          firstName: '',
          lastName: '',
          gender: '',
          birthday: '',
          contactNo: ''
        },
        animalInfo: {
          name: '',
          species: '',
          sex: '',
          age: '',
          color: ''
        }
      }
    ]);
    setSelectedEntry(entries.length);
    setIsModalOpen(true);
  };

  const removeEntry = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this entry?');
    if (confirmDelete) {
      // Remove the entry
      const newEntries = entries.filter((_, i) => i !== index);
      
      // Update entry numbers
      const updatedEntries = newEntries.map((entry, i) => ({
        ...entry,
        no: i + 1
      }));
      
      setEntries(updatedEntries);

      if (selectedEntry === index) {
        setSelectedEntry(null);
        setIsModalOpen(false);
      } else if (selectedEntry > index) {
        setSelectedEntry(selectedEntry - 1);
      }
    }
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to save all entries
  const saveEntries = async () => {
    try {
      console.log(entries);
      // Replace with your backend API URL
      const response = await axios.post('http://192.168.100.12:5000/api/entries', {
        municipality,
        dateReported,
        vaccineUsed,
        batchLotNo,
        vaccineSource,
        entries
      });
      if (response.status === 201) {
        alert('Entries saved successfully');
        setEntries([]); // Clear entries after successful save
        // Clear main fields after successful save
        setMunicipality('');
        setDateReported('');
        setVaccineUsed('');
        setBatchLotNo('');
        setVaccineSource('');
      }
    } catch (error) {
      console.error('Error saving entries:', error);
      alert('Failed to save entries');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Rabies Vaccination Report</h2>

      {/* Main fields */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <input
          type="text"
          placeholder="Municipality"
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          placeholder="Date Reported"
          value={dateReported}
          onChange={(e) => setDateReported(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Vaccine Used"
          value={vaccineUsed}
          onChange={(e) => setVaccineUsed(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Batch/Lot No."
          value={batchLotNo}
          onChange={(e) => setBatchLotNo(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Vaccine Source"
          value={vaccineSource}
          onChange={(e) => setVaccineSource(e.target.value)}
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
              onClick={() => removeEntry(index)}
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

      {/* Modal */}
      {isModalOpen && selectedEntry !== null && (
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
            </div>

            <h4 className="text-lg font-semibold mb-2">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              <input
                type="text"
                placeholder="Gender"
                value={entries[selectedEntry].clientInfo.gender}
                onChange={(e) =>
                  handleClientInfoChange(selectedEntry, 'gender', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
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

            <h4 className="text-lg font-semibold mb-2">Animal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={entries[selectedEntry].animalInfo.name}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'name', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Species/Animal"
                value={entries[selectedEntry].animalInfo.species}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'species', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Sex"
                value={entries[selectedEntry].animalInfo.sex}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'sex', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Age/Age Group"
                value={entries[selectedEntry].animalInfo.age}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'age', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Color"
                value={entries[selectedEntry].animalInfo.color}
                onChange={(e) =>
                  handleAnimalInfoChange(selectedEntry, 'color', e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
              >
                Close
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RabiesVaccinationReport;
