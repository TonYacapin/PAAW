import React, { useState, useEffect } from "react";
import StepperComponent from "../../component/StepperComponent";
import FormSubmit from "../../component/FormSubmit";
import Papa from "papaparse";
import axiosInstance from "../../component/axiosInstance";
import { Add } from "@mui/icons-material";
import CardBox from "../../component/CardBox";
import BarangayDropDown from "../../component/BarangayDropDown";
import { jwtDecode } from "jwt-decode";

function AnimalHealthCareServices() {
  const [userRole, setUserRole] = useState("");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    barangay: "",
    municipality: "",
    province: "",
    birthday: "",
    gender: "",
    contact: "",
  });

  // State for storing input values
  const [rabiesVaccinations, setRabiesVaccinations] = useState([
    {
      petName: "",
      species: "",
      sex: "",
      age: "",
      color: "",
      remarks: "",
    },
  ]);

  const [vaccinations, setVaccinations] = useState([
    {
      type: "",
      walkInSpecies: "",
      noOfHeads: "",
      sex: "",
      age: "",
      aewVaccine: "",
      aewQuantity: "",
    },
  ]);

  const [routineServices, setRoutineServices] = useState([
    {
      serviceType: "",
      species: "",
      noOfHeads: "",
      sex: "",
      age: "",
      aewVaccine: "",
      aewQuantity: "",
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      clientInfo,
      rabiesVaccinations,
      vaccinations,
      routineServices,
    };

    try {
      // Send formData to the API using axiosInstance
      const response = await axiosInstance.post(
        "/api/animal-health-care-services",
        formData
      );
      console.log("Form submitted successfully:", response.data);

      // Clear the form fields by resetting the state
      setClientInfo({
        name: "",
        barangay: "",
        municipality: "",
        province: "",
        birthday: "",
        gender: "",
        contact: "",
      });
      setRabiesVaccinations([
        {
          petName: "",
          species: "",
          sex: "",
          age: "",
          color: "",
          remarks: "",
        },
      ]);
      setVaccinations([
        {
          type: "",
          walkInSpecies: "",
          noOfHeads: "",
          sex: "",
          age: "",
          aewVaccine: "",
          aewQuantity: "",
        },
      ]);
      setRoutineServices([
        {
          serviceType: "",
          species: "",
          noOfHeads: "",
          sex: "",
          age: "",
          aewVaccine: "",
          aewQuantity: "",
        },
      ]);

      // Optionally, provide feedback to the user, e.g., show a success message
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error response, e.g., show an error message to the user
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        console.log(role); // Adjust this key based on your token's structure
        setUserRole(role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        console.log(data);

        const importedClientInfo = data[0];
        setClientInfo({
          name: importedClientInfo.name || "",
          barangay: importedClientInfo.barangay || "",
          municipality: importedClientInfo.municipality || "",
          province: importedClientInfo.province || "",
          birthday: importedClientInfo.birthday || "",
          gender: importedClientInfo.gender || "",
          contact: importedClientInfo.contact || "",
        });

        const importedRabiesVaccinations = data
          .filter((row) => row.petName)
          .map((row) => ({
            petName: row.petName || "",
            species: row.species || "",
            sex: row.sex || "",
            age: row.age || "",
            color: row.color || "",
            remarks: row.remarks || "",
          }));
        setRabiesVaccinations(
          importedRabiesVaccinations.length > 0
            ? importedRabiesVaccinations
            : [
              {
                petName: "",
                species: "",
                sex: "",
                age: "",
                color: "",
                remarks: "",
              },
            ]
        );

        const importedVaccinations = data
          .filter((row) => row.vaccinationType)
          .map((row) => ({
            type: row.vaccinationType || "",
            walkInSpecies: row.vaccinationWalkInSpecies || "",
            noOfHeads: row.vaccinationNoOfHeads || "",
            sex: row.sex || "",
            age: row.age || "",
            aewVaccine: row.vaccinationAEWVaccine || "",
            aewQuantity: row.vaccinationAEWQuantity || "",
          }));
        setVaccinations(
          importedVaccinations.length > 0
            ? importedVaccinations
            : [
              {
                type: "",
                walkInSpecies: "",
                noOfHeads: "",
                sex: "",
                age: "",
                aewVaccine: "",
                aewQuantity: "",
              },
            ]
        );

        const importedRoutineServices = data
          .filter((row) => row.routineServiceType)
          .map((row) => ({
            serviceType: row.routineServiceType || "",
            species: row.species || "",
            noOfHeads: row.routineNoOfHeads || "",
            sex: row.sex || "",
            age: row.age || "",
            aewVaccine: row.routineAEWVaccine || "",
            aewQuantity: row.routineAEWQuantity || "",
          }));
        setRoutineServices(
          importedRoutineServices.length > 0
            ? importedRoutineServices
            : [
              {
                serviceType: "",
                species: "",
                noOfHeads: "",
                sex: "",
                age: "",
                aewVaccine: "",
                aewQuantity: "",
              },
            ]
        );
      },
    });
  };

  const handleExportCSV = () => {
    const csvData = [
      {
        ...clientInfo,
        ...rabiesVaccinations[0],
        ...vaccinations[0],
        ...routineServices[0],
      },
      ...rabiesVaccinations.slice(1).map((item) => ({
        ...clientInfo,
        ...item,
      })),
      ...vaccinations.slice(1).map((item) => ({
        ...clientInfo,
        ...item,
      })),
      ...routineServices.slice(1).map((item) => ({
        ...clientInfo,
        ...item,
      })),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "animal_health_care_data.csv";
    link.click();
  };
  // Handler for input changes
  // Updated handleInputChange function to handle both object and array updates
  const handleInputChange = (e, section, setter, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      // Handle array state updates
      setter((prev) => {
        const newArray = [...prev];
        newArray[index] = {
          ...newArray[index],
          [name]: value,
        };
        return newArray;
      });
    } else {
      // Handle object state updates
      setter((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
            <CardBox>
              {" "}
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

                {/* <div className="flex flex-col">
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
                </div> */}

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

                <div>
                  <BarangayDropDown municipality={clientInfo.municipality} onChange={(e) =>
                    handleInputChange(e, "clientInfo", setClientInfo)} />
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
                    type="date"
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
                </div>

                <div className="flex flex-col">
                  <label className="block mb-2 font-medium">
                    Contact Number
                  </label>
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
            </CardBox>
          </>
        );
      case 1:
        return (
          <>
            <CardBox>
              {" "}
              <h3 className="text-2xl font-bold mb-6">Rabies Vaccination</h3>
              <table className="min-w-full bg-white">
                <thead className="bg-darkgreen text-white">
                  <tr>
                    <th className="py-2">Name of Pet</th>
                    <th className="py-2">Species</th>
                    <th className="py-2">Gender</th>
                    <th className="py-2">Age</th>
                    <th className="py-2">Color</th>
                    <th className="py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {rabiesVaccinations.map((rabiesVaccination, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="petName"
                          placeholder="Name of Pet"
                          value={rabiesVaccination.petName}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "rabiesVaccinations",
                              setRabiesVaccinations,
                              index
                            )
                          }
                          className="border w-full p-2 rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="species"
                          placeholder="Species"
                          value={rabiesVaccination.species}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "rabiesVaccinations",
                              setRabiesVaccinations,
                              index
                            )
                          }
                          className="border w-full p-2 rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <select
                          name="sex"
                          value={rabiesVaccination.sex}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "rabiesVaccinations",
                              setRabiesVaccinations,
                              index
                            )
                          }
                          className="border w-full p-2 rounded"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="age"
                          placeholder="Age"
                          value={rabiesVaccination.age}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "rabiesVaccinations",
                              setRabiesVaccinations,
                              index
                            )
                          }
                          className="border w-full p-2 rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="color"
                          placeholder="Color"
                          value={rabiesVaccination.color}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "rabiesVaccinations",
                              setRabiesVaccinations,
                              index
                            )
                          }
                          className="border w-full p-2 rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="remarks"
                          placeholder="Remarks"
                          value={rabiesVaccination.remarks}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "rabiesVaccinations",
                              setRabiesVaccinations,
                              index
                            )
                          }
                          className="border w-full p-2 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() =>
                  setRabiesVaccinations([
                    ...rabiesVaccinations,
                    {
                      petName: "",
                      species: "",
                      sex: "",
                      age: "",
                      color: "",
                      remarks: "",
                    },
                  ])
                }
                className="mt-4 bg-darkgreen hover:bg-darkergreen text-white p-2 rounded"
              >
                <Add /> Add Another Entry
              </button>
            </CardBox>
          </>
        );
      case 2:
        return (
          <>
            <CardBox>
              <h3 className="text-2xl font-bold mb-6">Vaccination</h3>
              <h3 className="text-md font-semibold mb-6">
                {userRole === "extensionworker" ? "Agricultural Extension Worker" : "Walk-in/Home Service"}
              </h3>
              <table className="min-w-full bg-white">
                <thead className="bg-darkgreen text-white">
                  <tr>
                    {userRole === "extensionworker" ? (
                      <>
                        <th className="py-2">Vaccine</th>
                        <th className="py-2">Quantity</th>
                      </>
                    ) : (
                      <>
                        <th className="py-2">Vaccination Type</th>
                        <th className="py-2">Species</th>
                        <th className="py-2">No. of Heads</th>
                        <th className="py-2">Gender</th>
                        <th className="py-2">Age</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {vaccinations.map((vaccination, index) => (
                    <tr key={index}>
                      {userRole === "extensionworker" ? (
                        <>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="aewVaccine"
                              placeholder="Vaccine"
                              value={vaccination.aewVaccine}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "vaccinations",
                                  setVaccinations,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="aewQuantity"
                              placeholder="Quantity"
                              value={vaccination.aewQuantity}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "vaccinations",
                                  setVaccinations,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border px-4 py-2">
                            <select
                              name="type"
                              value={vaccination.type}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "vaccinations",
                                  setVaccinations,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            >
                              <option value="">Select Vaccination</option>
                              <option value="hogCholera">Hog Cholera</option>
                              <option value="hemosep">Hemosep</option>
                              <option value="newCastleDisease">New Castle Disease</option>
                              <option value="blackleg">Blackleg</option>
                            </select>
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="walkInSpecies"
                              placeholder="Species"
                              value={vaccination.walkInSpecies}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "vaccinations",
                                  setVaccinations,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="noOfHeads"
                              placeholder="No. of Heads"
                              value={vaccination.noOfHeads}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "vaccinations",
                                  setVaccinations,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                          <td className="border px-4 py-2">
                            <select
                              name="sex"
                              value={vaccination.sex}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "vaccinations",
                                  setVaccinations,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="age"
                              placeholder="Age"
                              value={vaccination.age}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "vaccinations",
                                  setVaccinations,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                          {/* Don't render Vaccine and Quantity fields for non-extension workers */}
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() =>
                  setVaccinations([
                    ...vaccinations,
                    {
                      type: "",
                      walkInSpecies: "",
                      noOfHeads: "",
                      sex: "",
                      age: "",
                      aewVaccine: "",
                      aewQuantity: "",
                    },
                  ])
                }
                className="mt-4 bg-darkgreen hover:bg-darkergreen text-white p-2 rounded"
              >
                <Add /> Add Another Entry
              </button>
            </CardBox>
          </>
        );
        

      case 3:
        return (
          <>
            <CardBox>
              <h3 className="text-2xl font-bold mb-6">Routine Services</h3>
              <h3 className="text-md font-semibold mb-6">
                {userRole === "extensionworker" ? "Agricultural Extension Worker" : "Walk-in/Home Service"}
              </h3>
              <table className="min-w-full bg-white">
                <thead className="bg-darkgreen text-white">
                  <tr>
                    {userRole === "extensionworker" ? (
                      <>
                        <th className="py-2">Vaccine</th>
                        <th className="py-2">Quantity</th>
                      </>
                    ) : (
                      <>
                        <th className="py-2">Service Type</th>
                        <th className="py-2">Species</th>
                        <th className="py-2">No. of Heads</th>
                        <th className="py-2">Gender</th>
                        <th className="py-2">Age</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {routineServices.map((routineService, index) => (
                    <tr key={index}>
                      {userRole === "extensionworker" ? (
                        <>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="aewVaccine"
                              placeholder="Vaccine"
                              value={routineService.aewVaccine}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "routineServices",
                                  setRoutineServices,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="aewQuantity"
                              placeholder="Quantity"
                              value={routineService.aewQuantity}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "routineServices",
                                  setRoutineServices,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border px-4 py-2">
                            <select
                              name="serviceType"
                              value={routineService.serviceType}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "routineServices",
                                  setRoutineServices,
                                  index
                                )
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
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="species"
                              placeholder="Species"
                              value={routineService.species}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "routineServices",
                                  setRoutineServices,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="noOfHeads"
                              placeholder="No. of Heads"
                              value={routineService.noOfHeads}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "routineServices",
                                  setRoutineServices,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                          <td className="border px-4 py-2">
                            <select
                              name="sex"
                              value={routineService.sex}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "routineServices",
                                  setRoutineServices,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="text"
                              name="age"
                              placeholder="Age"
                              value={routineService.age}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "routineServices",
                                  setRoutineServices,
                                  index
                                )
                              }
                              className="border w-full p-2 rounded"
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() =>
                  setRoutineServices([
                    ...routineServices,
                    {
                      serviceType: "",
                      species: "",
                      noOfHeads: "",
                      sex: "",
                      age: "",
                      aewVaccine: "",
                      aewQuantity: "",
                    },
                  ])
                }
                className="mt-4 bg-darkgreen hover:bg-darkergreen text-white p-2 rounded"
              >
                <Add /> Add Another Entry
              </button>
            </CardBox>
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
