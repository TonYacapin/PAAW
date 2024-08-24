import React, { useState } from 'react';

function RabiesVaccinationReport() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Rabies Vaccination Report</h2>
      
      {/* Main fields */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <input
          type="text"
          placeholder="Municipality"
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          placeholder="Date Reported"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Vaccine Used"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Batch/Lot No."
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Vaccine Source"
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
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
          </div>
        ))}
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
                type="text"
                placeholder="Birthday (MM/DD/YYYY)"
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
