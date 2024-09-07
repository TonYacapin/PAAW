import React, { useState } from "react";
import Papa from "papaparse";

const DiseaseInvestigationForm = () => {
  const [detailsRows, setDetailsRows] = useState([
    { species: "", sex: "", age: "", popn: "", cases: "", deaths: "", destroyed: "", slaughtered: "", vaccHistory: "", remarks: "" }
  ]);

  const [clinicalSignsRows, setClinicalSignsRows] = useState([{ description: "" }]);

  const [movementRows, setMovementRows] = useState([
    { date: "", mode: "", type: "", barangay: "", municipality: "", province: "" }
  ]);

  const [formData, setFormData] = useState({
    status: "",
    noOfVisit: "",
    dateReported: "",
    dateOfVisit: "",
    investigator: "",
    placeAffected: "",
    latitude: "",
    longitude: "",
    farmerName: "",
    farmType: []
  });

  // Function to add a new row to Details table
  const addDetailsRow = () => {
    setDetailsRows([...detailsRows, { species: "", sex: "", age: "", popn: "", cases: "", deaths: "", destroyed: "", slaughtered: "", vaccHistory: "", remarks: "" }]);
  };

  // Function to add a new row to Clinical Signs table
  const addClinicalSignsRow = () => {
    setClinicalSignsRows([...clinicalSignsRows, { description: "" }]);
  };

  // Function to add a new row to Movement table
  const addMovementRow = () => {
    setMovementRows([...movementRows, { date: "", mode: "", type: "", barangay: "", municipality: "", province: "" }]);
  };

  // Function to update a specific field in the Details table
  const handleDetailsChange = (index, field, value) => {
    const updatedRows = [...detailsRows];
    updatedRows[index][field] = value;
    setDetailsRows(updatedRows);
  };

  // Function to update a specific field in the Clinical Signs table
  const handleClinicalSignsChange = (index, value) => {
    const updatedRows = [...clinicalSignsRows];
    updatedRows[index].description = value;
    setClinicalSignsRows(updatedRows);
  };

  // Function to update a specific field in the Movement table
  const handleMovementChange = (index, field, value) => {
    const updatedRows = [...movementRows];
    updatedRows[index][field] = value;
    setMovementRows(updatedRows);
  };

  // Function to update form data
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSave = () => {
    // Add your save functionality here
    alert("Form saved successfully!");
  };

  // Function to export form data to CSV
  const exportToCSV = () => {
    const csvRows = [];

    // Header row
    csvRows.push([
      "Status", "No. of Visit", "Date Reported", "Date of Visit", "Investigator", "Place Affected", "Latitude", "Longitude", "Farmer's Name", "Farm Type",
      "Details - Species", "Details - Sex", "Details - Age", "Details - Population", "Details - Cases", "Details - Deaths", "Details - Destroyed", "Details - Slaughtered", "Details - Vaccination History", "Details - Remarks",
      "Clinical Signs - Description",
      "Movement - Date", "Movement - Mode", "Movement - Type", "Movement - Barangay", "Movement - Municipality", "Movement - Province"
    ].join(","));

    // Add data rows
    const rowCount = Math.max(detailsRows.length, clinicalSignsRows.length, movementRows.length);

    for (let i = 0; i < rowCount; i++) {
      const details = detailsRows[i] || {};
      const clinicalSigns = clinicalSignsRows[i] || {};
      const movement = movementRows[i] || {};

      csvRows.push([
        formData.status,
        formData.noOfVisit,
        formData.dateReported,
        formData.dateOfVisit,
        formData.investigator,
        formData.placeAffected,
        formData.latitude,
        formData.longitude,
        formData.farmerName,
        formData.farmType.join(";"),
        details.species || "",
        details.sex || "",
        details.age || "",
        details.popn || "",
        details.cases || "",
        details.deaths || "",
        details.destroyed || "",
        details.slaughtered || "",
        details.vaccHistory || "",
        details.remarks || "",
        clinicalSigns.description || "",
        movement.date || "",
        movement.mode || "",
        movement.type || "",
        movement.barangay || "",
        movement.municipality || "",
        movement.province || ""
      ].join(","));
    }

    // Create a CSV blob and trigger download
    const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disease_investigation_form.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Use header row to define columns
        skipEmptyLines: true,
        complete: (results) => {
          const { data } = results;

          if (data.length > 0) {
            // Extract form data from the first row
            const firstRow = data[0];

            const newFormData = {
              status: firstRow["Status"] || "",
              noOfVisit: firstRow["No. of Visit"] || "",
              dateReported: firstRow["Date Reported"] || "",
              dateOfVisit: firstRow["Date of Visit"] || "",
              investigator: firstRow["Investigator"] || "",
              placeAffected: firstRow["Place Affected"] || "",
              latitude: firstRow["Latitude"] || "",
              longitude: firstRow["Longitude"] || "",
              farmerName: firstRow["Farmer's Name"] || "",
              farmType: firstRow["Farm Type"] ? firstRow["Farm Type"].split(";") : []
            };

            // Extract details, clinical signs, and movement rows
            const newDetailsRows = [];
            const newClinicalSignsRows = [];
            const newMovementRows = [];

            data.forEach((row) => {
              // Push details rows
              if (row["Details - Species"]) {
                newDetailsRows.push({
                  species: row["Details - Species"] || "",
                  sex: row["Details - Sex"] || "",
                  age: row["Details - Age"] || "",
                  popn: row["Details - Population"] || "",
                  cases: row["Details - Cases"] || "",
                  deaths: row["Details - Deaths"] || "",
                  destroyed: row["Details - Destroyed"] || "",
                  slaughtered: row["Details - Slaughtered"] || "",
                  vaccHistory: row["Details - Vaccination History"] || "",
                  remarks: row["Details - Remarks"] || ""
                });
              }

              // Push clinical signs rows
              if (row["Clinical Signs - Description"]) {
                newClinicalSignsRows.push({
                  description: row["Clinical Signs - Description"] || ""
                });
              }

              // Push movement rows
              if (row["Movement - Date"]) {
                newMovementRows.push({
                  date: row["Movement - Date"] || "",
                  mode: row["Movement - Mode"] || "",
                  type: row["Movement - Type"] || "",
                  barangay: row["Movement - Barangay"] || "",
                  municipality: row["Movement - Municipality"] || "",
                  province: row["Movement - Province"] || ""
                });
              }
            });

            // Update state with the new data
            setFormData(newFormData);
            setDetailsRows(newDetailsRows);
            setClinicalSignsRows(newClinicalSignsRows);
            setMovementRows(newMovementRows);
          } else {
            alert("CSV file is empty or invalid format.");
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          alert("Error parsing CSV file.");
        }
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Disease Investigation Form</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="mb-6"
      />

      <div className="border p-4 rounded-lg mb-6 shadow-md bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Status:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="status" value="new" checked={formData.status === "new"} onChange={handleFormChange} className="mr-2" /> New
              </label>
              <label className="flex items-center">
                <input type="radio" name="status" value="on-going" checked={formData.status === "on-going"} onChange={handleFormChange} className="mr-2" /> On-going
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">No. of Visit:</label>
            <input type="number" name="noOfVisit" value={formData.noOfVisit} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Date Reported:</label>
            <input type="date" name="dateReported" value={formData.dateReported} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Date of Visit:</label>
            <input type="date" name="dateOfVisit" value={formData.dateOfVisit} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Investigator:</label>
            <input type="text" name="investigator" value={formData.investigator} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Place Affected:</label>
            <input type="text" name="placeAffected" value={formData.placeAffected} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Latitude:</label>
            <input type="text" name="latitude" value={formData.latitude} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Longitude:</label>
            <input type="text" name="longitude" value={formData.longitude} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Farmer's Name:</label>
            <input type="text" name="farmerName" value={formData.farmerName} className="border w-full p-2 rounded" onChange={handleFormChange} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Farm Type:</label>
            <input type="text" name="farmType" value={formData.farmType.join(";")} className="border w-full p-2 rounded" onChange={(e) => setFormData({ ...formData, farmType: e.target.value.split(";") })} />
          </div>
        </div>
      </div>

      <div className="border p-4 rounded-lg mb-6 shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Details of Investigation</h2>
        {detailsRows.map((row, index) => (
          <div key={index} className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["species", "sex", "age", "popn", "cases", "deaths", "destroyed", "slaughtered", "vaccHistory", "remarks"].map(field => (
                <div key={field}>
                  <label className="block mb-2 font-medium capitalize">{field}:</label>
                  <input
                    type="text"
                    value={row[field]}
                    onChange={(e) => handleDetailsChange(index, field, e.target.value)}
                    className="border w-full p-2 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={addDetailsRow} className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Details Row</button>
      </div>

      <div className="border p-4 rounded-lg mb-6 shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Clinical Signs</h2>
        {clinicalSignsRows.map((row, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2 font-medium">Description:</label>
            <input
              type="text"
              value={row.description}
              onChange={(e) => handleClinicalSignsChange(index, e.target.value)}
              className="border w-full p-2 rounded"
            />
          </div>
        ))}
        <button type="button" onClick={addClinicalSignsRow} className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Clinical Signs Row</button>
      </div>

      <div className="border p-4 rounded-lg mb-6 shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Movement</h2>
        {movementRows.map((row, index) => (
          <div key={index} className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["date", "mode", "type", "barangay", "municipality", "province"].map(field => (
                <div key={field}>
                  <label className="block mb-2 font-medium capitalize">{field}:</label>
                  <input
                    type="text"
                    value={row[field]}
                    onChange={(e) => handleMovementChange(index, field, e.target.value)}
                    className="border w-full p-2 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={addMovementRow} className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Movement Row</button>
      </div>

      <div className="flex justify-end space-x-4">
        <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Save Form</button>
        <button onClick={exportToCSV} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">Export CSV</button>
      </div>
    </div>
  );
};

export default DiseaseInvestigationForm;
