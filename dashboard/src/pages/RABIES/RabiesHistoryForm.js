import React, { useState } from "react";
import axiosInstance from "../../component/axiosInstance";
import StepperComponent from "../../component/StepperComponent";
import Papa from "papaparse";
import FormSubmit from "../../component/FormSubmit";
import ErrorModal from "../../component/ErrorModal";
import SuccessModal from "../../component/SuccessModal";

const RabiesHistoryForm = () => {
  const [siteOfBiteSpecify, setSiteOfBiteSpecify] = useState("");
  const [locationOfBiteSpecify, setLocationOfBiteSpecify] = useState("");
  const [treatmentReceivedSpecify, setTreatmentReceivedSpecify] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [petManagement, setPetManagement] = useState("");
  const [causeOfDeath, setCauseOfDeath] = useState("");
  const [vaccinationHistory, setVaccinationHistory] = useState("");
  const [bitchVaccinated, setBitchVaccinated] = useState("");
  const [contactWithAnimals, setContactWithAnimals] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [siteOfBite, setSiteOfBite] = useState("");
  const [biteProvoked, setBiteProvoked] = useState("");
  const [locationOfBite, setLocationOfBite] = useState("");
  const [treatmentReceived, setTreatmentReceived] = useState("");
  const [animalResidence, setAnimalResidence] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [timeOfDeath, setTimeOfDeath] = useState("");
  const [typeOfVaccine, setTypeOfVaccine] = useState("");
  const [dateOfLastVaccination, setDateOfLastVaccination] = useState("");
  const [durationIllnessFrom, setDurationIllnessFrom] = useState("");
  const [durationIllnessTo, setDurationIllnessTo] = useState("");

  // Additional states for behavioral changes and victim info
  const [behavioralChanges, setBehavioralChanges] = useState({
    restlessness: false,
    apprehensiveWatchfulLook: false,
    runningAimlessly: false,
    bitingInanimateObjects: false,
    hyperactivity: false,
    others: false,
    specify: "",
  });
  const [victimName, setVictimName] = useState("");
  const [victimAge, setVictimAge] = useState("");
  const [victimSex, setVictimSex] = useState("");
  const [victimAddress, setVictimAddress] = useState("");
  const [dateOfBite, setDateOfBite] = useState("");
  const [timeOfBite, setTimeOfBite] = useState("");
  const [siteOfBiteOther, setSiteOfBiteOther] = useState("");
  const [natureOfBite, setNatureOfBite] = useState("");
  const [biteProvokedSpecify, setBiteProvokedSpecify] = useState("");
  const [locationOfBiteOther, setLocationOfBiteOther] = useState("");
  const [otherVictims, setOtherVictims] = useState("");
  const [treatmentReceivedOther, setTreatmentReceivedOther] = useState("");
  const [dateOfTreatmentReceived, setDateOfTreatmentReceived] = useState("");
  const [StepperActiveStep, setStepperActiveStep] = useState();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      ownershipType,
      petManagement,
      causeOfDeath,
      vaccinationHistory,
      bitchVaccinated,
      contactWithAnimals,
      contactLocation,
      siteOfBite,
      biteProvoked,
      locationOfBite,
      treatmentReceived,
      animalResidence,
      species,
      breed,
      sex,
      age,
      dateOfDeath,
      timeOfDeath,
      typeOfVaccine,
      dateOfLastVaccination,
      durationIllnessFrom,
      durationIllnessTo,
      behavioralChanges,
      victimName,
      victimAge,
      victimSex,
      victimAddress,
      dateOfBite,
      timeOfBite,
      siteOfBiteOther,
      natureOfBite,
      biteProvokedSpecify,
      locationOfBiteOther,
      otherVictims,
      treatmentReceivedOther,
      dateOfTreatmentReceived,
    };

    try {
      console.log(formData);
      const response = await axiosInstance.post(`/RH`, formData);
      console.log("Form submitted successfully:", response.data);

      // Clear form fields
      setOwnershipType("");
      setPetManagement("");
      setCauseOfDeath("");
      setVaccinationHistory("");
      setBitchVaccinated("");
      setContactWithAnimals("");
      setContactLocation("");
      setSiteOfBite("");
      setBiteProvoked("");
      setLocationOfBite("");
      setTreatmentReceived("");
      setAnimalResidence("");
      setSpecies("");
      setBreed("");
      setSex("");
      setAge("");
      setDateOfDeath("");
      setTimeOfDeath("");
      setTypeOfVaccine("");
      setDateOfLastVaccination("");
      setDurationIllnessFrom("");
      setDurationIllnessTo("");
      setBehavioralChanges({
        restlessness: false,
        apprehensiveWatchfulLook: false,
        runningAimlessly: false,
        bitingInanimateObjects: false,
        hyperactivity: false,
        others: false,
        specify: "",
      });
      setVictimName("");
      setVictimAge("");
      setVictimSex("");
      setVictimAddress("");
      setDateOfBite("");
      setTimeOfBite("");
      setSiteOfBiteOther("");
      setNatureOfBite("");
      setBiteProvokedSpecify("");
      setLocationOfBiteOther("");
      setOtherVictims("");
      setTreatmentReceivedOther("");
      setDateOfTreatmentReceived("");
      setStepperActiveStep(0); // Optionally reset the stepper to the first step
      setModalMessage("Form submitted successfully!");
      handleExportCSV()
      setIsSuccessModalOpen(true); // Show success modal
    
    } catch (error) {
      // Error handling
      let errorMessage = "Failed to save entries: An unexpected error occurred";
      if (error.response && error.response.data) {
        const serverMessage =
          error.response.data.message || "An error occurred";
        if (error.response.data.errors) {
          const validationErrors = error.response.data.errors
            .map((err) => err.msg)
            .join(", ");
          errorMessage = `Failed to save entries: ${serverMessage}. Details: ${validationErrors}`;
        } else {
          errorMessage = `Failed to save entries: ${serverMessage}`;
        }
      }

      console.error("Error submitting form:", error);
      setModalMessage(errorMessage);
      setIsErrorModalOpen(true); // Show error modal
    }
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedData = results.data[0];

        setAnimalResidence(importedData.animalResidence || "");
        setSpecies(importedData.species || "");
        setBreed(importedData.breed || "");
        setSex(importedData.sex || "");
        setAge(importedData.age || "");
        setOwnershipType(importedData.ownershipType || "");
        setPetManagement(importedData.petManagement || "");
        setCauseOfDeath(importedData.causeOfDeath || "");
        setVaccinationHistory(importedData.vaccinationHistory || "");
        setTypeOfVaccine(importedData.typeOfVaccine || "");
        setDateOfLastVaccination(importedData.dateOfLastVaccination || "");
        setBitchVaccinated(importedData.bitchVaccinated || "");
        setContactWithAnimals(importedData.contactWithAnimals || "");
        setContactLocation(importedData.contactLocation || "");
        setDateOfDeath(importedData.dateOfDeath || "");
        setTimeOfDeath(importedData.timeOfDeath || "");
        setDurationIllnessFrom(importedData.durationIllnessFrom || "");
        setDurationIllnessTo(importedData.durationIllnessTo || "");
        setBehavioralChanges({
          restlessness: importedData.behavioralChangesRestlessness === "true",
          apprehensiveWatchfulLook:
            importedData.behavioralChangesApprehensiveWatchfulLook === "true",
          runningAimlessly:
            importedData.behavioralChangesRunningAimlessly === "true",
          bitingInanimateObjects:
            importedData.behavioralChangesBitingInanimateObjects === "true",
          hyperactivity: importedData.behavioralChangesHyperactivity === "true",
          others: importedData.behavioralChangesOthers === "true",
          specify: importedData.behavioralChangesSpecify || "",
        });
        setVictimName(importedData.victimName || "");
        setVictimAge(importedData.victimAge || "");
        setVictimSex(importedData.victimSex || "");
        setVictimAddress(importedData.victimAddress || "");
        setDateOfBite(importedData.dateOfBite || "");
        setTimeOfBite(importedData.timeOfBite || "");
        setSiteOfBite(importedData.siteOfBite || "");
        setSiteOfBiteOther(importedData.siteOfBiteSpecify || "");
        setNatureOfBite(importedData.natureOfBite || "");
        setBiteProvoked(importedData.biteProvoked || "");
        setBiteProvokedSpecify(importedData.biteProvokedSpecify || "");
        setLocationOfBite(importedData.locationOfBite || "");
        setLocationOfBiteOther(importedData.locationOfBiteSpecify || "");
        setOtherVictims(importedData.otherVictims || "");
        setTreatmentReceived(importedData.treatmentReceived || "");
        setTreatmentReceivedOther(importedData.treatmentReceivedSpecify || "");
        setDateOfTreatmentReceived(importedData.dateOfTreatmentReceived || "");
      },
    });
  };

  const handleExportCSV = () => {
    const csvData = [
      {
        animalResidence,
        species,
        breed,
        sex,
        age,
        ownershipType,
        petManagement,
        causeOfDeath,

        dateOfDeath,
        timeOfDeath,
        vaccinationHistory,

        typeOfVaccine,
        dateOfLastVaccination,
        bitchVaccinated,

        contactWithAnimals,
        contactLocation,
        durationIllnessFrom,
        durationIllnessTo,
        behavioralChangesRestlessness: behavioralChanges.restlessness,
        behavioralChangesApprehensiveWatchfulLook:
          behavioralChanges.apprehensiveWatchfulLook,
        behavioralChangesRunningAimlessly: behavioralChanges.runningAimlessly,
        behavioralChangesBitingInanimateObjects:
          behavioralChanges.bitingInanimateObjects,
        behavioralChangesHyperactivity: behavioralChanges.hyperactivity,
        behavioralChangesOthers: behavioralChanges.others,
        behavioralChangesSpecify: behavioralChanges.specify,
        victimName,
        victimAge,
        victimSex,
        victimAddress,
        dateOfBite,
        timeOfBite,
        siteOfBite,
        siteOfBiteSpecify,
        natureOfBite,
        biteProvoked,
        biteProvokedSpecify,
        locationOfBite,
        locationOfBiteSpecify,
        otherVictims,
        treatmentReceived,
        treatmentReceivedSpecify,
        dateOfTreatmentReceived,
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "form-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  var pages = [
    <>
      <h3 className="text-lg font-bold mb-6">Animal Profile</h3>
      <div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">
              Residence of the Animal for the Last 15 Days
            </label>
            <input
              type="text"
              name="animalresidence"
              value={animalResidence}
              className="border w-full p-2 rounded"
              onChange={(e) => setAnimalResidence(e.target.value)}
            />
          </div>
          <div>
            {" "}
            <label className="block mb-2 font-medium">Species</label>
            <input
              type="text"
              name="species"
              value={species}
              className="border w-full p-2 rounded"
              onChange={(e) => setSpecies(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Breed</label>
            <input
              type="text"
              name="breed"
              value={breed}
              className="border w-full p-2 rounded"
              onChange={(e) => setBreed(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Sex</label>
            <div className="flex flex-col">
              <select
                value={sex} // Assuming `sex` is a state variable
                onChange={(e) => setSex(e.target.value)} // Update the state on change
                className="border w-full p-2 rounded focus:ring-2 focus:ring-darkgreen"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium">
              {"Age (in months)"}
            </label>
            <input
              type="text"
              name="age"
              value={age}
              className="border w-full p-2 rounded"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Ownership Type</label>
            <select
              name="ownershipType"
              value={ownershipType}
              className="border w-full p-2 rounded"
              onChange={(e) => setOwnershipType(e.target.value)}
            >
              <option value="" disabled>
                Select Type of Ownership
              </option>
              <option value="household_pet">Household Pet</option>
              <option value="pet_of_neighbor">Pet of Neighbor</option>
              <option value="stray_animal">Stray Animal</option>
            </select>
          </div>
        </div>
      </div>
    </>,
    <>
      <h3 className="text-lg font-bold mb-7">Animal Profile</h3>

      <div className="border p-6 rounded-lg mb-20 shadow-md bg-white space-y-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Pet Management</label>
            <select
              name="PetManagement"
              value={petManagement}
              className="border w-full p-2 rounded"
              onChange={(e) => setPetManagement(e.target.value)}
            >
              <option value="" disabled>
                Select Pet Management
              </option>
              <option value="confined">Confined</option>
              <option value="leashed">Leashed</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Cause of Death</label>
            <select
              name="CauseofDeath"
              value={causeOfDeath}
              className="border w-full p-2 rounded"
              onChange={(e) => setCauseOfDeath(e.target.value)}
            >
              <option value="" disabled>
                Select Cause of Death
              </option>
              <option value="euthanasia">Euthanasia</option>
              <option value="illness">Illness</option>
              <option value="accident">Accident</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Date of Death</label>
            <input
              type="date"
              name="DateofDeath"
              value={dateOfDeath}
              className="border w-full p-2 rounded"
              onChange={(e) => setDateOfDeath(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Time of Death</label>
            <input
              type="time"
              name="TimeofDeath"
              value={timeOfDeath}
              className="border w-full p-2 rounded"
              onChange={(e) => setTimeOfDeath(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>,
    <>
      <h3 className="text-lg font-bold mb-6">Animal Profile</h3>
      <div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">
              Vaccination History
            </label>
            <select
              name="VaccinationHistory"
              value={vaccinationHistory}
              className="border w-full p-2 rounded"
              onChange={(e) => setVaccinationHistory(e.target.value)}
            >
              <option value="" disabled>
                Select Vaccination History
              </option>
              <option value="rabies">Rabies</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Type of Vaccine</label>
            <input
              type="text"
              name="TypeofVaccine"
              value={typeOfVaccine}
              className="border w-full p-2 rounded"
              onChange={(e) => setTypeOfVaccine(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Date of Last Vaccination
            </label>
            <input
              type="date"
              name="Date of Last Vaccination"
              value={dateOfLastVaccination}
              className="border w-full p-2 rounded"
              onChange={(e) => setDateOfLastVaccination(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              {"Bitch Vaccinated (for puppies 3 months and below)?"}
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="yesBitchVax"
                  value="yes"
                  checked={bitchVaccinated === "yes"}
                  onChange={(e) => setBitchVaccinated(e.target.value)}
                  className="mr-2"
                />{" "}
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="noBitchVax"
                  value="no"
                  checked={bitchVaccinated === "no"}
                  onChange={(e) => setBitchVaccinated(e.target.value)}
                  className="mr-2"
                />{" "}
                No
              </label>
            </div>
          </div>{" "}
          <div>
            <div>
              <label className="block mb-2 font-medium">
                {"Contact with Other Animals?"}
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="yesContact"
                    value="yes"
                    checked={contactWithAnimals === "yes"}
                    onChange={(e) => setContactWithAnimals(e.target.value)}
                    className="mr-2"
                  />{" "}
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="noContact"
                    value="no"
                    checked={contactWithAnimals === "no"}
                    onChange={(e) => setContactWithAnimals(e.target.value)}
                    className="mr-2"
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>
          {contactWithAnimals === "yes" && (
            <div>
              <label className="block mb-2 font-medium">Where?</label>
              <select
                name="contactLocation"
                value={contactLocation}
                className="border w-full p-2 rounded"
                onChange={(e) => setContactLocation(e.target.value)}
              >
                <option value="" disabled>
                  Select Contact Location
                </option>
                <option value="household">Household</option>
                <option value="neighbo">Neighbor</option>
                <option value="others">Others</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </>,
    <>
      <h3 className="text-lg font-bold mb-6">Animal Profile</h3>

      <div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
        <h4 className="text-md font-bold mb-6">If Sick, Duration of Illness</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">From</label>
            <input
              type="date"
              name="FromDuration"
              value={durationIllnessFrom}
              className="border w-full p-2 rounded"
              onChange={(e) => setDurationIllnessFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">To</label>
            <input
              type="date"
              name="ToDuration"
              value={durationIllnessTo}
              className="border w-full p-2 rounded"
              onChange={(e) => setDurationIllnessTo(e.target.value)}
            />
          </div>
        </div>
        <div>
          <h4 className="text-md font-bold mb-6">Behavioral Changes</h4>
          <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="Restlessness" className="block mb-2 font-medium">
              <input
                className="w-4 h-4 text-darkgreen bg-gray-100 border-gray-300 rounded focus:ring-darkergreen dark:focus:ring-darkgreen dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="checkbox"
                id="Restlessness"
                name="Restlessness"
                checked={behavioralChanges.restlessness === true}
                onChange={() =>
                  setBehavioralChanges({
                    ...behavioralChanges,
                    restlessness: !behavioralChanges.restlessness,
                  })
                }
              />{" "}
              Restlessness
            </label>
            <label
              htmlFor="ApprehensiveWatchfulLook"
              className="block mb-2 font-medium"
            >
              <input
                className="w-4 h-4 text-darkgreen bg-gray-100 border-gray-300 rounded focus:ring-darkergreen dark:focus:ring-darkgreen dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="checkbox"
                id="ApprehensiveWatchfulLook"
                name="ApprehensiveWatchfulLook"
                value={behavioralChanges.apprehensiveWatchfulLook}
                checked={behavioralChanges.apprehensiveWatchfulLook === true}
                onChange={() =>
                  setBehavioralChanges({
                    ...behavioralChanges,
                    apprehensiveWatchfulLook:
                      !behavioralChanges.apprehensiveWatchfulLook,
                  })
                }
              />{" "}
              Apprehensive Watchful Look
            </label>
            <label
              htmlFor="RunningAimlessly"
              className="block mb-2 font-medium"
            >
              <input
                className="w-4 h-4 text-darkgreen bg-gray-100 border-gray-300 rounded focus:ring-darkergreen dark:focus:ring-darkgreen dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="checkbox"
                id="RunningAimlessly"
                name="RunningAimlessly"
                value={behavioralChanges.runningAimlessly}
                checked={behavioralChanges.runningAimlessly === true}
                onChange={() =>
                  setBehavioralChanges({
                    ...behavioralChanges,
                    runningAimlessly: !behavioralChanges.runningAimlessly,
                  })
                }
              />{" "}
              Running Aimlessly
            </label>
            <label
              htmlFor="BitingInanimateObjects"
              className="block mb-2 font-medium"
            >
              <input
                className="w-4 h-4 text-darkgreen bg-gray-100 border-gray-300 rounded focus:ring-darkergreen dark:focus:ring-darkgreen dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="checkbox"
                id="BitingInanimateObjects"
                name="BitingInanimateObjects"
                value={behavioralChanges.bitingInanimateObjects}
                checked={behavioralChanges.bitingInanimateObjects === true}
                onChange={() =>
                  setBehavioralChanges({
                    ...behavioralChanges,
                    bitingInanimateObjects:
                      !behavioralChanges.bitingInanimateObjects,
                  })
                }
              />{" "}
              Biting Inanimate Objects
            </label>
            <label htmlFor="Hyperactivity" className="block mb-2 font-medium">
              <input
                className="w-4 h-4 text-darkgreen bg-gray-100 border-gray-300 rounded focus:ring-darkergreen dark:focus:ring-darkgreen dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="checkbox"
                id="Hyperactivity"
                name="Hyperactivity"
                value={behavioralChanges.hyperactivity}
                checked={behavioralChanges.hyperactivity === true}
                onChange={() =>
                  setBehavioralChanges({
                    ...behavioralChanges,
                    hyperactivity: !behavioralChanges.hyperactivity,
                  })
                }
              />{" "}
              Hyperactivity
            </label>
            <label htmlFor="Others" className="block mb-2 font-medium">
              <input
                className="w-4 h-4 text-darkgreen bg-gray-100 border-gray-300 rounded focus:ring-darkergreen dark:focus:ring-darkgreen dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="checkbox"
                id="Others"
                name="Others"
                value={behavioralChanges.others}
                checked={behavioralChanges.others === true}
                onChange={() =>
                  setBehavioralChanges({
                    ...behavioralChanges,
                    others: !behavioralChanges.others,
                  })
                }
              />{" "}
              Others
            </label>
          </div>
          {behavioralChanges.others && (
            <div>
              <label className="block mb-2 font-medium">
                Specify Behavioral Changes
              </label>
              <input
                type="text"
                name="SpecifyBehavioralChanges"
                value={behavioralChanges.specify}
                className="border w-full p-2 rounded"
                onChange={(e) =>
                  setBehavioralChanges({
                    ...behavioralChanges,
                    specify: e.target.value,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </>,
    <>
      <h3 className="text-lg font-bold mb-6">Victim Profile</h3>
      <div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              name="Name"
              value={victimName}
              className="border w-full p-2 rounded"
              onChange={(e) => setVictimName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Age</label>
            <input
              type="text"
              name="Age"
              value={victimAge}
              className="border w-full p-2 rounded"
              onChange={(e) => setVictimAge(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-medium capitalize text-gray-700">
              Sex:
            </label>
            <select
              value={sex} // Assuming `sex` is a state variable
              onChange={(e) => setSex(e.target.value)} // Update the state on change
              className="border w-full p-2 rounded focus:ring-2 focus:ring-darkgreen"
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-medium">Address</label>
          <input
            type="text"
            name="Address"
            value={victimAddress}
            className="border w-full p-2 rounded"
            onChange={(e) => setVictimAddress(e.target.value)}
          />
        </div>
      </div>
    </>,
    <>
      <h3 className="text-lg font-bold mb-7">Victim Profile</h3>
      <div className="border p-6 rounded-lg  mb-20 shadow-md bg-white space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Date of Bite</label>
            <input
              type="date"
              name="DateofBite"
              value={dateOfBite}
              className="border w-full p-2 rounded"
              onChange={(e) => setDateOfBite(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Time of Bite</label>
            <input
              type="time"
              name="TimeofBite"
              value={timeOfBite}
              className="border w-full p-2 rounded"
              onChange={(e) => setTimeOfBite(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Site of Bite</label>
            <select
              name="siteOfBite"
              value={siteOfBite}
              className="border w-full p-2 rounded"
              onChange={(e) => setSiteOfBite(e.target.value)}
            >
              <option value="" disabled>
                Select Site of Bite
              </option>
              <option value="head">Head</option>
              <option value="trunk">Trunk</option>
              <option value="lower_extremity">Lower Extremity</option>
              <option value="upper_extremity">Upper Extremity</option>
              <option value="back">Back</option>
              <option value="others">Others</option>
            </select>
          </div>
          {siteOfBite === "others" && (
            <div>
              <label className="block mb-2 font-medium">
                Specify Site of Bite
              </label>
              <input
                type="text"
                name="SpecifySiteofBite"
                value={siteOfBiteSpecify}
                className="border w-full p-2 rounded"
                onChange={(e) => setSiteOfBiteSpecify(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block mb-2 font-medium">Nature of Bite</label>
            <select
              name="NatureofBite"
              value={natureOfBite}
              className="border w-full p-2 rounded"
              onChange={(e) => setNatureOfBite(e.target.value)}
            >
              <option value="" disabled>
                Select Nature of Bite
              </option>
              <option value="scratch">Scratch</option>
              <option value="single">Single</option>
              <option value="moderate">Moderate</option>
              <option value="multiple">Multiple</option>
              <option value="bad">Bad</option>
              <option value="severe">Severe</option>
            </select>
          </div>
        </div>
      </div>
    </>,
    <>
      <h3 className="text-lg font-bold mb-6">Victim Profile</h3>
      <div className="border p-6 rounded-lg mb-8 shadow-md bg-white space-y-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Bite Provoked?</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="biteProvoked"
                  value="yes"
                  checked={biteProvoked === "yes"}
                  onChange={(e) => setBiteProvoked(e.target.value)}
                  className="mr-2"
                />{" "}
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="biteProvoked"
                  value="no"
                  checked={biteProvoked === "no"}
                  onChange={(e) => setBiteProvoked(e.target.value)}
                  className="mr-2"
                />{" "}
                No
              </label>
            </div>
          </div>
          {biteProvoked === "yes" && (
            <div className="col-span-2">
              <label className="block mb-2 font-medium">
                Specify Provocation
              </label>
              <input
                type="text"
                name="SpecifyProvocation"
                value={biteProvokedSpecify}
                className="border w-full p-2 rounded"
                onChange={(e) => setBiteProvokedSpecify(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block mb-2 font-medium">Location of Bite</label>
            <select
              name="locationOfBite"
              value={locationOfBite}
              className="border w-full p-2 rounded"
              onChange={(e) => setLocationOfBite(e.target.value)}
            >
              <option value="" disabled>
                Location of Bite
              </option>
              <option value="household">Household</option>
              <option value="neighbo">Neighbor</option>
              <option value="others">Others</option>
            </select>
          </div>
          {locationOfBite === "others" && (
            <div className="col-span-2">
              <label className="block mb-2 font-medium">
                Specify Location of Bite
              </label>
              <input
                type="text"
                name="SpecifyLocationofBite"
                value={locationOfBiteSpecify}
                className="border w-full p-2 rounded"
                onChange={(e) => setLocationOfBiteSpecify(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block mb-2 font-medium">
              {"Other Victims (if any)"}
            </label>
            <input
              type="text"
              name="SpecifyLocationofBite"
              value={otherVictims}
              className="border w-full p-2 rounded"
              onChange={(e) => setOtherVictims(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Treatment Received</label>
            <select
              name="TreatmentReceived"
              value={treatmentReceived}
              className="border w-full p-2 rounded"
              onChange={(e) => setTreatmentReceived(e.target.value)}
            >
              <option value="" disabled>
                Select Treatment Received
              </option>
              <option value="anti_rabies">Anti-Rabies</option>
              <option value="anti_tetanus">Anti-Tetanus</option>
              <option value="others">Others</option>
            </select>
          </div>
          {treatmentReceived === "others" && (
            <div className="col-span-2">
              <label className="block mb-2 font-medium">
                Specify Treatment
              </label>
              <input
                type="text"
                name="SpecifyTreatment"
                value={treatmentReceivedSpecify}
                className="border w-full p-2 rounded"
                onChange={(e) => setTreatmentReceivedSpecify(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block mb-2 font-medium">
              Date of Treatment Received
            </label>
            <input
              type="date"
              name="DateofTreatmentReceived"
              value={dateOfTreatmentReceived}
              className="border w-full p-2 rounded"
              onChange={(e) => setDateOfTreatmentReceived(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>,
  ];

  const renderStepContent = (steps) => {
    switch (steps) {
      case 0:
        return pages[0];
      case 1:
        return pages[1];
      case 2:
        return pages[2];
      case 3:
        return pages[3];
      case 4:
        return pages[4];
      case 5:
        return pages[5];
      case 6:
        return pages[6];
      default:
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Rabies History</h1>
      <div></div>
      <StepperComponent
        pages={pages}
        renderStepContent={renderStepContent}
        setStepperActiveStep={setStepperActiveStep}
      />
      <FormSubmit
        handleImportCSV={handleImportCSV}
        handleExportCSV={handleExportCSV}
        handleSubmit={handleSubmit}
      />
      {/* Error and Success Modals */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={modalMessage}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={modalMessage}
      />
    </>
  );
};

export default RabiesHistoryForm;
