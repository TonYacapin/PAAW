import React, { useState } from "react";
import axios from "axios"; // Import axios for HTTP requests
import Papa from "papaparse"; // Import PapaParse for CSV handling
import FormSubmit from "../component/FormSubmit";
import ConfirmationModal from "../component/ConfirmationModal";

const UpgradingServices = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [entryToRemove, setEntryToRemove] = useState(null);

  // Main fields state
  const [municipality, setMunicipality] = useState("");
  const [dateReported, setDateReported] = useState("");
  const [activity, setActivity] = useState("");

  {
    entries.map((entry, index) => (
      <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
        <h3 className="text-xl font-semibold mb-2">Entry {entry.no}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <p>Date: {entry.date || "N/A"}</p>
          <p>Barangay: {entry.barangay || "N/A"}</p>
          <p>
            Client: {entry.clientInfo.firstName || "N/A"}{" "}
            {entry.clientInfo.lastName || ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal(index)}
          className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded mr-2"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => openConfirmationModal(index)}
          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
        >
          Remove
        </button>
      </div>
    ));
  }

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        no: entries.length + 1,
        date: "",
        barangay: "",
        clientInfo: {
          firstName: "",
          lastName: "",
          gender: "",
          birthday: "",
          contactNo: "",
        },
        animalInfo: {
          species: "",
          breed: "", // Adjust this field in your application if required
          sex: "",
          age: "",
          color: "",
        },
        estrus: "", // Estrus field added
        sireCodeNum: "", // Sire code number field added
        activity: "",
        remarks: "",
      },
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
        no: i + 1,
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
      console.log(entries);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/entries`,
        {
          municipality,
          dateReported,
          entries,
        }
      );
      if (response.status === 201) {
        alert("Entries saved successfully");
        setEntries([]);
        setMunicipality("");
        setDateReported("");
      }
    } catch (error) {
      console.error("Error saving entries:", error);
      alert("Failed to save entries");
    }
  };

  const exportAsCSV = () => {
    const data = [];

    data.push({
      Municipality: municipality,
      DateReported: dateReported,
      no: "",
      Date: "",
      Barangay: "",
      ClientFirstName: "",
      ClientLastName: "",
      ClientGender: "",
      ClientBirthday: "",
      ClientContactNo: "",
      AnimalSpecies: "",
      AnimalBreed: "",
      AnimalSex: "",
      AnimalAge: "",
      AnimalColor: "",
    });

    entries.forEach((entry) => {
      data.push({
        Municipality: "",
        DateReported: "",
        no: entry.no,
        Date: entry.date,
        Barangay: entry.barangay,
        ClientFirstName: entry.clientInfo?.firstName || "",
        ClientLastName: entry.clientInfo?.lastName || "",
        ClientGender: entry.clientInfo?.gender || "",
        ClientBirthday: entry.clientInfo?.birthday || "",
        ClientContactNo: entry.clientInfo?.contactNo || "",
        AnimalSpecies: entry.animalInfo?.species || "",
        AnimalBreed: entry.animalInfo?.breed || "",
        AnimalSex: entry.animalInfo?.sex || "",
        AnimalAge: entry.animalInfo?.age || "",
        AnimalColor: entry.animalInfo?.color || "",
        Estrus: entry.estrus,
        SireCodeNum: entry.sireCodeNum || "",
        Activity: entry.activity,
        Remarks: entry.remarks || "",
      });
    });

    const csv = Papa.unparse(data);
    const date = new Date().toISOString().split("T")[0];
    const fileName = `upgrading_report_${municipality}_${date}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedData = results.data;
        const mainFields = importedData[0];
        setMunicipality(mainFields.Municipality);
        setDateReported(mainFields.DateReported);

        const importedEntries = importedData.slice(1).map((entry, index) => ({
          no: index + 1,
          date: entry.Date,
          barangay: entry.Barangay,
          clientInfo: {
            firstName: entry.ClientFirstName,
            lastName: entry.ClientLastName,
            gender: entry.ClientGender,
            birthday: entry.ClientBirthday,
            contactNo: entry.ClientContactNo,
          },
          animalInfo: {
            species: entry.AnimalSpecies,
            breed: entry.AnimalBreed,
            sex: entry.AnimalSex,
            age: entry.AnimalAge,
            color: entry.AnimalColor,
          },
          estrus: entry.Estrus || "",
          sireCodeNum: entry.SireCodeNum || "",
          activity: entry.Activity || "",
          remarks: entry.Remarks || "",
        }));

        setEntries(importedEntries);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to import CSV file.");
      },
    });
  };

  return (
    <>
      <div className="test"></div>
      <div className="container mx-auto p-4">
        {/* Import CSV Input */}
        {/* <div className="flex justify-end mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={importCSV}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        />
      </div> */}
        <h2 className="text-2xl font-bold mb-4">Upgrading Services Report</h2>

        {/* Main fields */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="municipality" className="block mb-1">
              Municipality
            </label>
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

          {/* Main fields */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="dateReported" className="block mb-1">
                Date Reported
              </label>
              <input
                id="dateReported"
                type="date"
                value={dateReported}
                onChange={(e) => setDateReported(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>
        {/* Modal for Editing Entries */}
        {selectedEntry !== null && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">
                Edit Upgrading Service Entry {entries[selectedEntry].no}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="entryDate" className="block mb-1">
                    Date
                  </label>
                  <input
                    id="entryDate"
                    type="date"
                    value={entries[selectedEntry].date}
                    onChange={(e) =>
                      handleEntryChange(selectedEntry, "date", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="entryBarangay" className="block mb-1">
                    Barangay
                  </label>
                  <input
                    id="entryBarangay"
                    type="text"
                    value={entries[selectedEntry].barangay}
                    onChange={(e) =>
                      handleEntryChange(
                        selectedEntry,
                        "barangay",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-2">Client Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="clientFirstName" className="block mb-1">
                    First Name
                  </label>
                  <input
                    id="clientFirstName"
                    type="text"
                    value={entries[selectedEntry].clientInfo.firstName}
                    onChange={(e) =>
                      handleClientInfoChange(
                        selectedEntry,
                        "firstName",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="clientLastName" className="block mb-1">
                    Last Name
                  </label>
                  <input
                    id="clientLastName"
                    type="text"
                    value={entries[selectedEntry].clientInfo.lastName}
                    onChange={(e) =>
                      handleClientInfoChange(
                        selectedEntry,
                        "lastName",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="clientGender" className="block mb-1">
                    Gender
                  </label>
                  <input
                    id="clientGender"
                    type="text"
                    value={entries[selectedEntry].clientInfo.gender}
                    onChange={(e) =>
                      handleClientInfoChange(
                        selectedEntry,
                        "gender",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="clientBirthday" className="block mb-1">
                    Birthday
                  </label>
                  <input
                    id="clientBirthday"
                    type="date"
                    value={entries[selectedEntry].clientInfo.birthday}
                    onChange={(e) =>
                      handleClientInfoChange(
                        selectedEntry,
                        "birthday",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="clientContactNo" className="block mb-1">
                    Contact No.
                  </label>
                  <input
                    id="clientContactNo"
                    type="text"
                    value={entries[selectedEntry].clientInfo.contactNo}
                    onChange={(e) =>
                      handleClientInfoChange(
                        selectedEntry,
                        "contactNo",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-2">Animal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="animalSpecies" className="block mb-1">
                    Species/Animal
                  </label>
                  <input
                    id="animalSpecies"
                    type="text"
                    value={entries[selectedEntry].animalInfo.species}
                    onChange={(e) =>
                      handleAnimalInfoChange(
                        selectedEntry,
                        "species",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="animalSex" className="block mb-1">
                    Sex
                  </label>
                  <select
                    id="animalSex"
                    value={entries[selectedEntry].animalInfo.sex}
                    onChange={(e) =>
                      handleAnimalInfoChange(
                        selectedEntry,
                        "sex",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="" disabled>
                      Select Sex
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="animalAge" className="block mb-1">
                    Age/Age Group
                  </label>
                  <input
                    id="animalAge"
                    type="text"
                    value={entries[selectedEntry].animalInfo.age}
                    onChange={(e) =>
                      handleAnimalInfoChange(
                        selectedEntry,
                        "age",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="animalColor" className="block mb-1">
                    Color
                  </label>
                  <input
                    id="animalColor"
                    type="text"
                    value={entries[selectedEntry].animalInfo.color}
                    onChange={(e) =>
                      handleAnimalInfoChange(
                        selectedEntry,
                        "color",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="municipality" className="block mb-1">
                  Activity
                </label>
                <select
                  id="activity"
                  value={entries[selectedEntry].animalInfo.color}
                  onChange={(e) =>
                    handleEntryChange(selectedEntry, "activity", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Activity</option>
                  <option value="EstrusSynchro">Estrus Synchronization</option>
                  <option value="ArtificialInsemination">
                    Artificial Insemination
                  </option>
                  <option value="PregnancyDiagnosis">
                    Pregnancy Diagnosis
                  </option>
                  <option value="VitaminADE">
                    Vitamin ADE supplementation
                  </option>
                </select>
              </div>

              <div className="mb-3"/>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded mr-2"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
          message="Are you sure you want to remove this entry?"
        />

        <div>
          <button
            type="button"
            onClick={addEntry}
            className="mb-4 px-4 py-2 bg-darkgreen text-white rounded"
          >
            + Add Entry
          </button>
          <div className="max-h-[40vh] overflow-auto">
            {entries.map((entry, index) => (
              <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
                <h3 className="text-xl font-semibold mb-2">Entry {entry.no}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <p>Date: {entry.date || "N/A"}</p>
                  <p>Barangay: {entry.barangay || "N/A"}</p>
                  <p>
                    Client: {entry.clientInfo.firstName || "N/A"}{" "}
                    {entry.clientInfo.lastName || ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openModal(index)}
                  className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => openConfirmationModal(index)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mb-3"/>

       
        </div>
        
        <FormSubmit
          handleImportCSV={importCSV}
          handleExportCSV={exportAsCSV}
          handleSubmit={saveEntries}
        />
      </div>
      
    </>
  );
};

export default UpgradingServices;
