import React, { useState } from "react";
import StepperComponent from "../../component/StepperComponent";
import FormSubmit from "../../component/FormSubmit";
import Papa from "papaparse";
import axiosInstance from "../../component/axiosInstance";
import CardBox from "../../component/CardBox";
import ErrorModal from "../../component/ErrorModal";
import SuccessModal from "../../component/SuccessModal";
import { set } from "date-fns";

const VeterinaryShipmentForm = () => {
  const [shipmentType, setShipmentType] = useState("");
  const [shipperName, setShipperName] = useState("");
  const [date, setDate] = useState("");
  const [pointOfOrigin, setPointOfOrigin] = useState("");
  const [remarks, setRemarks] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  

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
    setAnimalByProducts({
      ...animalByProducts,
      [e.target.name]: e.target.value,
    });
  };

  // CSV Export function
  const handleExportCSV = () => {
    const data = [
      {
        shipmentType,
        shipperName,
        date,
        pointOfOrigin,
        remarks,
        ...liveAnimals,
        ...animalByProducts,
      },
    ];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "veterinary_shipment_form.csv");
    link.click();
  };

  // CSV Import function
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedData = results.data[0]; // Assuming only one row of data for now
        setShipmentType(importedData.shipmentType || "");
        setShipperName(importedData.shipperName || "");
        setDate(importedData.date || "");
        setPointOfOrigin(importedData.pointOfOrigin || "");
        setRemarks(importedData.remarks || "");
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
      const response = await axiosInstance.post(
        `/api/vetshipform`, // Your API endpoint
        data
      );

      // Handle the response
      if (response.status === 201) {
        // Assuming 201 is the success status code
        setSuccess("Veterinary shipment report successfully submitted!");
        setIsSuccessModalOpen(true);
        // Optionally, reset the form state after submission
        resetForm();
        handleExportCSV()
      } else {
        setError("Unexpected response from the server.");
      }

      console.log(response.data);
    } catch (err) {
      setError("Error submitting the report. Please try again.");
      setIsErrorModalOpen(true);
      console.error(err);
    }
  };

  // Function to reset the form state
  const resetForm = () => {
    setShipmentType("");
    setShipperName("");
    setDate("");
    setPointOfOrigin("");
    setRemarks("");
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
          <CardBox>
            <div className="grid md:grid-cols-1 lg:grid-cols-2">
              {/* Shipment Type and Shipper's Name */}
              <div>
                <label className="block mb-1 text-black font-bold">
                  Shipment Type
                </label>
                <div className="flex space-x-8">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      value="Outgoing"
                      checked={shipmentType === "Outgoing"}
                      onChange={(e) => setShipmentType(e.target.value)}
                      className="mr-2 text-black border-gray-300 focus:ring-black"
                    />
                    <label className="text-black">Outgoing Shipment</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      value="Incoming"
                      checked={shipmentType === "Incoming"}
                      onChange={(e) => setShipmentType(e.target.value)}
                      className="mr-2 text-black border-gray-300 focus:ring-black"
                    />
                    <label className="text-black">Incoming Shipment</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-black font-bold">
                  Name of Shippers:
                </label>
                <input
                  type="text"
                  value={shipperName}
                  onChange={(e) => setShipperName(e.target.value)}
                  required
                  placeholder="Enter shipper's name"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block mb-1 text-black font-bold">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </CardBox>
        );
      case 1:
        return (
          <CardBox>
            <label className="text-lg font-bold mb-6 text-black">
              Live Animals
            </label>
            {Object.keys(liveAnimals).map((animal) => (
              <div
                key={animal}
                className="flex justify-between items-center mb-2"
              >
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
          </CardBox>
        );
      case 2:
        return (
          <CardBox>
            <label className="text-lg font-bold mb-6 text-black">
              Animal By Products
            </label>
            {Object.keys(animalByProducts).map((product) => (
              <div
                key={product}
                className="flex justify-between items-center mb-2"
              >
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
          </CardBox>
        );
      case 3:
        return (
          <CardBox>
            <div>
              <label className="block mb-1 text-black font-bold">
                Point of Origin:

              </label>
              <input
                  type="text"
                  value={pointOfOrigin}
                  onChange={(e) => setPointOfOrigin(e.target.value)}
                  placeholder="Enter point of origin"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>
            <div>
              <label className="block mb-1 text-black  font-bold">
                Remarks:
              </label>
              <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Additional remarks (optional)"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                  rows="4"
                />
            </div>
            </CardBox>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg space-y-6"
    >
      {/* {success && <div className="text-green-600">{setSuccess}</div>}
      {error && <div className="text-red-600">{setError}</div>} */}

      <h2 className="text-2xl font-bold text-black text-left">
        Veterinary Shipment Form
      </h2>
      <StepperComponent
        pages={["Step 1", "Step 2", "Step 3", "Step 4"]}
        renderStepContent={renderStepContent}
      />
      <FormSubmit
        handleExportCSV={handleExportCSV}
        handleImportCSV={handleImportCSV}
        onSubmit={handleSubmit}
      />
    </form>
    <ErrorModal onClose={()=> setIsErrorModalOpen(false)} isOpen={isErrorModalOpen} message={error} />
      <SuccessModal onClose={()=> setIsSuccessModalOpen(false)} isOpen={isSuccessModalOpen} message={success} />
      </>
  );
};

export default VeterinaryShipmentForm;
