import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import ConfirmationModal from '../../component/ConfirmationModal'; // Import the ConfirmationModal component
import Papa from 'papaparse';


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
  const [vaccine, setVaccine] = useState('');
  const exportAsCSV = () => {
    const data = [];

    // Add the main fields as the first row
    data.push({
      Vaccine: vaccine,
      Municipality: municipality,
      Province: province,
      DateReported: dateReported,
      VaccineType: vaccineType, // Ensure vaccineType is captured
      BatchLotNo: batchLotNo,
      VaccineSource: vaccineSource,
      AgriculturalExtensionWorker: agriculturalExtensionWorker,
      No: '', // For alignment with entry rows
      Date: '',
      Barangay: '',
      Reason: '',
      ClientFirstName: '',
      ClientLastName: '',
      ClientGender: '',
      ClientBirthday: '',
      ClientContactNo: '',
      AnimalSpecies: '',
      AnimalSex: '',
      AnimalAge: '',
      AnimalRegistered: '', // Align with entries below
      AnimalRemarks: ''
    });

    // Add the entries as additional rows
    entries.forEach(entry => {
      data.push({
        Vaccine: '',
        Municipality: '',
        Province: '',
        DateReported: '',
        VaccineType: '', // Leave blank in entry rows
        BatchLotNo: '',
        VaccineSource: '',
        AgriculturalExtensionWorker: '',
        No: entry.no,
        Date: entry.date,
        Barangay: entry.barangay,
        Reason: entry.reason,
        ClientFirstName: entry.clientInfo.firstName,
        ClientLastName: entry.clientInfo.lastName,
        ClientGender: entry.clientInfo.gender,
        ClientBirthday: entry.clientInfo.birthday,
        ClientContactNo: entry.clientInfo.contactNo,
        AnimalSpecies: entry.animalInfo.species,
        AnimalSex: entry.animalInfo.sex,
        AnimalAge: entry.animalInfo.age,
        AnimalRegistered: entry.animalInfo.registered ? 'Yes' : 'No', // Capture animal registered status
        AnimalRemarks: entry.animalInfo.remarks
      });
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Create a file name with a naming convention
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `vaccination_report_${municipality}_${date}.csv`;

    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Import CSV file
  const importCSV = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert('No file selected.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedData = results.data;

        if (importedData.length === 0) {
          alert('No data found in the CSV file.');
          return;
        }

        // Get the first row for the main fields
        const mainFields = importedData[0];
        setVaccine(mainFields.Vaccine || '');
        setMunicipality(mainFields.Municipality || '');
        setProvince(mainFields.Province || 'Nueva Vizcaya');
        setDateReported(mainFields.DateReported || '');
        setVaccineType(mainFields.VaccineType || ''); // Correct assignment of vaccineType
        setBatchLotNo(mainFields.BatchLotNo || '');
        setVaccineSource(mainFields.VaccineSource || '');
        setAgriculturalExtensionWorker(mainFields.AgriculturalExtensionWorker || '');

        // Get the remaining rows for the entries
        const importedEntries = importedData.slice(1).map((entry, index) => ({
          no: index + 1,
          date: entry.Date || '',
          barangay: entry.Barangay || '',
          reason: entry.Reason || '',
          clientInfo: {
            firstName: entry.ClientFirstName || '',
            lastName: entry.ClientLastName || '',
            gender: entry.ClientGender || '',
            birthday: entry.ClientBirthday || '',
            contactNo: entry.ClientContactNo || ''
          },
          animalInfo: {
            species: entry.AnimalSpecies || '',
            sex: entry.AnimalSex || '',
            age: entry.AnimalAge || '',
            registered: entry.AnimalRegistered === 'Yes' ? true : false, // Handle animal registered
            remarks: entry.AnimalRemarks || ''
          }
        }));

        setEntries(importedEntries);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Failed to import CSV file.');
      }
    });
  };




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
      console.log(vaccine);
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/reports`, {
        vaccine,
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
        setVaccine('');
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
      {/* Import CSV Input */}
      <div className="flex justify-end mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={importCSV}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        />
      </div>
      <h2 className="text-2xl font-bold mb-4">Vaccination Report</h2>

      {/* Main fields */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="vaccine" className="block mb-1">Vaccine</label>
          <select
            id="vaccine"
            value={vaccine}
            onChange={(e) => setVaccine(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Vaccine</option>
            <option value="Hemorrhagic Septicemia">Hemorrhagic Septicemia</option>
            <option value="Newcastle Disease">Newcastle Disease</option>
            <option value="Hog Cholera">Hog Cholera</option>
          </select>
        </div>
        <div>
          <label htmlFor="municipality" className="block mb-1">Municipality</label>
          <select
            id="municipality"
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
        </div>

        <div>
          <label htmlFor="dateReported" className="block mb-1">Date Reported</label>
          <input
            id="dateReported"
            type="date"
            value={dateReported}
            onChange={(e) => setDateReported(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="vaccineType" className="block mb-1">Vaccine Type</label>
          <select
            id="vaccineType"
            value={vaccineType}
            onChange={(e) => setVaccineType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>Select Vaccine Type</option>
            <option value="Live">Live</option>
            <option value="Killed">Killed</option>
            <option value="Attenuated">Attenuated</option>
          </select>
        </div>

        <div>
          <label htmlFor="batchLotNo" className="block mb-1">Batch/Lot No.</label>
          <input
            id="batchLotNo"
            type="text"
            value={batchLotNo}
            onChange={(e) => setBatchLotNo(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="vaccineSource" className="block mb-1">Vaccine Source</label>
          <select
            id="vaccineSource"
            value={vaccineSource}
            onChange={(e) => setVaccineSource(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>Select Vaccine Source</option>
            <option value="MLGU">MLGU</option>
            <option value="PLGU">PLGU</option>
            <option value="RFU">RFU</option>
          </select>
        </div>

        <div>
          <label htmlFor="agriculturalExtensionWorker" className="block mb-1">Agricultural Extension Worker</label>
          <input
            id="agriculturalExtensionWorker"
            type="text"
            value={agriculturalExtensionWorker}
            onChange={(e) => setAgriculturalExtensionWorker(e.target.value)}
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


      {/* Save Entries Button */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={exportAsCSV}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Save CSV
        </button>
      </div>

      {/* Modal for Editing Entries */}
      {selectedEntry !== null && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Entry {entries[selectedEntry].no}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="entryDate" className="block mb-1">Date</label>
                <input
                  id="entryDate"
                  type="date"
                  value={entries[selectedEntry].date}
                  onChange={(e) => handleEntryChange(selectedEntry, 'date', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="entryBarangay" className="block mb-1">Barangay</label>
                <input
                  id="entryBarangay"
                  type="text"
                  value={entries[selectedEntry].barangay}
                  onChange={(e) => handleEntryChange(selectedEntry, 'barangay', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="entryReason" className="block mb-1">Reason</label>
                <select
                  id="entryReason"
                  value={entries[selectedEntry].reason}
                  onChange={(e) => handleEntryChange(selectedEntry, 'reason', e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>Select Reason</option>
                  <option value="Mass">Mass</option>
                  <option value="Routine">Routine</option>
                  <option value="Outbreak">Outbreak</option>
                </select>
              </div>
            </div>

            {/* Client Information */}
            <h4 className="text-xl font-semibold mb-2">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="clientFirstName" className="block mb-1">First Name</label>
                <input
                  id="clientFirstName"
                  type="text"
                  value={entries[selectedEntry].clientInfo.firstName}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'firstName', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="clientLastName" className="block mb-1">Last Name</label>
                <input
                  id="clientLastName"
                  type="text"
                  value={entries[selectedEntry].clientInfo.lastName}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'lastName', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="clientGender" className="block mb-1">Gender</label>
                <select
                  id="clientGender"
                  value={entries[selectedEntry].clientInfo.gender}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'gender', e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="clientBirthday" className="block mb-1">Birthday</label>
                <input
                  id="clientBirthday"
                  type="date"
                  value={entries[selectedEntry].clientInfo.birthday}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'birthday', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="clientContactNo" className="block mb-1">Contact No.</label>
                <input
                  id="clientContactNo"
                  type="text"
                  value={entries[selectedEntry].clientInfo.contactNo}
                  onChange={(e) => handleClientInfoChange(selectedEntry, 'contactNo', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            {/* Animal Information */}
            <h4 className="text-xl font-semibold mb-2">Animal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="animalSpecies" className="block mb-1">Species</label>
                <select
                  id="animalSpecies"
                  value={entries[selectedEntry].animalInfo.species}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'species', e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="Carabao">Carabao</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Goat/Sheep">Goat/Sheep</option>
                  <option value="Swine">Swine</option>
                  <option value="Poultry">Poultry</option>
                </select>
              </div>
              <div>
                <label htmlFor="animalSex" className="block mb-1">Sex</label>
                <select
                  id="animalSex"
                  value={entries[selectedEntry].animalInfo.sex}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'sex', e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="animalAge" className="block mb-1">Age</label>
                <input
                  id="animalAge"
                  type="text"
                  value={entries[selectedEntry].animalInfo.age}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'age', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="animalRegistered" className="block mb-1">Animal Registered</label>
                <select
                  id="animalRegistered"
                  value={entries[selectedEntry].animalInfo.registered}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'registered', e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>Animal Registered</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label htmlFor="animalRemarks" className="block mb-1">Remarks</label>
                <input
                  id="animalRemarks"
                  type="text"
                  value={entries[selectedEntry].animalInfo.remarks}
                  onChange={(e) => handleAnimalInfoChange(selectedEntry, 'remarks', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
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
