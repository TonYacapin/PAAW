import React, { useState } from "react";
import StepperComponent from "../../component/StepperComponent";
import FormSubmit from "../../component/FormSubmit";
import Papa from "papaparse";
import CardBox from "../../component/CardBox";
import axiosInstance from "../../component/axiosInstance";

function RegulatoryCareServices() {
  const [clientInfo, setClientInfo] = useState({
    name: "",
    address: "",
    barangay: "",
    municipality: "",
    province: "",
    birthday: "",
    gender: "",
    contact: "",
  });

  const [regulatoryService, setRegulatoryService] = useState({
    animalsToBeShipped: "",
    noOfHeads: "",
    purpose: "",
    ownerFarmName: "",
    transportCarrierName: "",
    vehiclePlateNumber: "",
    origin: "",
    destination: "",
    loadingDate: "",
    otherServices: [""],
  });

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;

    if (section === "clientInfo") {
      setClientInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (section === "regulatoryService") {
      setRegulatoryService((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOtherServiceChange = (index, value) => {
    setRegulatoryService((prev) => {
      const newServices = [...prev.otherServices];
      newServices[index] = value;
      return {
        ...prev,
        otherServices: newServices,
      };
    });
  };

  const addOtherService = () => {
    setRegulatoryService((prev) => ({
      ...prev,
      otherServices: [...prev.otherServices, ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      clientInfo,
      regulatoryService,
    };
  
    try {
      const response = await axiosInstance.post("/api/regulatory-services", formData);
      console.log("Response from API:", response.data);
      
      // Clear the form data upon successful submission
      setClientInfo({
        name: "",
        address: "",
        barangay: "",
        municipality: "",
        province: "",
        birthday: "",
        gender: "",
        contact: "",
      });
  
      setRegulatoryService({
        serviceType: "",
        complianceDate: "",
        remarks: "",
        animalsToBeShipped: "",
        noOfHeads: "",
        purpose: "",
        ownerFarmName: "",
        transportCarrierName: "",
        vehiclePlateNumber: "",
        origin: "",
        destination: "",
        loadingDate: "",
        otherServices: [""],
      });
      
      // Optionally provide feedback to the user (e.g., a success message)
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      // Handle error (e.g., show a notification)
    }
  };
  
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data[0];

        setClientInfo({
          name: data.name || "",
          address: data.address || "",
          barangay: data.barangay || "",
          municipality: data.municipality || "",
          province: data.province || "",
          birthday: data.birthday || "",
          gender: data.gender || "",
          contact: data.contact || "",
        });

        setRegulatoryService({
          serviceType: data.serviceType || "",
          complianceDate: data.complianceDate || "",
          remarks: data.remarks || "",
          animalsToBeShipped: data.animalsToBeShipped || "",
          noOfHeads: data.noOfHeads || "",
          purpose: data.purpose || "",
          ownerFarmName: data.ownerFarmName || "",
          transportCarrierName: data.transportCarrierName || "",
          vehiclePlateNumber: data.vehiclePlateNumber || "",
          origin: data.origin || "",
          destination: data.destination || "",
          loadingDate: data.loadingDate || "",
          otherServices: data.otherServices
            ? data.otherServices.split(",").filter(Boolean)
            : [""],
        });
      },
    });
  };

  const handleExportCSV = () => {
    const csvData = [
      {
        ...clientInfo,
        ...regulatoryService,
        otherServices: regulatoryService.otherServices.join(","),
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "regulatory_service_data.csv";
    link.click();
  };

  const pages = ["Client Information", "Regulatory Service"];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <CardBox>
              <h3 className="text-2xl font-bold mb-6">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={clientInfo.name}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={clientInfo.address}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Barangay</label>
                    <input
                      type="text"
                      name="barangay"
                      placeholder="Barangay"
                      value={clientInfo.barangay}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Municipality
                    </label>
                    <select
                      name="municipality"
                      value={clientInfo.municipality}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    >
                      <option value="">Select Municipality</option>
                      <option value="Ambaguio">Ambaguio</option>
                      <option value="Bagabag">Bagabag</option>
                      <option value="Bayombong">Bayombong</option>
                      <option value="Diadi">Diadi</option>
                      <option value="Quezon">Quezon</option>
                      <option value="Solano">Solano</option>
                      <option value="Villaverde">Villaverde</option>
                      <option value="Alfonso Castañeda">
                        Alfonso Castañeda
                      </option>
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
                    <label className="block mb-2 font-medium">Province</label>
                    <input
                      type="text"
                      name="province"
                      placeholder="Province"
                      value={clientInfo.province}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Birthday</label>
                    <input
                      type="date"
                      name="birthday"
                      value={clientInfo.birthday}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Gender</label>
                    <select
                      name="gender"
                      value={clientInfo.gender}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="Contact Number"
                      value={clientInfo.contact}
                      onChange={(e) => handleInputChange(e, "clientInfo")}
                      className="border w-full p-2 rounded"
                    />
                  </div>
                </div>
              </div>
            </CardBox>
          </>
        );

      case 1:
        return (
          <>
            <CardBox>
              <h3 className="text-2xl font-bold mb-6">
                Veterinary Health Certificate
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Animals to be Shipped
                  </label>
                  <input
                    type="text"
                    name="animalsToBeShipped"
                    placeholder="Animals to be Shipped"
                    value={regulatoryService.animalsToBeShipped}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">No. of Heads</label>
                  <input
                    type="number"
                    name="noOfHeads"
                    placeholder="No. of Heads"
                    value={regulatoryService.noOfHeads}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Purpose</label>
                  <input
                    type="text"
                    name="purpose"
                    placeholder="Purpose"
                    value={regulatoryService.purpose}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Name of Owner/Farm
                  </label>
                  <input
                    type="text"
                    name="ownerFarmName"
                    placeholder="Name of Owner/Farm"
                    value={regulatoryService.ownerFarmName}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Name of Registered Transport Carrier
                  </label>
                  <input
                    type="text"
                    name="transportCarrierName"
                    placeholder="Name of Transport Carrier"
                    value={regulatoryService.transportCarrierName}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Vehicle Plate Number
                  </label>
                  <input
                    type="text"
                    name="vehiclePlateNumber"
                    placeholder="Vehicle Plate Number"
                    value={regulatoryService.vehiclePlateNumber}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Origin</label>
                  <input
                    type="text"
                    name="origin"
                    placeholder="Origin (Barangay, Municipality, Province)"
                    value={regulatoryService.origin}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    placeholder="Destination (Barangay, Municipality, Province)"
                    value={regulatoryService.destination}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Date of Pick-up/Loading
                  </label>
                  <input
                    type="date"
                    name="loadingDate"
                    value={regulatoryService.loadingDate}
                    onChange={(e) => handleInputChange(e, "regulatoryService")}
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 font-medium">
                    Others (If Any) Please Specify
                  </label>
                  {regulatoryService.otherServices.map((service, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <input
                        type="text"
                        placeholder={`Specify Other Service ${index + 1}`}
                        value={service}
                        onChange={(e) =>
                          handleOtherServiceChange(index, e.target.value)
                        }
                        className="border w-full p-2 rounded mr-2"
                      />
                      {index === regulatoryService.otherServices.length - 1 && (
                        <button
                          type="button"
                          onClick={addOtherService}
                          className="bg-darkgreen text-white p-2 rounded hover:bg-green-700 transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardBox>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Regulatory Service</h2>
      <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      <FormSubmit
        handleImportCSV={handleImportCSV}
        handleExportCSV={handleExportCSV}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default RegulatoryCareServices;
