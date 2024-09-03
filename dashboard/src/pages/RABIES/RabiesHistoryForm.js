import React, { useState } from 'react';
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
import "./RabiesHistoryForm.css"

const RabiesHistoryForm = () => {
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

  return (
    <>
    <Navbar/>
    <form>
      <Grid container spacing={2}>
        {/* Animal Details Form */}
        <Grid item xs={12}>
          <Typography variant="h6">Animal Profile</Typography>
        </Grid>

        {/* Residence of the Animal */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Residence of the Animal for the Last 15 Days"
            variant="outlined"
          />
        </Grid>

        {/* Species */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Species"
            variant="outlined"
          />
        </Grid>

        {/* Breed */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Breed"
            variant="outlined"
          />
        </Grid>

        {/* Sex */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Sex</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Age */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Age (in months)"
            variant="outlined"
          />
        </Grid>

        {/* Type of Ownership */}
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

        {/* Pet Management */}
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

        {/* Cause of Death */}
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

        {/* Date of Death */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of Death"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>

        {/* Time of Death */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Time of Death"
            type="time"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>

        {/* Vaccination History */}
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

        {/* Type of Vaccine */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Type of Vaccine"
            variant="outlined"
          />
        </Grid>

        {/* Date of Last Vaccination */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of Last Vaccination"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>

        {/* Bitch Vaccinated (for puppies 3 months and below)? */}
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

        {/* Contact with Other Animals? */}
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

        {/* If sick, Duration of Illness */}
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
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="To"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>

        {/* Behavioral Changes */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Behavioral Changes</FormLabel>
            <FormGroup row>
              <FormControlLabel control={<Checkbox />} label="None" />
              <FormControlLabel control={<Checkbox />} label="Restlessness" />
              <FormControlLabel control={<Checkbox />} label="Apprehensive Watchful Look" />
              <FormControlLabel control={<Checkbox />} label="Running Aimlessly" />
              <FormControlLabel control={<Checkbox />} label="Biting Inanimate Objects" />
              <FormControlLabel control={<Checkbox />} label="Hyperactivity" />
              <FormControlLabel control={<Checkbox />} label="Others" />
            </FormGroup>
            <TextField
              fullWidth
              label="Specify Behavioral Changes"
              variant="outlined"
              margin="normal"
            />
          </FormControl>
        </Grid>

        {/* Victim Profile Form */}
        <Grid item xs={12}>
          <Typography variant="h6">Victim Profile</Typography>
        </Grid>

        {/* Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
          />
        </Grid>

        {/* Age */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Age"
            variant="outlined"
          />
        </Grid>

        {/* Sex */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Sex</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
          />
        </Grid>

        {/* Date of Bite */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of Bite"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>

        {/* Time of Bite */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Time of Bite"
            type="time"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>

        {/* Site of Bite */}
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
              />
            )}
          </FormControl>
        </Grid>

        {/* Nature of Bite */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Nature of Bite</InputLabel>
            <Select
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

        {/* Bite Provoked */}
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
              />
            )}
          </FormControl>
        </Grid>

        {/* Location of Bite */}
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
              />
            )}
          </FormControl>
        </Grid>

        {/* Other Victims */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Other Victims (if any)"
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>

        {/* Treatment Received */}
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
              />
            )}
          </FormControl>
        </Grid>

        {/* Date of Treatment Received */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of Treatment Received"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>
      </Grid>


      <Button variant="contained" color="primary" style={{ marginTop: 50 }}>
    Save
  </Button>
    </form>
    </>
    
  );
};

export default RabiesHistoryForm;
