import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import StepperComponent from "../../component/StepperComponent";

const DiseaseInvestigationForm = () => {
  const [detailsRows, setDetailsRows] = useState([
    {
      species: "",
      sex: "",
      age: "",
      population: "",
      cases: "",
      deaths: "",
      destroyed: "",
      slaughtered: "",
      vaccineHistory: "",
      remarks: "",
    },
  ]);

  const [clinicalSignsRows, setClinicalSignsRows] = useState([
    { description: "" },
  ]);

  const [movementRows, setMovementRows] = useState([
    {
      date: "",
      mode: "",
      type: "",
      barangay: "",
      municipality: "",
      province: "",
    },
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
    farmType: [],
    propablesourceofinfection: "",
    controlmeasures: "",
    remarks: "",
    tentativediagnosis: "",
    finaldiagnosis: "",
    natureofdiagnosis: "",
  });

  // Function to add a new row to Details table
  const addDetailsRow = () => {
    setDetailsRows([
      ...detailsRows,
      {
        species: "",
        sex: "",
        age: "",
        population: "",
        cases: "",
        deaths: "",
        destroyed: "",
        slaughtered: "",
        vaccineHistory: "",
        remarks: "",
      },
    ]);
  };

  // Function to add a new row to Clinical Signs table
  const addClinicalSignsRow = () => {
    setClinicalSignsRows([...clinicalSignsRows, { description: "" }]);
  };

  // Function to add a new row to Movement table
  const addMovementRow = () => {
    setMovementRows([
      ...movementRows,
      {
        date: "",
        mode: "",
        type: "",
        barangay: "",
        municipality: "",
        province: "",
      },
    ]);
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
  const handleSave = async () => {
    try {
      // Ensure the fields are arrays of objects
      const data = {
        ...formData,
        movementRows: Array.isArray(movementRows) ? movementRows : [],
        detailsRows: Array.isArray(detailsRows) ? detailsRows : [],
        clinicalSignsRows: Array.isArray(clinicalSignsRows)
          ? clinicalSignsRows
          : [],
      };

      console.log(data);
      // Send data to backend API
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/disease-investigation`,
        data
      );

      // Handle successful response
      if (response.status === 201) {
        alert("Form saved successfully!");
      } else {
        alert("Failed to save the form. Please try again.");
      }
    } catch (error) {
      console.error("Error saving the form:", error);
      alert("An error occurred while saving the form.");
    }
  };

  // Function to export form data to CSV
  const exportToCSV = () => {
    const csvRows = [];

    // Header row
    csvRows.push(
      [
        "Status",
        "No. of Visit",
        "Date Reported",
        "Date of Visit",
        "Investigator",
        "Place Affected",
        "Latitude",
        "Longitude",
        "Farmer's Name",
        "Farm Type",
        "Probable Source of Infection",
        "Control Measures",
        "Remarks",
        "Tentative Diagnosis",
        "Final Diagnosis",
        "Nature of Diagnosis",
        "Details - Species",
        "Details - Sex",
        "Details - Age",
        "Details - Population",
        "Details - Cases",
        "Details - Deaths",
        "Details - Destroyed",
        "Details - Slaughtered",
        "Details - Vaccination History",
        "Details - Remarks",
        "Clinical Signs - Description",
        "Movement - Date",
        "Movement - Mode",
        "Movement - Type",
        "Movement - Barangay",
        "Movement - Municipality",
        "Movement - Province",
      ].join(",")
    );

    // Find the maximum row count
    const rowCount = Math.max(
      formData.farmType.length,
      detailsRows.length,
      clinicalSignsRows.length,
      movementRows.length
    );

    // Add data rows
    for (let i = 0; i < rowCount; i++) {
      const details = detailsRows[i] || {};
      const clinicalSigns = clinicalSignsRows[i] || {};
      const movement = movementRows[i] || {};

      csvRows.push(
        [
          formData.status || "",
          formData.noOfVisit || "",
          formData.dateReported || "",
          formData.dateOfVisit || "",
          formData.investigator || "",
          formData.placeAffected || "",
          formData.latitude || "",
          formData.longitude || "",
          formData.farmerName || "",
          formData.farmType[i] || "", // Ensure we access farmType by index
          formData.propablesourceofinfection || "",
          formData.controlmeasures || "",
          formData.remarks || "",
          formData.tentativediagnosis || "",
          formData.finaldiagnosis || "",
          formData.natureofdiagnosis || "",
          details.species || "",
          details.sex || "",
          details.age || "",
          details.population || "",
          details.cases || "",
          details.deaths || "",
          details.destroyed || "",
          details.slaughtered || "",
          details.vaccineHistory || "",
          details.remarks || "",
          clinicalSigns.description || "",
          movement.date || "",
          movement.mode || "",
          movement.type || "",
          movement.barangay || "",
          movement.municipality || "",
          movement.province || "",
        ].join(",")
      );
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
              propablesourceofinfection:
                firstRow["Probable Source of Infection"] || "",
              controlmeasures: firstRow["Control Measures"] || "",
              remarks: firstRow["Remarks"] || "",
              tentativediagnosis: firstRow["Tentative Diagnosis"] || "",
              finaldiagnosis: firstRow["Final Diagnosis"] || "",
              natureofdiagnosis: firstRow["Nature of Diagnosis"] || "",
              farmType: firstRow["Farm Type"]
                ? firstRow["Farm Type"].split(";")
                : [],
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
                  population: row["Details - Population"] || "",
                  cases: row["Details - Cases"] || "",
                  deaths: row["Details - Deaths"] || "",
                  destroyed: row["Details - Destroyed"] || "",
                  slaughtered: row["Details - Slaughtered"] || "",
                  vaccineHistory: row["Details - Vaccination History"] || "",
                  remarks: row["Details - Remarks"] || "",
                });
              }

              // Push clinical signs rows
              if (row["Clinical Signs - Description"]) {
                newClinicalSignsRows.push({
                  description: row["Clinical Signs - Description"] || "",
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
                  province: row["Movement - Province"] || "",
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
        },
      });
    }
  };

  var pages =[
    (<div className="border p-4 rounded-lg mb-6 shadow-md bg-white overflow-y-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-2 font-medium">Status:</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="new"
              checked={formData.status === "new"}
              onChange={handleFormChange}
              className="mr-2"
            />{" "}
            New
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="on-going"
              checked={formData.status === "on-going"}
              onChange={handleFormChange}
              className="mr-2"
            />{" "}
            On-going
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">No. of Visit:</label>
        <input
          type="number"
          name="noOfVisit"
          value={formData.noOfVisit}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Date Reported:</label>
        <input
          type="date"
          name="dateReported"
          value={formData.dateReported}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Date of Visit:</label>
        <input
          type="date"
          name="dateOfVisit"
          value={formData.dateOfVisit}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Investigator:</label>
        <input
          type="text"
          name="investigator"
          value={formData.investigator}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Place Affected:
        </label>
        <input
          type="text"
          name="placeAffected"
          value={formData.placeAffected}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Latitude:</label>
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Longitude:</label>
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Farmer's Name:</label>
        <input
          type="text"
          name="farmerName"
          value={formData.farmerName}
          className="border w-full p-2 rounded"
          onChange={handleFormChange}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Farm Type:</label>
        <select
          name="farmType"
          value={formData.farmType}
          className="border w-full p-2 rounded"
          onChange={(e) =>
            setFormData({ ...formData, farmType: [e.target.value] })
          }
        >
          <option value="" disabled>
            Select farm type
          </option>
          <option value="Backyard farm">Backyard farm</option>
          <option value="Commercial farm">Commercial farm</option>
          <option value="Semi commercial">Semi commercial</option>
          <option value="Holding yard">Holding yard</option>
          <option value="Slaughter house">Slaughter house</option>
          <option value="Auction market">Auction market</option>
          <option value="Stockyard">Stockyard</option>
          <option value="Others">Others</option>
        </select>
        {formData.farmType.includes("Others") && (
          <input
            type="text"
            name="customFarmType"
            placeholder="Please specify"
            className="border w-full p-2 mt-2 rounded"
            onChange={(e) =>
              setFormData({ ...formData, farmType: [e.target.value] })
            }
          />
        )}
      </div>
    </div>
  </div>),
    (          <div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
    {/* Investigation Details */}
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Details of Investigation
      </h2>
      {detailsRows.map((row, index) => (
        <div key={index} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "species",
              "sex",
              "age",
              "population",
              "cases",
              "deaths",
              "destroyed",
              "slaughtered",
              "vaccineHistory",
              "remarks",
            ].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="block mb-2 font-medium capitalize text-gray-700">
                  {field}:
                </label>
                <input
                  type="text"
                  value={row[field]}
                  onChange={(e) =>
                    handleDetailsChange(index, field, e.target.value)
                  }
                  className="border w-full p-2 rounded focus:ring-2 focus:ring-darkgreen"
                />
              </div>
            ))}
          </div>
          <div className="my-4">
            <hr className="border-t border-gray-300" /> {/* Divider */}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addDetailsRow}
        className="mt-6 bg-darkgreen text-white py-2 px-4 rounded-lg hover:bg-darkergreen transition ease-in-out duration-200"
      >
        Add Details Row
      </button>
    </div>
  </div>),
  (          <div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
  {/* Clinical Signs */}
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
      Clinical Signs
    </h2>
    {clinicalSignsRows.map((row, index) => (
      <div key={index} className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Description:
        </label>
        <input
          type="text"
          value={row.description}
          onChange={(e) =>
            handleClinicalSignsChange(index, e.target.value)
          }
          className="border w-full p-2 rounded focus:ring-2 focus:ring-darkgreen"
        />
        <div className="my-4">
          <hr className="border-t border-gray-300" /> {/* Divider */}
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={addClinicalSignsRow}
      className="mt-6 bg-darkgreen text-white py-2 px-4 rounded-lg hover:bg-darkergreen transition ease-in-out duration-200"
    >
      Add Clinical Signs Row
    </button>
  </div>

  {/* Movement */}
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
      Movement
    </h2>
    {movementRows.map((row, index) => (
      <div key={index} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "date",
            "mode",
            "type",
            "barangay",
            "municipality",
            "province",
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="block mb-2 font-medium capitalize text-gray-700">
                {field}:
              </label>
              <input
                type={field === "date" ? "date" : "text"} // Change type to "date" for the date field
                value={row[field]}
                onChange={(e) =>
                  handleMovementChange(index, field, e.target.value)
                }
                className="border w-full p-2 rounded focus:ring-2 focus:ring-darkgreen"
              />
            </div>
          ))}
        </div>
        <div className="my-4">
          <hr className="border-t border-gray-300" /> {/* Divider */}
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={addMovementRow}
      className="mt-6 bg-darkgreen text-white py-2 px-4 rounded-lg hover:bg-darkergreen transition ease-in-out duration-200"
    >
      Add Movement Row
    </button>
  </div>
</div>),
(<div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
<div>
  <label className="block mb-2 font-medium">
    Probable Source of Infection:
  </label>
  <select
    name="propablesourceofinfection"
    value={formData.propablesourceofinfection}
    className="border w-full p-2 rounded"
    onChange={handleFormChange}
  >
    <option value="" disabled>
      Select probable source of infection
    </option>
    <option value="Unknown or inconclusive">
      Unknown or inconclusive
    </option>
    <option value="Swill Feeding">Swill Feeding</option>
    <option value="Introduction of new animals">
      Introduction of new animals
    </option>
    <option value="Fomites (humans, vehicles, feed, etc.)">
      Fomites (humans, vehicles, feed, etc.)
    </option>
    <option value="Contact with infected animal">
      Contact with infected animal
    </option>
    <option value="Vectors (flies, insects, rodents, etc.)">
      Vectors (flies, insects, rodents, etc.)
    </option>
  </select>
</div>

<div>
  <label className="block mb-2 font-medium">
    Control Measures:
  </label>
  <select
    name="controlmeasures"
    value={formData.controlmeasures}
    className="border w-full p-2 rounded"
    onChange={handleFormChange}
  >
    <option value="" disabled>
      Select control measures
    </option>
    <option value="No Control Measures">No Control Measures</option>
    <option value="Quarantine/Movement Control">
      Quarantine/Movement Control
    </option>
    <option value="Vaccine in response to outbreak">
      Vaccine in response to outbreak
    </option>
    <option value="Disinfection of infected premises">
      Disinfection of infected premises
    </option>
    <option value="Stamping out">Stamping out</option>
    <option value="Modified stamping out">
      Modified stamping out
    </option>
    <option value="Control of vectors">Control of vectors</option>
  </select>
</div>

<div>
  <label className="block mb-2 font-medium">Remarks:</label>
  <input
    type="text"
    name="remarks"
    value={formData.remarks}
    className="border w-full p-2 rounded"
    onChange={handleFormChange}
  />
</div>

<div>
  <label className="block mb-2 font-medium">
    Tentative Diagnosis:
  </label>
  <input
    type="text"
    name="tentativediagnosis"
    value={formData.tentativediagnosis}
    className="border w-full p-2 rounded"
    onChange={handleFormChange}
  />
</div>

<div>
  <label className="block mb-2 font-medium">Final Diagnosis:</label>
  <input
    type="text"
    name="finaldiagnosis"
    value={formData.finaldiagnosis}
    className="border w-full p-2 rounded"
    onChange={handleFormChange}
  />
</div>
<div>
  <label className="block mb-2 font-medium">
    Nature of Diagnosis:
  </label>
  <select
    name="natureofdiagnosis"
    value={formData.natureofdiagnosis}
    className="border w-full p-2 rounded"
    onChange={handleFormChange}
  >
    <option value="" disabled>
      Select nature of diagnosis
    </option>
    <option value="Farmer's Report">Farmer's Report</option>
    <option value="Clinical Signs/lesions">
      Clinical Signs/lesions
    </option>
    <option value="History">History</option>
    <option value="Laboratory test">Laboratory test</option>
  </select>
</div>
</div>),
  ]

  function renderStepContent(step) {
    switch (step) {
      case 0:
        return (
          pages[0]
        );
      case 1:
        return (
          pages[1]
        );
      case 2:
        return (
          pages[2]
        );
      case 3:
        return (
          pages[3]
        );
    }
  }
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Disease Investigation Form</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="mb-6"
      />
      <StepperComponent pages={pages} renderStepContent={renderStepContent} />

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          className="bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen"
        >
          Save Form
        </button>
        <button
          onClick={exportToCSV}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default DiseaseInvestigationForm;
