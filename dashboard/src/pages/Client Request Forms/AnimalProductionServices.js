import React, { useState } from 'react';
import FormSubmit from '../../component/FormSubmit';
import StepperComponent from '../../component/StepperComponent';
import Papa from 'papaparse'; // Make sure to import Papa Parse

function AnimalProductionServices() {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    completeAddress: '',
    barangay: '',
    municipality: '',
    province: '',
    birthday: '',
    gender: '',
    contactNumber: '',
  });

  const [animalInfo, setAnimalInfo] = useState({
    nameOfPet: '',
    species: '',
    sex: '',
    age: '',
    color: '',
    remarks: '',
    loanType: '',
    animalType: '',
  });

  const [serviceDetails, setServiceDetails] = useState({
    aiAnimalType: '',
    quantity: '',
  });

  const [livelihoodInfo, setLivelihoodInfo] = useState({
    applicationType: '',
    productionType: '',
  });

  const [trainingInfo, setTrainingInfo] = useState({
    specificTopic: '',
    venue: '',
    date: '',
  });

  const [iecMaterial, setIecMaterial] = useState({
    title: '',
  });

  const [otherInfo, setOtherInfo] = useState({
    others: '',
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
          barangay: data.barangay || "",
          municipality: data.municipality || "",
          province: data.province || "",
          birthday: data.birthday || "",
          gender: data.gender || "",
          contactNumber: data.contactNumber || "",
        });

        setAnimalInfo({
          nameOfPet: data.nameOfPet || "",
          species: data.species || "",
          sex: data.sex || "",
          age: data.age || "",
          color: data.color || "",
          remarks: data.remarks || "",
          loanType: data.loanType || "",
          animalType: data.animalType || "",
        });

        setServiceDetails({
          aiAnimalType: data.aiAnimalType || "",
          quantity: data.quantity || "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log('Submitting:', { clientInfo, animalInfo, serviceDetails, livelihoodInfo, trainingInfo, iecMaterial, otherInfo });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2>Client Information</h2>
            <label className="block mb-2 font-medium">Name</label>
            <input type="text" name="name" placeholder="Name" value={clientInfo.name} onChange={(e) => handleInputChange(e, setClientInfo)} required className="border w-full p-2 rounded" />
            
            <label className="block mb-2 font-medium">Complete Address</label>
            <input type="text" name="completeAddress" placeholder="Complete Address" value={clientInfo.completeAddress} onChange={(e) => handleInputChange(e, setClientInfo)} required className="border w-full p-2 rounded" />
            
            <label className="block mb-2 font-medium">Barangay</label>
            <input type="text" name="barangay" placeholder="Barangay" value={clientInfo.barangay} onChange={(e) => handleInputChange(e, setClientInfo)} required className="border w-full p-2 rounded" />

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

            <label className="block mb-2 font-medium">Province</label>
            <input type="text" name="province" placeholder="Province" value={clientInfo.province} onChange={(e) => handleInputChange(e, setClientInfo)} required className="border w-full p-2 rounded" />

            <label className="block mb-2 font-medium">Birthday</label>
            <input type="date" name="birthday" value={clientInfo.birthday} onChange={(e) => handleInputChange(e, setClientInfo)} required className="border w-full p-2 rounded" />

            <label className="block mb-2 font-medium">Gender</label>
            <select name="gender" value={clientInfo.gender} onChange={(e) => handleInputChange(e, setClientInfo)} required className="border w-full p-2 rounded">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label className="block mb-2 font-medium">Contact Number</label>
            <input type="text" name="contactNumber" placeholder="Contact Number" value={clientInfo.contactNumber} onChange={(e) => handleInputChange(e, setClientInfo)} required className="border w-full p-2 rounded" />
          </div>
        );

      case 1: // Page 1: SR/LR-GIP Application & Artificial Insemination
        return (
          <div>
            <h2>SR/LR-GIP Application</h2>
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

            <h2 className="mt-6">Artificial Insemination</h2>
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
        );

      case 2: // Page 2: Livelihood Enterprise Development & Animal Production Briefing/Training
        return (
          <div>
            <h2>Livelihood Enterprise Development</h2>
            <label className="block mb-2 font-medium">Type of Application</label>
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

            <label className="block mb-2 font-medium">Type of Production</label>
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

            <h2 className="mt-6">Animal Production Briefing/Training</h2>
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
        );

      case 3: // Page 3: IEC Material & Others
        return (
          <div>
            <h2>IEC Material</h2>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={iecMaterial.title}
              onChange={(e) => handleInputChange(e, setIecMaterial)}
              required
              className="border w-full p-2 rounded"
            />

            <h2 className="mt-6">Others</h2>
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
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Animal Production Services</h1>
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
