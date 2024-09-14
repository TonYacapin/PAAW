import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import ConfirmationModal from '../../component/ConfirmationModal'; // Import the ConfirmationModal component

function RoutineServicesMonitoringReport() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [entryToRemove, setEntryToRemove] = useState(null);

  // Main fields state
  const [province, setProvince] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('');
  const [livestockTechnician, setLivestockTechnician] = useState('');

  const addEntry = () => {
    setEntries([
      ...entries,
      {
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
          species: '',
          sex: '',
          age: '',
          animalRegistered: '',
          noOfHeads: ''
        },
        activity: '',
        remark: ''
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

  const handleCancelRemove = () => {
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

  const saveEntries = async () => {
    try {
      // Replace with your backend API URL
      const response = await axios.post('http://localhost:5000/RSM', {
        province,
        municipality,
        reportingPeriod,
        livestockTechnician,
        entries
      });
      if (response.status === 201) {
        alert('Entries saved successfully');
        setEntries([]);
        setProvince('');
        setMunicipality('');
        setReportingPeriod('');
        setLivestockTechnician('');
      }
    } catch (error) {
      console.error('Error saving entries:', error);
      alert('Failed to save entries');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Routine Services Monitoring Report</h2>

      {/* Main fields */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="province" className="block mb-1">Province</label>
          <input
            id="province"
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="municipality" className="block mb-1">Municipality</label>
          <input
            id="municipality"
            type="text"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="reportingPeriod" className="block mb-1">Reporting Period</label>
          <input
            id="reportingPeriod"
            type="text"
            value={reportingPeriod}
            onChange={(e) => setReportingPeriod(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="livestockTechnician" className="block mb-1">Livestock Technician</label>
          <input
            id="livestockTechnician"
            type="text"
            value={livestockTechnician}
            onChange={(e) => setLivestockTechnician(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
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
            <h3 className="text-xl font-semibold mb-2">Entry {index + 1}</h3>
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
            <h3 className="text-2xl font-bold mb-4">Edit Entry {selectedEntry + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="block mb-1">Date</label>
                <input
                  id="date"
                  type="date"
                  value={entries[selectedEntry].date}
                  onChange={(e) => handleEntryChange(selectedEntry, 'date', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="barangay" className="block mb-1">Barangay</label>
                <input
                  id="barangay"
                  type="text"
                  value={entries[selectedEntry].barangay}
                  onChange={(e) => handleEntryChange(selectedEntry, 'barangay', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={entries[selectedEntry].clientInfo.firstName}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'firstName', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={entries[selectedEntry].clientInfo.lastName}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'lastName', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block mb-1">Gender</label>
                <input
                  id="gender"
                  type="text"
                  value={entries[selectedEntry].clientInfo.gender}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'gender', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="birthday" className="block mb-1">Birthday</label>
                <input
                  id="birthday"
                  type="date"
                  value={entries[selectedEntry].clientInfo.birthday}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'birthday', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="contactNo" className="block mb-1">Contact No.</label>
                <input
                  id="contactNo"
                  type="text"
                  value={entries[selectedEntry].clientInfo.contactNo}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'contactNo', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">Animal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="species" className="block mb-1">Species/Animal</label>
                <input
                  id="species"
                  type="text"
                  value={entries[selectedEntry].animalInfo.species}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'species', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="sex" className="block mb-1">Sex</label>
                <input
                  id="sex"
                  type="text"
                  value={entries[selectedEntry].animalInfo.sex}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'sex', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="age" className="block mb-1">Age/Age Group</label>
                <input
                  id="age"
                  type="text"
                  value={entries[selectedEntry].animalInfo.age}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'age', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="animalRegistered" className="block mb-1">Animal Registered</label>
                <input
                  id="animalRegistered"
                  type="text"
                  value={entries[selectedEntry].animalInfo.animalRegistered}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'animalRegistered', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="noOfHeads" className="block mb-1">No. of Heads</label>
                <input
                  id="noOfHeads"
                  type="text"
                  value={entries[selectedEntry].animalInfo.noOfHeads}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'noOfHeads', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">Activity and Remark</h4>
            <div>
              <label htmlFor="activity" className="block mb-1">Activity</label>
              <textarea
                id="activity"
                value={entries[selectedEntry].activity}
                onChange={(e) => handleEntryChange(selectedEntry, 'activity', e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />
            </div>
            <div>
              <label htmlFor="remark" className="block mb-1">Remark</label>
              <textarea
                id="remark"
                value={entries[selectedEntry].remark}
                onChange={(e) => handleEntryChange(selectedEntry, 'remark', e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
          message="Are you sure you want to remove this entry?"
        />
      )}

    </div>
  );
}

export default RoutineServicesMonitoringReport;
