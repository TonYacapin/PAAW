import React, { useState } from "react";
import axiosInstance from "../../component/axiosInstance";
import ConfirmationModal from "../../component/ConfirmationModal"; // Import the ConfirmationModal component
import Papa from "papaparse"; // Import PapaParse for CSV handling
import FormSubmit from "../../component/FormSubmit";
import ErrorModal from "../../component/ErrorModal";
import SuccessModal from "../../component/SuccessModal";
import CardBox from "../../component/CardBox";
import BarangayDropDown from "../../component/BarangayDropDown";

function RabiesVaccinationReport() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [entryToRemove, setEntryToRemove] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  // Error modal state
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Main fields state
  const [municipality, setMunicipality] = useState("");
  const [dateReported, setDateReported] = useState("");
  const [vaccineUsed, setVaccineUsed] = useState("");
  const [batchLotNo, setBatchLotNo] = useState("");
  const [vaccineSource, setVaccineSource] = useState("");

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
          name: "",
          species: "",
          sex: "",
          age: "",
          color: "",
        },
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
      // Remove the entry
      const newEntries = entries.filter((_, i) => i !== entryToRemove);

      // Update entry numbers
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
    setErrorModalOpen(false);
    setIsSuccessModalOpen(false);

    try {
      console.log(entries);
      const response = await axiosInstance.post(`/api/entries`, {
        municipality,
        dateReported,
        vaccineUsed,
        batchLotNo,
        vaccineSource,
        entries,
      });
      if (response.status === 201) {
        setEntries([]);
        setMunicipality("");
        setDateReported("");
        setVaccineUsed("");
        setBatchLotNo("");
        setVaccineSource("");

        setSuccessMessage("Entries saved successfully"); // New state for success message
        setIsSuccessModalOpen(true); // Show success modal
        exportAsCSV();
      }
    } catch (error) {
      console.error("Error saving entries:", error);
      // Set the error message and open the modal

      // Error handling
      let errorMessage = "Failed to save entries: An unexpected error occurred";
      if (error.response && error.response.data) {
        const serverMessage =
          error.response.data.message || "An error occurred";
        if (error.response.data.errors) {
          const validationErrors = error.response.data.errors
            .map((err) => err.msg)
            .join(", ");
          errorMessage = `Failed to save entries: ${serverMessage}. Details: ${validationErrors}`;
        } else {
          errorMessage = `Failed to save entries: ${serverMessage}`;
        }
      }
      setErrorMessage(errorMessage);
      setErrorModalOpen(true);
    }
  };

  const exportAsCSV = () => {
    // Create an array to hold all the data
    const data = [];

    // Add the header row with main information
    data.push({
      Municipality: municipality,
      DateReported: dateReported,
      VaccineUsed: vaccineUsed,
      BatchLotNo: batchLotNo,
      VaccineSource: vaccineSource,
      no: "",
      Date: "",
      Barangay: "",
      ClientFirstName: "",
      ClientLastName: "",
      ClientGender: "",
      ClientBirthday: "",
      ClientContactNo: "",
      AnimalName: "",
      AnimalSpecies: "",
      AnimalSex: "",
      AnimalAge: "",
      AnimalColor: "",
    });

    // Add each entry as a new row
    entries.forEach((entry) => {
      data.push({
        Municipality: "",
        DateReported: "",
        VaccineUsed: "",
        BatchLotNo: "",
        VaccineSource: "",
        no: entry.no,
        Date: entry.date,
        Barangay: entry.barangay,
        ClientFirstName: entry.clientInfo?.firstName || "",
        ClientLastName: entry.clientInfo?.lastName || "",
        ClientGender: entry.clientInfo?.gender || "",
        ClientBirthday: entry.clientInfo?.birthday || "",
        ClientContactNo: entry.clientInfo?.contactNo || "",
        AnimalName: entry.animalInfo?.name || "",
        AnimalSpecies: entry.animalInfo?.species || "",
        AnimalSex: entry.animalInfo?.sex || "",
        AnimalAge: entry.animalInfo?.age || "",
        AnimalColor: entry.animalInfo?.color || "",
      });
    });

    console.log("Data before CSV conversion:", data);

    // Convert data to CSV using Papa.unparse()
    const csv = Papa.unparse(data);
    console.log("Generated CSV:", csv);

    // Create a file name with a naming convention
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `rabies_vaccination_report_${municipality}_${date}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to import CSV
  const importCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedData = results.data;

        // Separate the main fields from the entries
        const mainFields = importedData[0];
        setMunicipality(mainFields.Municipality);
        setDateReported(mainFields.DateReported);
        setVaccineUsed(mainFields.VaccineUsed);
        setBatchLotNo(mainFields.BatchLotNo);
        setVaccineSource(mainFields.VaccineSource);

        // Filter out entries and set them properly
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
            name: entry.AnimalName,
            species: entry.AnimalSpecies,
            sex: entry.AnimalSex,
            age: entry.AnimalAge,
            color: entry.AnimalColor,
          },
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
      <h2 className="text-2xl font-bold mb-4">Rabies Vaccination Report</h2>

      <CardBox>
        {/* Main fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div>
            <label htmlFor="vaccineUsed" className="block mb-1">
              Vaccine Used
            </label>
            <input
              id="vaccineUsed"
              type="text"
              value={vaccineUsed}
              onChange={(e) => setVaccineUsed(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="batchLotNo" className="block mb-1">
              Batch/Lot No.
            </label>
            <input
              id="batchLotNo"
              type="text"
              value={batchLotNo}
              onChange={(e) => setBatchLotNo(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="vaccineSource" className="block mb-1">
              Vaccine Source
            </label>
            <input
              id="vaccineSource"
              type="text"
              value={vaccineSource}
              onChange={(e) => setVaccineSource(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </CardBox>

      {/* Entries section */}
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
            <CardBox key={index}>
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
            </CardBox>
          ))}
        </div>
        <div className="mb-3" />
      </div>

      <FormSubmit
        handleImportCSV={importCSV}
        handleExportCSV={exportAsCSV}
        handleSubmit={saveEntries}
      />
      {/* Save Entries Button
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={saveEntries}
          className="px-4 py-2 bg-darkgreen text-white rounded"
        >
          Save Entries
        </button>
      </div>

      Export as CSV Button
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={exportAsCSV}
          className="px-4 py-2 bg-darkgreen text-white rounded"
        >
          Export as CSV
        </button>
      </div> */}

      {/* Modal for Editing Entries */}
      {selectedEntry !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-auto">
            <h3 className="text-2xl font-bold mb-4">
              Edit Rabies Vaccination Entry {entries[selectedEntry].no}
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
                <BarangayDropDown
                  municipality={municipality}
                  onChange={(e) =>
                    handleEntryChange(selectedEntry, "barangay", e.target.value)
                  }
                />
              </div>
              {/* <div>
                <label htmlFor="entryBarangay" className="block mb-1">
                  Barangay
                </label>
                <input
                  id="entryBarangay"
                  type="text"
                  value={entries[selectedEntry].barangay}
                  onChange={(e) =>
                    handleEntryChange(selectedEntry, "barangay", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </div> */}
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
              {/* <div>
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
              </div> */}
              <div>
                <label htmlFor="clientGender" className="block mb-1">
                Gender
                </label>
                <select
                  id="clientGender"
                  value={entries[selectedEntry].clientInfo.gender}
                  onChange={(e) =>
                    handleClientInfoChange(
                      selectedEntry,
                      "gender",
                      e.target.value
                    )
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
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
                <label htmlFor="animalName" className="block mb-1">
                  Name
                </label>
                <input
                  id="animalName"
                  type="text"
                  value={entries[selectedEntry].animalInfo.name}
                  onChange={(e) =>
                    handleAnimalInfoChange(
                      selectedEntry,
                      "name",
                      e.target.value
                    )
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
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
                    handleAnimalInfoChange(selectedEntry, "sex", e.target.value)
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
                    handleAnimalInfoChange(selectedEntry, "age", e.target.value)
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

      {/* Error Modal */}
      {errorModalOpen && (
        <ErrorModal
          isOpen={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          message={errorMessage}
        />
      )}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          message={successMessage}
        />
      )}
    </div>
  );
}

export default RabiesVaccinationReport;
