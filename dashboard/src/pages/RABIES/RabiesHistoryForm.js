import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Checkbox,
  FormGroup,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import "./RabiesHistoryForm.css";
import StepperComponent, {
  StepperActiveStep,
} from "../../component/StepperComponent";
import Papa from "papaparse";
import FormSubmit from "../../component/FormSubmit";

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
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/RH`,
        formData
      );
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
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
            <label className="block mb-2 font-medium">Status:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sex"
                  value="male"
                  checked={sex === "male"}
                  onChange={(e) => setSex(e.target.value)}
                  className="mr-2"
                />{" "}
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sex"
                  value="female"
                  checked={sex === "female"}
                  onChange={(e) => setSex(e.target.value)}
                  className="mr-2"
                />{" "}
                Female
              </label>
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
            <label className="block mb-2 font-medium">Farm Type:</label>
            <select
              name="farmType"
              value={ownershipType}
              className="border w-full p-2 rounded"
              onChange={(e) => setOwnershipType(e.target.value)}
            >
              <option value="" disabled>
                Type of Ownership
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
      <Grid item xs={12}>
        <Typography variant="h6">Animal Profile - Page 2</Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Pet Management</InputLabel>
          <Select
            value={petManagement}
            onChange={(e) => setPetManagement(e.target.value)}
            label="Pet Management"
          >
            <MenuItem value="confined">Confined</MenuItem>
            <MenuItem value="leashed">Leashed</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Cause of Death</InputLabel>
          <Select
            value={causeOfDeath}
            onChange={(e) => setCauseOfDeath(e.target.value)}
            label="Cause of Death"
          >
            <MenuItem value="euthanasia">Euthanasia</MenuItem>
            <MenuItem value="illness">Illness</MenuItem>
            <MenuItem value="accident">Accident</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date of Death"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={dateOfDeath}
          onChange={(e) => setDateOfDeath(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Time of Death"
          type="time"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={timeOfDeath}
          onChange={(e) => setTimeOfDeath(e.target.value)}
        />
      </Grid>
    </>,

    <>
      <Grid item xs={12}>
        <Typography variant="h6">Animal Profile - Page 3</Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Vaccination History</InputLabel>
          <Select
            value={vaccinationHistory}
            onChange={(e) => setVaccinationHistory(e.target.value)}
            label="Vaccination History"
          >
            <MenuItem value="rabies">Rabies</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Type of Vaccine"
          variant="outlined"
          value={typeOfVaccine}
          onChange={(e) => setTypeOfVaccine(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date of Last Vaccination"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={dateOfLastVaccination}
          onChange={(e) => setDateOfLastVaccination(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Bitch Vaccinated (for puppies 3 months and below)?
          </FormLabel>
          <RadioGroup
            row
            value={bitchVaccinated}
            onChange={(e) => setBitchVaccinated(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Contact with Other Animals?</FormLabel>
          <RadioGroup
            row
            value={contactWithAnimals}
            onChange={(e) => setContactWithAnimals(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </>,
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Animal Profile - Page 4</Typography>
      </Grid>

      {contactWithAnimals === "yes" && (
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Where?</InputLabel>
            <Select
              value={contactLocation}
              onChange={(e) => setContactLocation(e.target.value)}
              label="Where?"
            >
              <MenuItem value="household">Household</MenuItem>
              <MenuItem value="neighbor">Neighbor</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body1">If Sick, Duration of Illness</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="From"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={durationIllnessFrom}
          onChange={(e) => setDurationIllnessFrom(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="To"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={durationIllnessTo}
          onChange={(e) => setDurationIllnessTo(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Behavioral Changes</FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={behavioralChanges.restlessness}
                  onChange={() =>
                    setBehavioralChanges({
                      ...behavioralChanges,
                      restlessness: !behavioralChanges.restlessness,
                    })
                  }
                />
              }
              label="Restlessness"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={behavioralChanges.apprehensiveWatchfulLook}
                  onChange={() =>
                    setBehavioralChanges({
                      ...behavioralChanges,
                      apprehensiveWatchfulLook:
                        !behavioralChanges.apprehensiveWatchfulLook,
                    })
                  }
                />
              }
              label="Apprehensive Watchful Look"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={behavioralChanges.runningAimlessly}
                  onChange={() =>
                    setBehavioralChanges({
                      ...behavioralChanges,
                      runningAimlessly: !behavioralChanges.runningAimlessly,
                    })
                  }
                />
              }
              label="Running Aimlessly"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={behavioralChanges.bitingInanimateObjects}
                  onChange={() =>
                    setBehavioralChanges({
                      ...behavioralChanges,
                      bitingInanimateObjects:
                        !behavioralChanges.bitingInanimateObjects,
                    })
                  }
                />
              }
              label="Biting Inanimate Objects"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={behavioralChanges.hyperactivity}
                  onChange={() =>
                    setBehavioralChanges({
                      ...behavioralChanges,
                      hyperactivity: !behavioralChanges.hyperactivity,
                    })
                  }
                />
              }
              label="Hyperactivity"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={behavioralChanges.others}
                  onChange={() =>
                    setBehavioralChanges({
                      ...behavioralChanges,
                      others: !behavioralChanges.others,
                    })
                  }
                />
              }
              label="Others"
            />
          </FormGroup>
          {behavioralChanges.others && (
            <TextField
              fullWidth
              label="Specify Behavioral Changes"
              variant="outlined"
              margin="normal"
              value={behavioralChanges.specify}
              onChange={(e) =>
                setBehavioralChanges({
                  ...behavioralChanges,
                  specify: e.target.value,
                })
              }
            />
          )}
        </FormControl>
      </Grid>
    </>,
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Victim Profile - Page 1</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={victimName}
          onChange={(e) => setVictimName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Age"
          variant="outlined"
          value={victimAge}
          onChange={(e) => setVictimAge(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Sex</FormLabel>
          <RadioGroup
            row
            value={victimSex}
            onChange={(e) => setVictimSex(e.target.value)}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          value={victimAddress}
          onChange={(e) => setVictimAddress(e.target.value)}
        />
      </Grid>
    </>,
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Victim Profile - Page 2</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date of Bite"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={dateOfBite}
          onChange={(e) => setDateOfBite(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Time of Bite"
          type="time"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={timeOfBite}
          onChange={(e) => setTimeOfBite(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Site of Bite</InputLabel>
          <Select
            value={siteOfBite}
            onChange={(e) => setSiteOfBite(e.target.value)}
            label="Site of Bite"
          >
            <MenuItem value="head">Head</MenuItem>
            <MenuItem value="trunk">Trunk</MenuItem>
            <MenuItem value="lower_extremity">Lower Extremity</MenuItem>
            <MenuItem value="upper_extremity">Upper Extremity</MenuItem>
            <MenuItem value="back">Back</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        </FormControl>
        {siteOfBite === "others" && (
          <TextField
            fullWidth
            label="Specify Site of Bite"
            variant="outlined"
            margin="normal"
            value={siteOfBiteSpecify}
            onChange={(e) => setSiteOfBiteSpecify(e.target.value)}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Nature of Bite</InputLabel>
          <Select
            value={natureOfBite}
            onChange={(e) => setNatureOfBite(e.target.value)}
            label="Nature of Bite"
          >
            <MenuItem value="scratch">Scratch</MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="multiple">Multiple</MenuItem>
            <MenuItem value="bad">Bad</MenuItem>
            <MenuItem value="severe">Severe</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </>,
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Victim Profile - Page 3</Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Bite Provoked?</FormLabel>
          <RadioGroup
            row
            value={biteProvoked}
            onChange={(e) => setBiteProvoked(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        {biteProvoked === "yes" && (
          <TextField
            fullWidth
            label="Specify Provocation"
            variant="outlined"
            margin="normal"
            value={biteProvokedSpecify}
            onChange={(e) => setBiteProvokedSpecify(e.target.value)}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Location of Bite</InputLabel>
          <Select
            value={locationOfBite}
            onChange={(e) => setLocationOfBite(e.target.value)}
            label="Location of Bite"
          >
            <MenuItem value="household">Household</MenuItem>
            <MenuItem value="neighborhood">Neighborhood</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        </FormControl>
        {locationOfBite === "others" && (
          <TextField
            fullWidth
            label="Specify Location of Bite"
            variant="outlined"
            margin="normal"
            value={locationOfBiteSpecify}
            onChange={(e) => setLocationOfBiteSpecify(e.target.value)}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Other Victims (if any)"
          variant="outlined"
          multiline
          rows={2}
          value={otherVictims}
          onChange={(e) => setOtherVictims(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Treatment Received</InputLabel>
          <Select
            value={treatmentReceived}
            onChange={(e) => setTreatmentReceived(e.target.value)}
            label="Treatment Received"
          >
            <MenuItem value="anti_rabies">Anti-Rabies</MenuItem>
            <MenuItem value="anti_tetanus">Anti-Tetanus</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        </FormControl>
        {treatmentReceived === "others" && (
          <TextField
            fullWidth
            label="Specify Treatment"
            variant="outlined"
            margin="normal"
            value={treatmentReceivedSpecify}
            onChange={(e) => setTreatmentReceivedSpecify(e.target.value)}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date of Treatment Received"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={dateOfTreatmentReceived}
          onChange={(e) => setDateOfTreatmentReceived(e.target.value)}
        />
      </Grid>
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
      <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      <FormSubmit handleImportCSV={handleImportCSV} handleExportCSV={handleExportCSV} handleSubmit={handleSubmit} />
      {/* <div className="flex flex-row">
        <label htmlFor="fileinput">
          <div className="bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen">
            Load Form Progress
          </div>
          <input
            id="fileinput"
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            style={{ display: "none" }}
          />
        </label>
        <div className="grow" />
        <div className="flex space-x-4">
          <button
            onClick={handleExportCSV}
            className="bg-pastelyellow text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Save Form As CSV
          </button>
          <button
            onClick={handleSubmit}
            className="bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen"
          >
            Submit Form
          </button>
        </div>
      </div> */}

      {/* <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={handleSubmit}
      >
        Submit
      </Button>

      <button
        type="button"
        onClick={handleExportCSV}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Export CSV
      </button> */}
    </>
  );
};

export default RabiesHistoryForm;
