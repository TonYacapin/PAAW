import React, { useState } from "react";
import FormSubmit from "../../component/FormSubmit";
import Papa from "papaparse";
import axiosInstance from "../../component/axiosInstance";
import CardBox from "../../component/CardBox";
import SuccessModal from "../../component/SuccessModal";
import ErrorModal from "../../component/ErrorModal";

function SlaughterReportForm() {
  const municipalities = [
    "Ambaguio",
    "Bagabag",
    "Bayombong",
    "Diadi",
    "Quezon",
    "Solano",
    "Villaverde",
    "Alfonso Castañeda",
    "Aritao",
    "Bambang",
    "Dupax del Norte",
    "Dupax del Sur",
    "Kayapa",
    "Kasibu",
    "Santa Fe",
  ];

  const animals = ["Cattle", "Carabao", "Goat", "Sheep", "Hog", "Chicken"];
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isErrorOpen, setisErrorOpen] = useState(false);
  const [isSuccessOpen, setisSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    municipality: "",
    month: "",
    year: "",
    slaughterAnimals: animals.map((animal) => ({
      name: animal,
      number: "",
      weight: "",
    })),
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "municipality" || name === "month" || name === "year") {
      setFormData({ ...formData, [name]: value });
    } else {
      const updatedAnimals = [...formData.slaughterAnimals];
      updatedAnimals[index][name] = value;
      setFormData({ ...formData, slaughterAnimals: updatedAnimals });
    }
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const importedData = result.data[0];
          setFormData({
            ...formData,
            municipality: importedData.municipality || "",
            month: importedData.month || "",
            year: importedData.year || "",
            slaughterAnimals: animals.map((animal) => ({
              name: animal,
              number: importedData[`${animal}_number`] || "",
              weight: importedData[`${animal}_weight`] || "",
            })),
          });
        },
      });
    }
  };

  const handleExportCSV = () => {
    const csvData = [
      {
        municipality: formData.municipality,
        month: formData.month,
        year: formData.year,
        ...formData.slaughterAnimals.reduce((acc, animal) => {
          acc[`${animal.name}_number`] = animal.number;
          acc[`${animal.name}_weight`] = animal.weight;
          return acc;
        }, {}),
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "slaughter_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/api/slaughterform`, formData);
      setSuccess("Slaughter report successfully submitted!");
      setisSuccessOpen(true);
      // // Reset formData to initial state
      // setFormData({
      //   municipality: '',
      //   month: '',
      //   year: '',
      //   slaughterAnimals: animals.map(animal => ({
      //     name: animal,
      //     number: '',
      //     weight: ''
      //   }))
      // });

      console.log(response.data);
    } catch (err) {
      setError("Error submitting the report. Please try again.");
      console.error(err);
      setisErrorOpen(true);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium text-black">Slaughter Report Form</h2>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <CardBox>
          {/* Municipality Dropdown */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="municipality"
                className="block text-sm font-medium text-black mb-1"
              >
                Municipality
              </label>
              <select
                id="municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
                required
              >
                <option value="">Select Municipality</option>
                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>

            {/* Month and Year Input */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex-1">
                <label
                  htmlFor="month"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Month
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                {/* <input
                type="number"
                id="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
                placeholder="Month"
                min="1"
                max="12"
                required
              /> */}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
                  placeholder="Year"
                  min="1900"
                  max="2100"
                  required
                />
              </div>
            </div>

            {/* Slaughter Animals Section */}
            <div>
              <h3 className="text-lg font-medium text-black">
                Slaughter Animals
              </h3>
              {formData.slaughterAnimals.map((animal, index) => (
                <div key={animal.name} className="space-y-2 mt-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="justify-center items-center min-h-full min-w-20">
                      <h4 className="text-md font-medium text-black">
                        {animal.name}
                      </h4>
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor={`number-${index}`}
                        className="block text-sm font-medium text-black mb-1"
                      >
                        Number
                      </label>
                      <input
                        type="number"
                        id={`number-${index}`}
                        name="number"
                        value={animal.number}
                        onChange={(e) => handleInputChange(e, index)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
                        placeholder="Number"
                        min="0"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor={`weight-${index}`}
                        className="block text-sm font-medium text-black mb-1"
                      >
                        Weight (kg)
                      </label>
                      <input
                        type="text"
                        id={`weight-${index}`}
                        name="weight"
                        value={animal.weight}
                        onChange={(e) => handleInputChange(e, index)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
                        placeholder="Weight"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBox>

        {/* Success and Error Messages */}
        <SuccessModal
          message={success}
          isOpen={isSuccessOpen}
          onClose={() => setisSuccessOpen(false)}
        />
        <ErrorModal
          message={error}
          isOpen={isErrorOpen}
          onClose={() => setisErrorOpen(false)}
        />

        {/* Submit Button */}
        <FormSubmit
          handleImportCSV={handleImportCSV}
          handleExportCSV={handleExportCSV}
          handleSubmit={handleSubmit}
        />
      </form>
    </>
  );
}

export default SlaughterReportForm;
