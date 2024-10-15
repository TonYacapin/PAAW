import React, { useState } from 'react';
import StepperComponent from '../../component/StepperComponent';
import FormSubmit from '../../component/FormSubmit';
import Papa from 'papaparse';
import axios from "axios";

const VeterinaryShipmentForm = () => {
  const [shipmentType, setShipmentType] = useState('');
  const [shipperName, setShipperName] = useState('');
  const [date, setDate] = useState('');
  const [pointOfOrigin, setPointOfOrigin] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [liveAnimals, setLiveAnimals] = useState({
    Carabao: 0,
    Cattle: 0,
    Swine: 0,
    Horse: 0,
    Chicken: 0,
    Duck: 0,
    Other: 0,
  });

  const [animalByProducts, setAnimalByProducts] = useState({
    Beef: 0,
    Carabeef: 0,
    Pork: 0,
    PoultryMeat: 0,
    Egg: 0,
    ChickenDung: 0,
  });

  const handleLiveAnimalChange = (e) => {
    setLiveAnimals({ ...liveAnimals, [e.target.name]: e.target.value });
  };

  const handleAnimalByProductChange = (e) => {
    setAnimalByProducts({ ...animalByProducts, [e.target.name]: e.target.value });
  };

  // CSV Export function
  const handleExportCSV = () => {
    const data = [
      { 
        shipmentType, shipperName, date, pointOfOrigin, remarks, 
        ...liveAnimals, ...animalByProducts 
      }
    ];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'veterinary_shipment_form.csv');
    link.click();
  };

  // CSV Import function
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedData = results.data[0];  // Assuming only one row of data for now
        setShipmentType(importedData.shipmentType || '');
        setShipperName(importedData.shipperName || '');
        setDate(importedData.date || '');
        setPointOfOrigin(importedData.pointOfOrigin || '');
        setRemarks(importedData.remarks || '');
        setLiveAnimals({
          Carabao: importedData.Carabao || 0,
          Cattle: importedData.Cattle || 0,
          Swine: importedData.Swine || 0,
          Horse: importedData.Horse || 0,
          Chicken: importedData.Chicken || 0,
          Duck: importedData.Duck || 0,
          Other: importedData.Other || 0,
        });
        setAnimalByProducts({
          Beef: importedData.Beef || 0,
          Carabeef: importedData.Carabeef || 0,
          Pork: importedData.Pork || 0,
          PoultryMeat: importedData.PoultryMeat || 0,
          Egg: importedData.Egg || 0,
          ChickenDung: importedData.ChickenDung || 0,
        });
      },
    });
  };

  // Form Submit function
  // Form Submit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Prepare the data to send
  const data = {
    shipmentType,
    shipperName,
    date,
    pointOfOrigin,
    remarks,
    liveAnimals,
    animalByProducts,
  };

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/vetshipform`, // Your API endpoint
      data
    );

    // Handle the response
    if (response.status === 201) { // Assuming 201 is the success status code
      setSuccess("Veterinary shipment report successfully submitted!");
      // Optionally, reset the form state after submission
      resetForm();
    } else {
      setError("Unexpected response from the server.");
    }

    console.log(response.data);
  } catch (err) {
    setError("Error submitting the report. Please try again.");
    console.error(err);
  }
};

// Function to reset the form state
const resetForm = () => {
  setShipmentType('');
  setShipperName('');
  setDate('');
  setPointOfOrigin('');
  setRemarks('');
  setLiveAnimals({
    Carabao: 0,
    Cattle: 0,
    Swine: 0,
    Horse: 0,
    Chicken: 0,
    Duck: 0,
    Other: 0,
  });
  setAnimalByProducts({
    Beef: 0,
    Carabeef: 0,
    Pork: 0,
    PoultryMeat: 0,
    Egg: 0,
    ChickenDung: 0,
  });
  setError("");
  setSuccess("");
};

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            {/* Shipment Type and Shipper's Name */}
            <fieldset className="border border-gray-300 rounded p-4">
              <legend className="font-semibold text-black">Shipment Type</legend>
              <div className="flex space-x-8">
                <div className="flex items-center">
                  <input
                    type="radio"
                    value="Outgoing"
                    checked={shipmentType === 'Outgoing'}
                    onChange={(e) => setShipmentType(e.target.value)}
                    className="mr-2 text-black border-gray-300 focus:ring-black"
                  />
                  <label className="text-black">Outgoing Shipment</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    value="Incoming"
                    checked={shipmentType === 'Incoming'}
                    onChange={(e) => setShipmentType(e.target.value)}
                    className="mr-2 text-black border-gray-300 focus:ring-black"
                  />
                  <label className="text-black">Incoming Shipment</label>
                </div>
              </div>
            </fieldset>
            <div>
              <label className="block mb-1 text-black">
                Name of Shippers:
                <input
                  type="text"
                  value={shipperName}
                  onChange={(e) => setShipperName(e.target.value)}
                  required
                  placeholder="Enter shipper's name"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>
            </div>
            <div>
              <label className="block mb-1 text-black">
                Date:
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>
            </div>
          </div>
        );
      case 1:
        return (
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="font-semibold text-black">Live Animals</legend>
            {Object.keys(liveAnimals).map((animal) => (
              <div key={animal} className="flex justify-between items-center mb-2">
                <label className="block text-black">{animal}:</label>
                <input
                  type="number"
                  name={animal}
                  value={liveAnimals[animal]}
                  onChange={handleLiveAnimalChange}
                  min="0"
                  placeholder="0"
                  className="border border-gray-300 rounded p-3 w-1/3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            ))}
          </fieldset>
        );
      case 2:
        return (
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="font-semibold text-black">Animal By Products</legend>
            {Object.keys(animalByProducts).map((product) => (
              <div key={product} className="flex justify-between items-center mb-2">
                <label className="block text-black">{product}:</label>
                <input
                  type="number"
                  name={product}
                  value={animalByProducts[product]}
                  onChange={handleAnimalByProductChange}
                  min="0"
                  placeholder="0"
                  className="border border-gray-300 rounded p-3 w-1/3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            ))}
          </fieldset>
        );
      case 3:
        return (
          <div>
            <div>
              <label className="block mb-1 text-black">
                Point of Origin:
                <input
                  type="text"
                  value={pointOfOrigin}
                  onChange={(e) => setPointOfOrigin(e.target.value)}
                  placeholder="Enter point of origin"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>
            </div>
            <div>
              <label className="block mb-1 text-black">
                Remarks:
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Additional remarks (optional)"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                  rows="4"
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-black text-center">Veterinary Shipment Form</h2>
      <StepperComponent
        pages={['Step 1', 'Step 2', 'Step 3', 'Step 4']}
        renderStepContent={renderStepContent}
      />
      <FormSubmit
        handleExportCSV={handleExportCSV}
        handleImportCSV={handleImportCSV}
        onSubmit={handleSubmit}
      />
    </form>
  );
};

export default VeterinaryShipmentForm;
