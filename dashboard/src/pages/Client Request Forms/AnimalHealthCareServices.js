import React, { useState } from "react";
import StepperComponent from "../../component/StepperComponent";
import FormSubmit from "../../component/FormSubmit";
import Papa from "papaparse";

function AnimalHealthCareServices() {
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

  const [rabiesVaccination, setRabiesVaccination] = useState({
    petName: "",
    species: "",
    sex: "",
    age: "",
    color: "",
    remarks: "",
  });

  const [vaccination, setVaccination] = useState({
    type: "",
    walkInSpecies: "",
    noOfHeads: "",
    sex: "",
    age: "",
    aewVaccine: "",
    aewQuantity: "",
  });

  const [routineServices, setRoutineServices] = useState({
    serviceType: "",
    species: "",
    noOfHeads: "",
    sex: "",
    age: "",
    aewVaccine: "",
    aewQuantity: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      clientInfo,
      rabiesVaccination,
      vaccination,
      routineServices,
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
        setRabiesVaccination({
          petName: data.petName || "",
          species: data.species || "",
          sex: data.sex || "",
          age: data.age || "",
          color: data.color || "",
          remarks: data.remarks || "",
        });
        setVaccination({
          type: data.vaccinationType || "",
          walkInSpecies: data.vaccinationWalkInSpecies || "",
          noOfHeads: data.vaccinationNoOfHeads || "",
          sex: data.sex || "",
          age: data.age || "",
          aewVaccine: data.vaccinationAEWVaccine || "",
          aewQuantity: data.vaccinationAEWQuantity || "",
        });
        setRoutineServices({
          serviceType: data.routineServiceType || "",
          species: data.species || "",
          noOfHeads: data.routineNoOfHeads || "",
          sex: data.sex || "",
          age: data.age || "",
          aewVaccine: data.routineAEWVaccine || "",
          aewQuantity: data.routineAEWQuantity || "",
        });
      },
    });
  };

  // Handle CSV export
  const handleExportCSV = () => {
    const csvData = [
      {
        ...clientInfo,
        ...rabiesVaccination,
        vaccinationType: vaccination.type,
        vaccinationWalkInSpecies: vaccination.walkInSpecies,
        vaccinationNoOfHeads: vaccination.noOfHeads,
        vaccinationSex: vaccination.sex,
        vaccinationAge: vaccination.age,
        vaccinationAEWVaccine: vaccination.aewVaccine,
        vaccinationAEWQuantity: vaccination.aewQuantity,

        routineServiceType: routineServices.serviceType,
        routineSpecies: routineServices.species,
        routineNoOfHeads: routineServices.noOfHeads,
        routineSex: routineServices.sex,
        routineAge: routineServices.age,
        routineAEWVaccine: routineServices.aewVaccine,
        routineAEWQuantity: routineServices.aewQuantity,
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "animal_health_care_data.csv";
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
  const pages = [
    "Client Information",
    "Rabies Vaccination",
    "Vaccination",
    "Routine Services",
  ];

  // Content for each step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
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
              </div>

              <div className="flex flex-col">
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
              </div>

              <div className="flex flex-col">
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
              </div>

              <div className="flex flex-col">
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
              </div>

              <div className="flex flex-col">
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
              </div>

              <div className="flex flex-col">
                <label className="block mb-2 font-medium">Gender</label>
                <select
                  name="type"
                  value={clientInfo.type}
                  onChange={(e) =>
                    handleInputChange(e, "clientInfo", setClientInfo)
                  }
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col">
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
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6">Rabies Vaccination</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="block mb-2 font-medium">Name of Pet</label>
                <input
                  type="text"
                  name="petName"
                  placeholder="Name of Pet"
                  value={rabiesVaccination.petName}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "rabiesVaccination",
                      setRabiesVaccination
                    )
                  }
                  className="border w-full p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="block mb-2 font-medium">Species</label>
                <input
                  type="text"
                  name="species"
                  placeholder="Species"
                  value={rabiesVaccination.species}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "rabiesVaccination",
                      setRabiesVaccination
                    )
                  }
                  className="border w-full p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="block mb-2 font-medium">Gender</label>
                <select
                  name="type"
                  value={rabiesVaccination.type}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "rabiesVaccination",
                      setRabiesVaccination
                    )
                  }
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block mb-2 font-medium">Age</label>
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  value={rabiesVaccination.age}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "rabiesVaccination",
                      setRabiesVaccination
                    )
                  }
                  className="border w-full p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="block mb-2 font-medium">Color</label>
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={rabiesVaccination.color}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "rabiesVaccination",
                      setRabiesVaccination
                    )
                  }
                  className="border w-full p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="block mb-2 font-medium">Remarks</label>
                <input
                  type="text"
                  name="remarks"
                  placeholder="Remarks"
                  value={rabiesVaccination.remarks}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "rabiesVaccination",
                      setRabiesVaccination
                    )
                  }
                  className="border w-full p-2 rounded"
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6">Vaccination</h3>
            <h3 className="text-md font-semibold mb-6">Walk-in/Home Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block mb-2 font-medium">Vaccination Type</label>
              <select
                name="type"
                value={vaccination.type}
                onChange={(e) =>
                  handleInputChange(e, "vaccination", setVaccination)
                }
                className="border w-full p-2 rounded"
              >
                <option value="">Select Vaccination</option>
                <option value="hogCholera">Hog Cholera</option>
                <option value="hemosep">Hemosep</option>
                <option value="newCastleDisease">New Castle Disease</option>
                <option value="blackleg">Blackleg</option>
              </select>
            </div>
              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Species</label>
              <input
                type="text"
                name="walkInSpecies"
                placeholder="Species"
                value={vaccination.walkInSpecies}
                onChange={(e) =>
                  handleInputChange(e, "vaccination", setVaccination)
                }
                className="border w-full p-2 rounded"
              />
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">No. of Heads</label>
              <input
                type="text"
                name="noOfHeads"
                placeholder="No. of Heads"
                value={vaccination.noOfHeads}
                onChange={(e) =>
                  handleInputChange(e, "vaccination", setVaccination)
                }
                className="border w-full p-2 rounded"
              />
              </div>
              
              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Gender</label>
              <select
                name="gender"
                value={vaccination.type}
                onChange={(e) =>
                  handleInputChange(e, "vaccination", setVaccination)
                }
                className="border w-full p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Age</label>
              <input
                type="text"
                name="age"
                placeholder="Age"
                value={vaccination.age}
                onChange={(e) =>
                  handleInputChange(e, "vaccination", setVaccination)
                }
                className="border w-full p-2 rounded"
              />
              </div>
              
              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Vaccine</label>
              <input
                type="text"
                name="aewVaccine"
                placeholder="Vaccine"
                value={vaccination.aewVaccine}
                onChange={(e) =>
                  handleInputChange(e, "vaccination", setVaccination)
                }
                className="border w-full p-2 rounded"
              />
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Quantity</label>
              <input
                type="text"
                name="aewQuantity"
                placeholder="Quantity"
                value={vaccination.aewQuantity}
                onChange={(e) =>
                  handleInputChange(e, "vaccination", setVaccination)
                }
                className="border w-full p-2 rounded"
              />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6">Routine Services</h3>
            <h3 className="text-md font-semibold mb-6">Walk-in/Home Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Service Type</label>
              <select
                name="serviceType"
                value={routineServices.serviceType}
                onChange={(e) =>
                  handleInputChange(e, "routineServices", setRoutineServices)
                }
                className="border w-full p-2 rounded"
              >
                <option value="">Select Service</option>
                <option value="treatmentConsultation">
                  Treatment/Consultation
                </option>
                <option value="deworming">Deworming</option>
                <option value="iecMaterials">IEC Materials</option>
                <option value="others">Others</option>
              </select>
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Species</label>
              <input
                type="text"
                name="species"
                placeholder="Species"
                value={routineServices.species}
                onChange={(e) =>
                  handleInputChange(e, "routineServices", setRoutineServices)
                }
                className="border w-full p-2 rounded"
              />
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">No. of Heads</label>
              <input
                type="text"
                name="noOfHeads"
                placeholder="No. of Heads"
                value={routineServices.noOfHeads}
                onChange={(e) =>
                  handleInputChange(e, "routineServices", setRoutineServices)
                }
                className="border w-full p-2 rounded"
              />
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Gender</label>
              <select
                name="type"
                value={routineServices.type}
                onChange={(e) =>
                  handleInputChange(e, "routineServices", setRoutineServices)
                }
                className="border w-full p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Age</label>
              <input
                type="text"
                name="age"
                placeholder="Age"
                value={routineServices.age}
                onChange={(e) =>
                  handleInputChange(e, "routineServices", setRoutineServices)
                }
                className="border w-full p-2 rounded"
              />
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Vaccine</label>
              <input
                type="text"
                name="aewVaccine"
                placeholder="Vaccine"
                value={routineServices.aewVaccine}
                onChange={(e) =>
                  handleInputChange(e, "routineServices", setRoutineServices)
                }
                className="border w-full p-2 rounded"
              />
              </div>

              <div className="flex flex-col">
              <label className="block mb-2 font-medium">Quantity</label>
              <input
                type="text"
                name="aewQuantity"
                placeholder="Quantity"
                value={routineServices.aewQuantity}
                onChange={(e) =>
                  handleInputChange(e, "routineServices", setRoutineServices)
                }
                className="border w-full p-2 rounded"
              />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Animal Health Care Services</h2>
      <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      <FormSubmit
        handleImportCSV={handleImportCSV}
        handleExportCSV={handleExportCSV}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default AnimalHealthCareServices;
