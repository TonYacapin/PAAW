import React, { useState } from "react";
import axios from "axios"; // Import axios for HTTP requests
import ConfirmationModal from "../../component/ConfirmationModal"; // Import the ConfirmationModal component
import { Add, Save } from "@mui/icons-material";
import Papa from "papaparse";
import FormSubmit from "../../component/FormSubmit";

function RoutineServicesMonitoringReport() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [entryToRemove, setEntryToRemove] = useState(null);

  // Main fields state
  const [province, setProvince] = useState("Nueva Vizcaya");
  const [municipality, setMunicipality] = useState("");
  const [reportingPeriod, setReportingPeriod] = useState("");
  const [livestockTechnician, setLivestockTechnician] = useState("");

  const addEntry = () => {
    setEntries([
      ...entries,
      {
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
          sex: "",
          age: "",
          animalRegistered: "",
          noOfHeads: "",
        },
        activity: "",
        remark: "",
      },
    ]);
    setSelectedEntry(entries.length);
  };

  // CSV Export function
  const exportAsCSV = () => {
    const data = [];

    // Add header row
    data.push({
      Province: province,
      Municipality: municipality,
      ReportingPeriod: reportingPeriod,
      LivestockTechnician: livestockTechnician,
      No: "", // Leave blank for entries below
      Date: "",
      Barangay: "",
      FirstName: "",
      LastName: "",
      Gender: "",
      Birthday: "",
      ContactNo: "",
      Species: "",
      Sex: "",
      Age: "",
      AnimalRegistered: "",
      NoOfHeads: "",
      Activity: "",
      Remark: "",
    });

    // Add each entry row
    entries.forEach((entry, index) => {
      data.push({
        Province: "",
        Municipality: "",
        ReportingPeriod: "",
        LivestockTechnician: "",
        No: index + 1,
        Date: entry.date,
        Barangay: entry.barangay,
        FirstName: entry.clientInfo.firstName,
        LastName: entry.clientInfo.lastName,
        Gender: entry.clientInfo.gender,
        Birthday: entry.clientInfo.birthday,
        ContactNo: entry.clientInfo.contactNo,
        Species: entry.animalInfo.species,
        Sex: entry.animalInfo.sex,
        Age: entry.animalInfo.age,
        AnimalRegistered: entry.animalInfo.animalRegistered,
        NoOfHeads: entry.animalInfo.noOfHeads,
        Activity: entry.activity,
        Remark: entry.remark,
      });
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Create a file name with a naming convention
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `routine_services_monitoring_report_${municipality}_${date}.csv`;

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import function
  const importCSV = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedData = results.data;

        if (importedData.length === 0) {
          alert("No data found in the CSV file.");
          return;
        }

        // Get the first row for the main fields
        const mainFields = importedData[0];
        setProvince(mainFields.Province || "Nueva Vizcaya");
        setMunicipality(mainFields.Municipality || "");
        setReportingPeriod(mainFields.ReportingPeriod || "");
        setLivestockTechnician(mainFields.LivestockTechnician || "");

        // Get the remaining rows for the entries
        const importedEntries = importedData.slice(1).map((row) => ({
          date: row.Date || "",
          barangay: row.Barangay || "",
          clientInfo: {
            firstName: row.FirstName || "",
            lastName: row.LastName || "",
            gender: row.Gender || "",
            birthday: row.Birthday || "",
            contactNo: row.ContactNo || "",
          },
          animalInfo: {
            species: row.Species || "",
            sex: row.Sex || "",
            age: row.Age || "",
            animalRegistered: row.AnimalRegistered || "",
            noOfHeads: row.NoOfHeads || "",
          },
          activity: row.Activity || "",
          remark: row.Remark || "",
        }));

        setEntries(importedEntries);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to import CSV file.");
      },
    });
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
      // Replace with your backend API URL
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/RSM`,
        {
          province,
          municipality,
          reportingPeriod,
          livestockTechnician,
          entries,
        }
      );
      if (response.status === 201) {
        alert("Entries saved successfully");
        setEntries([]);
        setProvince("");
        setMunicipality("");
        setReportingPeriod("");
        setLivestockTechnician("");
      }
    } catch (error) {
      console.error("Error saving entries:", error);
      alert("Failed to save entries");
    }
  };
  return (
    <div className="container mx-auto p-4">
      
      <h2 className="text-2xl font-bold mb-4">
        Routine Services Monitoring Report
      </h2>

      {/* Main fields */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="province" className="block mb-1">
            Province
          </label>
          <input
            id="province"
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="border p-2 rounded w-full"
            disabled
          />
        </div>
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
          <label htmlFor="reportingPeriod" className="block mb-1">
            Reporting Period
          </label>
          <input
            id="reportingPeriod"
            type="date"
            value={reportingPeriod}
            onChange={(e) => setReportingPeriod(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="livestockTechnician" className="block mb-1">
            Livestock Technician
          </label>
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
          className="mb-4 px-4 py-2 bg-darkgreen text-white rounded"
        >
          <Add /> Add Entry
        </button>

        {entries.map((entry, index) => (
          <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">Entry {index + 1}</h3>
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

      <FormSubmit
        handleExportCSV={exportAsCSV}
        handleImportCSV={importCSV}
        handleSubmit={saveEntries}
      />
      
      {/* Modal for Editing Entries */}
      {selectedEntry !== null && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              Edit Routine Service Entry {selectedEntry + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="block mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={entries[selectedEntry].date}
                  onChange={(e) =>
                    handleEntryChange(selectedEntry, "date", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="barangay" className="block mb-1">
                  Barangay
                </label>
                <input
                  id="barangay"
                  type="text"
                  value={entries[selectedEntry].barangay}
                  onChange={(e) =>
                    handleEntryChange(selectedEntry, "barangay", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
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
                <label htmlFor="lastName" className="block mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
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
                <label htmlFor="gender" className="block mb-1">
                  Gender
                </label>
                <input
                  id="gender"
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
                <label htmlFor="birthday" className="block mb-1">
                  Birthday
                </label>
                <input
                  id="birthday"
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
                <label htmlFor="contactNo" className="block mb-1">
                  Contact No.
                </label>
                <input
                  id="contactNo"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="species" className="block mb-1">
                  Species/Animal
                </label>
                <select
                  name="species"
                  value={entries[selectedEntry].animalInfo.species}
                  className="border w-full p-2 rounded"
                  id="species"
                  onChange={(e) =>
                    handleAnimalInfoChange(
                      selectedEntry,
                      "species",
                      e.target.value
                    )
                  }
                >
                  <option value="" disabled>
                    Select Species
                  </option>
                  <option value="Swine">Swine</option>
                  <option value="Goat">Goat</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Duck">Duck</option>
                  <option value="Carabao">Carabao</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>
              {/* <div>
                <label htmlFor="species" className="block mb-1">
                  Species/Animal
                </label>
                <input
                  id="species"
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
              </div> */}
              <div>
                <label htmlFor="sex" className="block mb-1">
                  Sex
                </label>
                <select
                  name="sex"
                  id="sex"
                  value={entries[selectedEntry].animalInfo.sex}
                  className="border w-full p-2 rounded"
                  onChange={(e) =>
                    handleAnimalInfoChange(selectedEntry, "sex", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select Sex
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {/* <div>
                <label htmlFor="sex" className="block mb-1">
                  Sex
                </label>
                <input
                  id="sex"
                  type="text"
                  value={entries[selectedEntry].animalInfo.sex}
                  onChange={(e) =>
                    handleAnimalInfoChange(selectedEntry, "sex", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </div> */}
              <div>
                <label htmlFor="age" className="block mb-1">
                  Age/Age Group
                </label>
                <input
                  id="age"
                  type="text"
                  value={entries[selectedEntry].animalInfo.age}
                  onChange={(e) =>
                    handleAnimalInfoChange(selectedEntry, "age", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="animalRegistered" className="block mb-1">
                  Animal Registered
                </label>
                <input
                  id="animalRegistered"
                  type="text"
                  value={entries[selectedEntry].animalInfo.animalRegistered}
                  onChange={(e) =>
                    handleAnimalInfoChange(
                      selectedEntry,
                      "animalRegistered",
                      e.target.value
                    )
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="noOfHeads" className="block mb-1">
                  No. of Heads
                </label>
                <input
                  id="noOfHeads"
                  type="text"
                  value={entries[selectedEntry].animalInfo.noOfHeads}
                  onChange={(e) =>
                    handleAnimalInfoChange(
                      selectedEntry,
                      "noOfHeads",
                      e.target.value
                    )
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">Activity and Remark</h4>
            <div>
              <label htmlFor="activity" className="block mb-1">
                Activity
              </label>
              <select
                id="activity"
                value={entries[selectedEntry].activity}
                onChange={(e) =>
                  handleEntryChange(selectedEntry, "activity", e.target.value)
                }
                className="border p-2 rounded w-full mb-4"
              >
                <option value="Deworming">Deworming</option>
                <option value="Wound Treatment">Wound Treatment</option>
                <option value="Vitamin Supplementation">
                  Vitamin Supplementation
                </option>
                <option value="Iron Supplementation">
                  Iron Supplementation
                </option>
                <option value="Consultation">Consultation</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label htmlFor="remark" className="block mb-1">
                Remark
              </label>
              <textarea
                id="remark"
                value={entries[selectedEntry].remark}
                onChange={(e) =>
                  handleEntryChange(selectedEntry, "remark", e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded mr-2"
              >
                Cancel
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
