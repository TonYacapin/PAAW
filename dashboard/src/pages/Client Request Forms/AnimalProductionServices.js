import React, { useState } from "react";
import FormSubmit from "../../component/FormSubmit";
import StepperComponent from "../../component/StepperComponent";
import Papa from "papaparse"; // Make sure to import Papa Parse
import axiosInstance from "../../component/axiosInstance";
import CardBox from "../../component/CardBox";
import BarangayDropDown from "../../component/BarangayDropDown";

function AnimalProductionServices() {
  const [clientInfo, setClientInfo] = useState({
    name: "",
    completeAddress: "",
    municipality: "",
    province: "",
    birthday: "",
    gender: "",
    contactNumber: "",
  });

  const [animalInfo, setAnimalInfo] = useState({
    loanType: "",
    animalType: "",
  });

  const [serviceDetails, setServiceDetails] = useState({
    aiAnimalType: "",
  });

  const [livelihoodInfo, setLivelihoodInfo] = useState({
    applicationType: "",
    productionType: "",
  });

  const [trainingInfo, setTrainingInfo] = useState({
    specificTopic: "",
    venue: "",
    date: "",
  });

  const [iecMaterial, setIecMaterial] = useState({
    title: "",
  });

  const [otherInfo, setOtherInfo] = useState({
    others: "",
  });

  // Import CSV
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
          completeAddress: data.completeAddress || "",
          municipality: data.municipality || "",
          province: data.province || "",
          birthday: data.birthday || "",
          gender: data.gender || "",
          contactNumber: data.contactNumber || "",
        });

        setAnimalInfo({
          loanType: data.loanType || "",
          animalType: data.animalType || "",
        });

        setServiceDetails({
          aiAnimalType: data.aiAnimalType || "",
        });

        setLivelihoodInfo({
          applicationType: data.applicationType || "",
          productionType: data.productionType || "",
        });

        setTrainingInfo({
          specificTopic: data.specificTopic || "",
          venue: data.venue || "",
          date: data.date || "",
        });

        setIecMaterial({
          title: data.title || "",
        });

        setOtherInfo({
          others: data.others || "",
        });
      },
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvData = [
      {
        ...clientInfo,
        ...animalInfo,
        ...serviceDetails,
        ...livelihoodInfo,
        ...trainingInfo,
        ...iecMaterial,
        ...otherInfo,
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "animal_production_services_data.csv";
    link.click();
  };

  // General input change handler
  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be submitted
    const submissionData = {
      clientInfo,
      animalInfo,
      serviceDetails,
      livelihoodInfo,
      trainingInfo,
      iecMaterial,
      otherInfo,
    };

    try {
      const response = await axiosInstance.post(
        "/api/animal-production-services",
        submissionData
      );
      console.log("Submission successful:", response.data);

      // Reset form fields to initial state
      resetForm();
      // Optionally show a success message
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response ? error.response.data : error.message
      );
      // Optionally show error message to the user
    }
  };

  // Function to reset the form fields
  const resetForm = () => {
    setClientInfo({
      name: "",
      completeAddress: "",
      municipality: "",
      province: "",
      birthday: "",
      gender: "",
      contactNumber: "",
    });

    setAnimalInfo({
      loanType: "",
      animalType: "",
    });

    setServiceDetails({
      aiAnimalType: "",
   
    });

    setLivelihoodInfo({
      applicationType: "",
      productionType: "",
    });

    setTrainingInfo({
      specificTopic: "",
      venue: "",
      date: "",
    });

    setIecMaterial({
      title: "",
    });

    setOtherInfo({
      others: "",
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <CardBox>
              <h3 className="text-2xl font-bold mb-6">Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={clientInfo.name}
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Complete Address
                  </label>
                  <input
                    type="text"
                    name="completeAddress"
                    placeholder="Complete Address"
                    value={clientInfo.completeAddress}
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
                    className="border w-full p-2 rounded"
                  />
                </div>

                {/* <div>
                  <label className="block mb-2 font-medium">Barangay</label>
                  <input
                    type="text"
                    name="barangay"
                    placeholder="Barangay"
                    value={clientInfo.barangay}
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
                    className="border w-full p-2 rounded"
                  />
                </div> */}

                <div>
                  <label className="block mb-2 font-medium">Municipality</label>
                  <select
                    name="municipality"
                    value={clientInfo.municipality}
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
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
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Birthday</label>
                  <input
                    type="date"
                    name="birthday"
                    value={clientInfo.birthday}
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
                    className="border w-full p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Gender</label>
                  <select
                    name="gender"
                    value={clientInfo.gender}
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
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
                    type="text"
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={clientInfo.contactNumber}
                    onChange={(e) => handleInputChange(e, setClientInfo)}
                    required
                    className="border w-full p-2 rounded"
                  />
                </div>
              </div>
            </CardBox>
          </>
        );

      case 1: // Page 1: SR/LR-GIP Application & Artificial Insemination
        return (
          <CardBox>
            <div className="grid grid-cols-2 gap-4">
              <h2 className="text-2xl font-bold col-span-2">
                SR/LR-GIP Application
              </h2>
              <div>
                <label className="block mb-2 font-medium">Type of Loan</label>
                <select
                  name="loanType"
                  value={animalInfo.loanType}
                  onChange={(e) => handleInputChange(e, setAnimalInfo)}
                  required
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Type of Loan</option>
                  <option value="Buck loan">Buck loan</option>
                  <option value="Module">Module</option>
                  <option value="Multiplier">Multiplier</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Animal</label>
                <select
                  name="animalType"
                  value={animalInfo.animalType}
                  onChange={(e) => handleInputChange(e, setAnimalInfo)}
                  required
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Animal</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Carabao">Carabao</option>
                </select>
              </div>

              <div className="h-3" />

              <h2 className="text-2xl font-bold col-span-2">
                Artificial Insemination
              </h2>

              <div>
                <label className="block mb-2 font-medium">Animal Type</label>
                <select
                  name="aiAnimalType"
                  value={serviceDetails.aiAnimalType}
                  onChange={(e) => handleInputChange(e, setServiceDetails)}
                  required
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Animal Type</option>
                  <option value="Swine">Swine</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Carabao">Carabao</option>
                </select>
              </div>
            </div>
          </CardBox>
        );

      case 2: // Page 2: Livelihood Enterprise Development & Animal Production Briefing/Training
        return (
          <CardBox>
            <div className="grid grid-cols-2 gap-4">
              <h3 className="text-2xl font-bold col-span-2">
                Livelihood Enterprise Development
              </h3>

              <div className="">
                <label className="block mb-2 font-medium">
                  Type of Application
                </label>
                <select
                  name="applicationType"
                  value={livelihoodInfo.applicationType}
                  onChange={(e) => handleInputChange(e, setLivelihoodInfo)}
                  required
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Type of Application</option>
                  <option value="Group">Group</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>

              <div className="">
                <label className="block mb-2 font-medium">
                  Type of Production
                </label>
                <select
                  name="productionType"
                  value={livelihoodInfo.productionType}
                  onChange={(e) => handleInputChange(e, setLivelihoodInfo)}
                  required
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Type of Production</option>
                  <option value="Swine">Swine</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Duck">Duck</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Carabao">Carabao</option>
                  <option value="Cattle">Cattle</option>
                </select>
              </div>

              <div className="h-3" />

              <h2 className="text-2xl font-bold col-span-2">
                Animal Production Briefing/Training
              </h2>

              <div>
                <label className="block mb-2 font-medium">Specific Topic</label>
                <input
                  type="text"
                  name="specificTopic"
                  placeholder="Specific Topic"
                  value={trainingInfo.specificTopic}
                  onChange={(e) => handleInputChange(e, setTrainingInfo)}
                  required
                  className="border w-full p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Venue</label>
                <input
                  type="text"
                  name="venue"
                  placeholder="Venue"
                  value={trainingInfo.venue}
                  onChange={(e) => handleInputChange(e, setTrainingInfo)}
                  required
                  className="border w-full p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={trainingInfo.date}
                  onChange={(e) => handleInputChange(e, setTrainingInfo)}
                  required
                  className="border w-full p-2 rounded"
                />
              </div>
            </div>
          </CardBox>
        );

      case 3: // Page 3: IEC Material & Others
        return (
          <CardBox>
            <div className="grid grid-cols-2 gap-4">
              <h2 className="text-2xl font-bold col-span-2">IEC Material</h2>
              <div className="col-span-2">
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={iecMaterial.title}
                  onChange={(e) => handleInputChange(e, setIecMaterial)}
                  required
                  className="border w-full p-2 rounded col-span-2"
                />
              </div>

              <div className="h-3" />

              <div className="col-span-2">
                <h2 className="text-2xl font-bold ">Others</h2>
                <label className="block mb-2 font-medium">Please Specify</label>
                <input
                  type="text"
                  name="others"
                  placeholder="Please specify"
                  value={otherInfo.others}
                  onChange={(e) => handleInputChange(e, setOtherInfo)}
                  required
                  className="border w-full p-2 rounded"
                />
              </div>
            </div>
          </CardBox>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Animal Production Services</h2>
      <StepperComponent
        pages={[0, 1, 2, 3]}
        renderStepContent={(step) => renderStepContent(step)}
        onStepChange={(step) => console.log("Step changed to:", step)}
      />

      <FormSubmit
        handleImportCSV={handleImportCSV}
        handleExportCSV={handleExportCSV}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default AnimalProductionServices;
