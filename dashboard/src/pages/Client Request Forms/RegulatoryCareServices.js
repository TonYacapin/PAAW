import React, { useState } from "react";
import StepperComponent from "../../component/StepperComponent";
import FormSubmit from "../../component/FormSubmit";
import Papa from "papaparse";

function RegulatoryCareServices() {
  // State for storing input values
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
    serviceType: "",
    complianceDate: "",
    remarks: "",
    otherServices: [''], 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      clientInfo,
      regulatoryService, // Assuming this holds all relevant regulatory service data
    };
    console.log("Form Submitted Data:", formData);
    // Here you can send the formData to an API or process it as needed
  };
  
  // Handle CSV import
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data[0]; // Assuming only one row to import for simplicity
        console.log(data);
  
        // Populate state with imported data
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
          otherServices: data.otherServices ? data.otherServices.split(',') : [], // Assuming a comma-separated string for other services
        });
      },
    });
  };
  
  // Handle CSV export
  const handleExportCSV = () => {
    const csvData = [
      {
        ...clientInfo,
        ...regulatoryService,
      },
    ];
  
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "regulatory_service_data.csv";
    link.click();
  };
  

  // Handler for input changes
  const handleInputChange = (e, section, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Pages for the Stepper
  const pages = ["Client Information", "Regulatory Service"];

  // Content for each step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block mb-2 font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={clientInfo.name}
                onChange={(e) =>
                  handleInputChange(e, "clientInfo", setClientInfo)
                }
                className="border w-full p-2 rounded"
              />

              <label className="block mb-2 font-medium">Barangay</label>
              <input
                type="text"
                name="barangay"
                placeholder="Barangay"
                value={clientInfo.barangay}
                onChange={(e) =>
                  handleInputChange(e, "clientInfo", setClientInfo)
                }
                className="border w-full p-2 rounded"
              />

              <label className="block mb-2 font-medium">Municipality</label>
              <select
                name="municipality"
                value={clientInfo.municipality}
                onChange={(e) =>
                  handleInputChange(e, "clientInfo", setClientInfo)
                }
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
                <option value="Alfonso Castañeda">Alfonso Castañeda</option>
                <option value="Aritao">Aritao</option>
                <option value="Bambang">Bambang</option>
                <option value="Dupax del Norte">Dupax del Norte</option>
                <option value="Dupax del Sur">Dupax del Sur</option>
                <option value="Kayapa">Kayapa</option>
                <option value="Kasibu">Kasibu</option>
                <option value="Santa Fe">Santa Fe</option>
              </select>

              <label className="block mb-2 font-medium">Province</label>
              <input
                type="text"
                name="province"
                placeholder="Province"
                value={clientInfo.province}
                onChange={(e) =>
                  handleInputChange(e, "clientInfo", setClientInfo)
                }
                className="border w-full p-2 rounded"
              />

              <label className="block mb-2 font-medium">Birthday</label>
              <input
                type="text"
                name="birthday"
                placeholder="Birthday"
                value={clientInfo.birthday}
                onChange={(e) =>
                  handleInputChange(e, "clientInfo", setClientInfo)
                }
                className="border w-full p-2 rounded"
              />

              <label className="block mb-2 font-medium">Gender</label>
              <select
                name="gender"
                value={clientInfo.gender}
                onChange={(e) =>
                  handleInputChange(e, "clientInfo", setClientInfo)
                }
                className="border w-full p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <label className="block mb-2 font-medium">Contact Number</label>
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={clientInfo.contact}
                onChange={(e) =>
                  handleInputChange(e, "clientInfo", setClientInfo)
                }
                className="border w-full p-2 rounded"
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6">Veterinary Health Certificate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
      
                  <label className="block mb-2 font-medium">
                    Animals to be Shipped
                  </label>
                  <input
                    type="text"
                    name="animalsToBeShipped"
                    placeholder="Animals to be Shipped"
                    value={regulatoryService.animalsToBeShipped}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">No. of Heads</label>
                  <input
                    type="number"
                    name="noOfHeads"
                    placeholder="No. of Heads"
                    value={regulatoryService.noOfHeads}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">Purpose</label>
                  <input
                    type="text"
                    name="purpose"
                    placeholder="Purpose"
                    value={regulatoryService.purpose}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">
                    Name of Owner/Farm
                  </label>
                  <input
                    type="text"
                    name="ownerFarmName"
                    placeholder="Name of Owner/Farm"
                    value={regulatoryService.ownerFarmName}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">
                    Name of Registered Transport Carrier
                  </label>
                  <input
                    type="text"
                    name="transportCarrierName"
                    placeholder="Name of Registered Transport Carrier"
                    value={regulatoryService.transportCarrierName}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">
                    Vehicle Plate Number
                  </label>
                  <input
                    type="text"
                    name="vehiclePlateNumber"
                    placeholder="Vehicle Plate Number"
                    value={regulatoryService.vehiclePlateNumber}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">
                    Origin (Barangay, Municipality, Province)
                  </label>
                  <input
                    type="text"
                    name="origin"
                    placeholder="Origin (Barangay, Municipality, Province)"
                    value={regulatoryService.origin}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">
                    Destination (Barangay, Municipality, Province)
                  </label>
                  <input
                    type="text"
                    name="destination"
                    placeholder="Destination (Barangay, Municipality, Province)"
                    value={regulatoryService.destination}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />

                  <label className="block mb-2 font-medium">
                    Date of Pick-up/Loading Date
                  </label>
                  <input
                    type="date"
                    name="loadingDate"
                    value={regulatoryService.loadingDate}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "regulatoryService",
                        setRegulatoryService
                      )
                    }
                    className="border w-full p-2 rounded"
                  />
                  
              


            <label className="block mb-2 font-medium"> Others (If Any) Please Specify</label>
            {regulatoryService.otherServices.map((service, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="text"
                  placeholder={`Specify Other Service ${index + 1}`}
                  value={service}
                  onChange={(e) => {
                    const newServices = [...regulatoryService.otherServices];
                    newServices[index] = e.target.value;
                    setRegulatoryService({ ...regulatoryService, otherServices: newServices });
                  }}
                  className="border w-full p-2 rounded mr-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newServices = [...regulatoryService.otherServices, ''];
                    setRegulatoryService({ ...regulatoryService, otherServices: newServices });
                  }}
                  className="bg-darkgreen text-white p-2 rounded"
                >
                  Add
                </button>
              </div>
            ))}
          
      
      </div>
    </>
  );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Regulatory Care Services</h2>
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
