import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
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
  Button
} from '@mui/material';
import Navbar from '../../component/Navbar';
import "./RabiesHistoryForm.css";

const RabiesHistoryForm = () => {

  const [siteOfBiteSpecify, setSiteOfBiteSpecify] = useState('');

  const [locationOfBiteSpecify, setLocationOfBiteSpecify] = useState('');


  const [treatmentReceivedSpecify, setTreatmentReceivedSpecify] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [petManagement, setPetManagement] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [vaccinationHistory, setVaccinationHistory] = useState('');
  const [bitchVaccinated, setBitchVaccinated] = useState('');
  const [contactWithAnimals, setContactWithAnimals] = useState('');
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

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Animal Details Form */}
          <Grid item xs={12}>
            <Typography variant="h6">Animal Profile</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Residence of the Animal for the Last 15 Days"
              variant="outlined"
              value={animalResidence}
              onChange={(e) => setAnimalResidence(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Species"
              variant="outlined"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Breed"
              variant="outlined"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Sex</FormLabel>
              <RadioGroup
                row
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Age (in months)"
              variant="outlined"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Type of Ownership</InputLabel>
              <Select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value)}
                label="Type of Ownership"
              >
                <MenuItem value="household_pet">Household Pet</MenuItem>
                <MenuItem value="pet_of_neighbor">Pet of Neighbor</MenuItem>
                <MenuItem value="stray_animal">Stray Animal</MenuItem>
              </Select>
            </FormControl>
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
              {causeOfDeath === 'others' && (
                <TextField
                  fullWidth
                  label="Specify Cause of Death"
                  variant="outlined"
                  margin="normal"
                />
              )}
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
              {vaccinationHistory === 'others' && (
                <TextField
                  fullWidth
                  label="Specify Vaccination"
                  variant="outlined"
                  margin="normal"
                />
              )}
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
              <FormLabel component="legend">Bitch Vaccinated (for puppies 3 months and below)?</FormLabel>
              <RadioGroup
                row
                value={bitchVaccinated}
                onChange={(e) => setBitchVaccinated(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {bitchVaccinated === 'yes' && (
                <TextField
                  fullWidth
                  label="Specify"
                  variant="outlined"
                  margin="normal"
                />
              )}
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
              {contactWithAnimals === 'yes' && (
                <FormControl fullWidth variant="outlined" margin="normal">
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
                  {contactLocation === 'others' && (
                    <TextField
                      fullWidth
                      label="Specify Location"
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                </FormControl>
              )}
            </FormControl>
          </Grid>

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
                  control={<Checkbox checked={behavioralChanges.restlessness} onChange={() => setBehavioralChanges({ ...behavioralChanges, restlessness: !behavioralChanges.restlessness })} />}
                  label="Restlessness"
                />
                <FormControlLabel
                  control={<Checkbox checked={behavioralChanges.apprehensiveWatchfulLook} onChange={() => setBehavioralChanges({ ...behavioralChanges, apprehensiveWatchfulLook: !behavioralChanges.apprehensiveWatchfulLook })} />}
                  label="Apprehensive Watchful Look"
                />
                <FormControlLabel
                  control={<Checkbox checked={behavioralChanges.runningAimlessly} onChange={() => setBehavioralChanges({ ...behavioralChanges, runningAimlessly: !behavioralChanges.runningAimlessly })} />}
                  label="Running Aimlessly"
                />
                <FormControlLabel
                  control={<Checkbox checked={behavioralChanges.bitingInanimateObjects} onChange={() => setBehavioralChanges({ ...behavioralChanges, bitingInanimateObjects: !behavioralChanges.bitingInanimateObjects })} />}
                  label="Biting Inanimate Objects"
                />
                <FormControlLabel
                  control={<Checkbox checked={behavioralChanges.hyperactivity} onChange={() => setBehavioralChanges({ ...behavioralChanges, hyperactivity: !behavioralChanges.hyperactivity })} />}
                  label="Hyperactivity"
                />
                <FormControlLabel
                  control={<Checkbox checked={behavioralChanges.others} onChange={() => setBehavioralChanges({ ...behavioralChanges, others: !behavioralChanges.others })} />}
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
                  onChange={(e) => setBehavioralChanges({ ...behavioralChanges, specify: e.target.value })}
                />
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Victim Profile</Typography>
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
                <FormControlLabel value="female" control={<Radio />} label="Female" />
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
              {siteOfBite === 'others' && (
                <TextField
                  fullWidth
                  label="Specify Site of Bite"
                  variant="outlined"
                  margin="normal"
                  value={siteOfBiteSpecify}
                  onChange={(e) => setSiteOfBiteSpecify(e.target.value)}
                />
              )}
            </FormControl>
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
              {biteProvoked === 'yes' && (
                <TextField
                  fullWidth
                  label="Specify Provocation"
                  variant="outlined"
                  margin="normal"
                  value={biteProvokedSpecify}
                  onChange={(e) => setBiteProvokedSpecify(e.target.value)}
                />
              )}
            </FormControl>
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
              {locationOfBite === 'others' && (
                <TextField
                  fullWidth
                  label="Specify Location of Bite"
                  variant="outlined"
                  margin="normal"
                  value={locationOfBiteSpecify}
                  onChange={(e) => setLocationOfBiteSpecify(e.target.value)}
                />
              )}
            </FormControl>
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
              {treatmentReceived === 'others' && (
                <TextField
                  fullWidth
                  label="Specify Treatment"
                  variant="outlined"
                  margin="normal"
                  value={treatmentReceivedSpecify}
                  onChange={(e) => setTreatmentReceivedSpecify(e.target.value)}
                />
              )}
            </FormControl>
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
        </Grid>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: 50 }}
        >
          Save
        </Button>
      </form>
    </>
  );
};

export default RabiesHistoryForm;
