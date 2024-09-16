import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import "./RabiesHistoryForm.css";
import Papa from 'papaparse';

const RabiesHistoryForm = () => {

  const [siteOfBiteSpecify, setSiteOfBiteSpecify] = useState('');

  const [locationOfBiteSpecify, setLocationOfBiteSpecify] = useState('');


  const [treatmentReceivedSpecify, setTreatmentReceivedSpecify] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [petManagement, setPetManagement] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [causeOfDeathSpecify, setCauseOfDeathSpecify] = useState('')
  const [vaccinationHistory, setVaccinationHistory] = useState('');
  const [bitchVaccinated, setBitchVaccinated] = useState('');
  const [contactWithAnimals, setContactWithAnimals] = useState('');

  const [vaccinationHistorySpecify, setVaccinationHistorySpecify] = useState('');
  const [bitchVaccinatedSpecify, setBitchVaccinatedSpecify] = useState('');

  const [contactLocationSpecify, setContactLocationSpecify] = useState('');
  const [contactLocation, setContactLocation] = useState('');

  const [siteOfBite, setSiteOfBite] = useState('');
  const [biteProvoked, setBiteProvoked] = useState('');
  const [locationOfBite, setLocationOfBite] = useState('');
  const [treatmentReceived, setTreatmentReceived] = useState('');

  // Additional states for new fields
  const [animalResidence, setAnimalResidence] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [timeOfDeath, setTimeOfDeath] = useState('');
  const [typeOfVaccine, setTypeOfVaccine] = useState('');
  const [dateOfLastVaccination, setDateOfLastVaccination] = useState('');
  const [durationIllnessFrom, setDurationIllnessFrom] = useState('');
  const [durationIllnessTo, setDurationIllnessTo] = useState('');
  const [behavioralChanges, setBehavioralChanges] = useState({
    restlessness: false,
    apprehensiveWatchfulLook: false,
    runningAimlessly: false,
    bitingInanimateObjects: false,
    hyperactivity: false,
    others: false,
    specify: ''
  });
  const [victimName, setVictimName] = useState('');
  const [victimAge, setVictimAge] = useState('');
  const [victimSex, setVictimSex] = useState('');
  const [victimAddress, setVictimAddress] = useState('');
  const [dateOfBite, setDateOfBite] = useState('');
  const [timeOfBite, setTimeOfBite] = useState('');
  const [siteOfBiteOther, setSiteOfBiteOther] = useState('');
  const [natureOfBite, setNatureOfBite] = useState('');
  const [biteProvokedSpecify, setBiteProvokedSpecify] = useState('');
  const [locationOfBiteOther, setLocationOfBiteOther] = useState('');
  const [otherVictims, setOtherVictims] = useState('');
  const [treatmentReceivedOther, setTreatmentReceivedOther] = useState('');
  const [dateOfTreatmentReceived, setDateOfTreatmentReceived] = useState('');

  // Submit handler function
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

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
      dateOfTreatmentReceived
    };

    try {
      console.log(formData)
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/RH`, formData);
      console.log('Form submitted successfully:', response.data);
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show an error message)
    }
  };

  // Function to handle importing CSV
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        // Assuming the first object is a valid form entry
        if (data.length > 0) {
          const formData = data[0];
          // Populate form fields with CSV data
          setAnimalResidence(formData.animalResidence || '');
          setSpecies(formData.species || '');
          setBreed(formData.breed || '');
          setSex(formData.sex || '');
          setAge(formData.age || '');
          setOwnershipType(formData.ownershipType || '');
          setPetManagement(formData.petManagement || '');
          setCauseOfDeath(formData.causeOfDeath || '');
          setCauseOfDeathSpecify(formData.causeOfDeathSpecify || '');
          setDateOfDeath(formData.dateOfDeath || '');
          setTimeOfDeath(formData.timeOfDeath || '');
          setVaccinationHistory(formData.vaccinationHistory || '');
          setVaccinationHistorySpecify(formData.vaccinationHistorySpecify || '');
          setTypeOfVaccine(formData.typeOfVaccine || '');
          setDateOfLastVaccination(formData.dateOfLastVaccination || '');
          setBitchVaccinated(formData.bitchVaccinated || '');
          setBitchVaccinatedSpecify(formData.bitchVaccinatedSpecify || '');
          setContactWithAnimals(formData.contactWithAnimals || '');
          setContactLocation(formData.contactLocation || '');
          setContactLocationSpecify(formData.contactLocationSpecify || '');
          setDurationIllnessFrom(formData.durationIllnessFrom || '');
          setDurationIllnessTo(formData.durationIllnessTo || '');
          setBehavioralChanges({
            restlessness: formData.behavioralChangesRestlessness || false,
            apprehensiveWatchfulLook: formData.behavioralChangesApprehensiveWatchfulLook || false,
            runningAimlessly: formData.behavioralChangesRunningAimlessly || false,
            bitingInanimateObjects: formData.behavioralChangesBitingInanimateObjects || false,
            hyperactivity: formData.behavioralChangesHyperactivity || false,
            others: formData.behavioralChangesOthers || false,
            specify: formData.behavioralChangesSpecify || ''
          });
          setVictimName(formData.victimName || '');
          setVictimAge(formData.victimAge || '');
          setVictimSex(formData.victimSex || '');
          setVictimAddress(formData.victimAddress || '');
          setDateOfBite(formData.dateOfBite || '');
          setTimeOfBite(formData.timeOfBite || '');
          setSiteOfBite(formData.siteOfBite || '');
          setSiteOfBiteSpecify(formData.siteOfBiteSpecify || '');
          setNatureOfBite(formData.natureOfBite || '');
          setBiteProvoked(formData.biteProvoked || '');
          setBiteProvokedSpecify(formData.biteProvokedSpecify || '');
          setLocationOfBite(formData.locationOfBite || '');
          setLocationOfBiteSpecify(formData.locationOfBiteSpecify || '');
          setOtherVictims(formData.otherVictims || '');
          setTreatmentReceived(formData.treatmentReceived || '');
          setTreatmentReceivedSpecify(formData.treatmentReceivedSpecify || '');
          setDateOfTreatmentReceived(formData.dateOfTreatmentReceived || '');
        }
      }
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
        causeOfDeathSpecify,
        dateOfDeath,
        timeOfDeath,
        vaccinationHistory,
        vaccinationHistorySpecify,
        typeOfVaccine,
        dateOfLastVaccination,
        bitchVaccinated,
        bitchVaccinatedSpecify,
        contactWithAnimals,
        contactLocation,
        contactLocationSpecify,
        durationIllnessFrom,
        durationIllnessTo,
        behavioralChangesRestlessness: behavioralChanges.restlessness,
        behavioralChangesApprehensiveWatchfulLook: behavioralChanges.apprehensiveWatchfulLook,
        behavioralChangesRunningAimlessly: behavioralChanges.runningAimlessly,
        behavioralChangesBitingInanimateObjects: behavioralChanges.bitingInanimateObjects,
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
        dateOfTreatmentReceived
      }
    ];

    const csv = Papa.unparse(csvData);

    // Create a Blob with CSV data and trigger a download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'form-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">

      <div>
        <label className="block mb-1 font-medium">Import CSV</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="text-xl font-semibold mb-4">Animal Profile</div>

      <div>
        <label className="block mb-1 font-medium">Residence of the Animal for the Last 15 Days</label>
        <input
          type="text"
          value={animalResidence}
          onChange={(e) => setAnimalResidence(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Species</label>
        <input
          type="text"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Breed</label>
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <span className="block mb-1 font-medium">Sex</span>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="male"
              checked={sex === 'male'}
              onChange={(e) => setSex(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="female"
              checked={sex === 'female'}
              onChange={(e) => setSex(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Female</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Age (in months)</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Type of Ownership</label>
        <select
          value={ownershipType}
          onChange={(e) => setOwnershipType(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="household_pet">Household Pet</option>
          <option value="pet_of_neighbor">Pet of Neighbor</option>
          <option value="stray_animal">Stray Animal</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Pet Management</label>
        <select
          value={petManagement}
          onChange={(e) => setPetManagement(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="confined">Confined</option>
          <option value="leashed">Leashed</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Cause of Death</label>
        <select
          value={causeOfDeath}
          onChange={(e) => setCauseOfDeath(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="euthanasia">Euthanasia</option>
          <option value="illness">Illness</option>
          <option value="accident">Accident</option>
          <option value="others">Others</option>
        </select>
        {causeOfDeath === 'others' && (
          <input
            type="text"
            value={causeOfDeathSpecify}
            onChange={(e) => setCauseOfDeathSpecify(e.target.value)}
            placeholder="Specify Cause of Death"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Date of Death</label>
        <input
          type="date"
          value={dateOfDeath}
          onChange={(e) => setDateOfDeath(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Time of Death</label>
        <input
          type="time"
          value={timeOfDeath}
          onChange={(e) => setTimeOfDeath(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Vaccination History</label>
        <select
          value={vaccinationHistory}
          onChange={(e) => setVaccinationHistory(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="rabies">Rabies</option>
          <option value="others">Others</option>
        </select>
        {vaccinationHistory === 'others' && (
          <input
            type="text"
            value={vaccinationHistorySpecify}
            onChange={(e) => setVaccinationHistorySpecify(e.target.value)}
            placeholder="Specify Vaccination"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Type of Vaccine</label>
        <input
          type="text"
          value={typeOfVaccine}
          onChange={(e) => setTypeOfVaccine(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Date of Last Vaccination</label>
        <input
          type="date"
          value={dateOfLastVaccination}
          onChange={(e) => setDateOfLastVaccination(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <span className="block mb-1 font-medium">Bitch Vaccinated (for puppies 3 months and below)?</span>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="yes"
              checked={bitchVaccinated === 'yes'}
              onChange={(e) => setBitchVaccinated(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="no"
              checked={bitchVaccinated === 'no'}
              onChange={(e) => setBitchVaccinated(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
        {bitchVaccinated === 'yes' && (
          <input
            type="text"
            value={bitchVaccinatedSpecify}
            onChange={(e) => setBitchVaccinatedSpecify(e.target.value)}
            placeholder="Specify"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div>
        <span className="block mb-1 font-medium">Contact with Other Animals?</span>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="yes"
              checked={contactWithAnimals === 'yes'}
              onChange={(e) => setContactWithAnimals(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="no"
              checked={contactWithAnimals === 'no'}
              onChange={(e) => setContactWithAnimals(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
        {contactWithAnimals === 'yes' && (
          <div>
            <label className="block mb-1 font-medium">Where?</label>
            <select
              value={contactLocation}
              onChange={(e) => setContactLocation(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="household">Household</option>
              <option value="neighbor">Neighbor</option>
              <option value="others">Others</option>
            </select>
            {contactLocation === 'others' && (
              <input
                type="text"
                value={contactLocationSpecify}
                onChange={(e) => setContactLocationSpecify(e.target.value)}
                placeholder="Specify Location"
                className="w-full border rounded p-2 mt-2"
              />
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">If Sick, Duration of Illness</label>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block mb-1 font-medium">From</label>
            <input
              type="date"
              value={durationIllnessFrom}
              onChange={(e) => setDurationIllnessFrom(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-medium">To</label>
            <input
              type="date"
              value={durationIllnessTo}
              onChange={(e) => setDurationIllnessTo(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      <div>
        <span className="block mb-1 font-medium">Behavioral Changes</span>
        <div className="flex flex-wrap space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={behavioralChanges.restlessness}
              onChange={() => setBehavioralChanges({ ...behavioralChanges, restlessness: !behavioralChanges.restlessness })}
              className="form-checkbox"
            />
            <span className="ml-2">Restlessness</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={behavioralChanges.apprehensiveWatchfulLook}
              onChange={() => setBehavioralChanges({ ...behavioralChanges, apprehensiveWatchfulLook: !behavioralChanges.apprehensiveWatchfulLook })}
              className="form-checkbox"
            />
            <span className="ml-2">Apprehensive Watchful Look</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={behavioralChanges.runningAimlessly}
              onChange={() => setBehavioralChanges({ ...behavioralChanges, runningAimlessly: !behavioralChanges.runningAimlessly })}
              className="form-checkbox"
            />
            <span className="ml-2">Running Aimlessly</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={behavioralChanges.bitingInanimateObjects}
              onChange={() => setBehavioralChanges({ ...behavioralChanges, bitingInanimateObjects: !behavioralChanges.bitingInanimateObjects })}
              className="form-checkbox"
            />
            <span className="ml-2">Biting Inanimate Objects</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={behavioralChanges.hyperactivity}
              onChange={() => setBehavioralChanges({ ...behavioralChanges, hyperactivity: !behavioralChanges.hyperactivity })}
              className="form-checkbox"
            />
            <span className="ml-2">Hyperactivity</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={behavioralChanges.others}
              onChange={() => setBehavioralChanges({ ...behavioralChanges, others: !behavioralChanges.others })}
              className="form-checkbox"
            />
            <span className="ml-2">Others</span>
          </label>
        </div>
        {behavioralChanges.others && (
          <input
            type="text"
            value={behavioralChanges.specify}
            onChange={(e) => setBehavioralChanges({ ...behavioralChanges, specify: e.target.value })}
            placeholder="Specify Behavioral Changes"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div className="text-xl font-semibold mb-4">Victim Profile</div>

      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={victimName}
          onChange={(e) => setVictimName(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Age</label>
        <input
          type="number"
          value={victimAge}
          onChange={(e) => setVictimAge(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <span className="block mb-1 font-medium">Sex</span>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="male"
              checked={victimSex === 'male'}
              onChange={(e) => setVictimSex(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="female"
              checked={victimSex === 'female'}
              onChange={(e) => setVictimSex(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Female</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Address</label>
        <input
          type="text"
          value={victimAddress}
          onChange={(e) => setVictimAddress(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Date of Bite</label>
        <input
          type="date"
          value={dateOfBite}
          onChange={(e) => setDateOfBite(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Time of Bite</label>
        <input
          type="time"
          value={timeOfBite}
          onChange={(e) => setTimeOfBite(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Site of Bite</label>
        <input
          type="text"
          value={siteOfBite}
          onChange={(e) => setSiteOfBite(e.target.value)}
          className="w-full border rounded p-2"
        />
        {siteOfBite && (
          <input
            type="text"
            value={siteOfBiteSpecify}
            onChange={(e) => setSiteOfBiteSpecify(e.target.value)}
            placeholder="Specify Site of Bite"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Nature of Bite</label>
        <input
          type="text"
          value={natureOfBite}
          onChange={(e) => setNatureOfBite(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Was the Bite Provoked?</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="yes"
              checked={biteProvoked === 'yes'}
              onChange={(e) => setBiteProvoked(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="no"
              checked={biteProvoked === 'no'}
              onChange={(e) => setBiteProvoked(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
        {biteProvoked === 'yes' && (
          <input
            type="text"
            value={biteProvokedSpecify}
            onChange={(e) => setBiteProvokedSpecify(e.target.value)}
            placeholder="Specify Provocation"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Location of Bite</label>
        <input
          type="text"
          value={locationOfBite}
          onChange={(e) => setLocationOfBite(e.target.value)}
          className="w-full border rounded p-2"
        />
        {locationOfBite && (
          <input
            type="text"
            value={locationOfBiteSpecify}
            onChange={(e) => setLocationOfBiteSpecify(e.target.value)}
            placeholder="Specify Location of Bite"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Any Other Victims?</label>
        <input
          type="text"
          value={otherVictims}
          onChange={(e) => setOtherVictims(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Treatment Received</label>
        <input
          type="text"
          value={treatmentReceived}
          onChange={(e) => setTreatmentReceived(e.target.value)}
          className="w-full border rounded p-2"
        />
        {treatmentReceived && (
          <input
            type="text"
            value={treatmentReceivedSpecify}
            onChange={(e) => setTreatmentReceivedSpecify(e.target.value)}
            placeholder="Specify Treatment"
            className="w-full border rounded p-2 mt-2"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Date of Treatment Received</label>
        <input
          type="date"
          value={dateOfTreatmentReceived}
          onChange={(e) => setDateOfTreatmentReceived(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Submit
      </button>

      <button
        type="button"
        onClick={handleExportCSV}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Export CSV
      </button>
    </form>
  );
};

export default RabiesHistoryForm;
