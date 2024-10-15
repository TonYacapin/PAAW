import React, { useState } from "react";
import FormSubmit from "../../component/FormSubmit";
import Papa from "papaparse";

function VeterinaryInformationService() {
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
    service: "", // Added for Veterinary Service field
    others: "",   // Added for Others field
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      clientInfo,
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
          service: data.service || "", // Added for Veterinary Service
          others: data.others || "",     // Added for Others field
        });
      },
    });
  };

  // Handle CSV export
  const handleExportCSV = () => {
    const csvData = [
      {
        ...clientInfo,
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "veterinary_service_data.csv";
    link.click();
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-2xl font-bold mb-6">Client Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={clientInfo.name}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Municipality</label>
          <select
            name="municipality"
            value={clientInfo.municipality}
            onChange={handleInputChange}
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
        </div>

        <div>
          <label className="block mb-2 font-medium">Province</label>
          <input
            type="text"
            name="province"
            placeholder="Province"
            value={clientInfo.province}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={clientInfo.birthday}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Gender</label>
          <select
            name="gender"
            value={clientInfo.gender}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Contact Number</label>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={clientInfo.contact}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Veterinary Information Service</label>
          <select
            name="service"
            value={clientInfo.service}
            onChange={handleInputChange}
            className="border w-full p-2 rounded"
          >
            <option value="">Select Veterinary Information Service</option>
            <option value="Animal Inventory/Population Inventory">
              Animal Inventory/Population Inventory
            </option>
            <option value="Accomplishment Report">Accomplishment Report</option>
            <option value="Slaughter and Meat Inspection Report">
              Slaughter and Meat Inspection Report
            </option>
            <option value="Veterinary Quarantine Report">
              Veterinary Quarantine Report
            </option>
            <option value="Animal Upgrading Report">
              Animal Upgrading Report
            </option>
            <option value="Revenue and Collection Report">
              Revenue and Collection Report
            </option>
            <option value="Others">Others</option> {/* Added Others option */}
          </select>
        </div>

        {clientInfo.service === "Others" && ( // Conditional rendering for Others field
          <div>
            <label className="block mb-2 font-medium">Please Specify</label>
            <input
              type="text"
              name="others"
              placeholder="Specify Other Service"
              value={clientInfo.others}
              onChange={handleInputChange}
              className="border w-full p-2 rounded"
            />
          </div>
        )}
      </div>

      <FormSubmit
        handleImportCSV={handleImportCSV}
        handleExportCSV={handleExportCSV}
        handleSubmit={handleSubmit}
      />
    </form>
  );
}

export default VeterinaryInformationService;
