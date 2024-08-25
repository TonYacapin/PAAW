import React, { useState } from "react";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import "./DiseaseInvestigationForm.css"; // Import the CSS file

const DiseaseInvestigationForm = () => {
  // State for each table
  const [detailsRows, setDetailsRows] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [movementRows, setMovementRows] = useState([]);

  // State for modal
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTable, setCurrentTable] = useState("");
  const [newRowData, setNewRowData] = useState({});

  // State for form data
  const [status, setStatus] = useState("");
  const [premisesAffected, setPremisesAffected] = useState("");
  const [probableSourceOfInfection, setProbableSourceOfInfection] = useState("");
  const [controlMeasures, setControlMeasures] = useState("");
  const [natureOfDiagnosis, setNatureOfDiagnosis] = useState("");
  const [dateReported, setDateReported] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [placeAffected, setPlaceAffected] = useState("");
  const [dateOfVisit, setDateOfVisit] = useState("");
  const [investigator, setInvestigator] = useState("");
  const [tentativeDiagnosis, setTentativeDiagnosis] = useState("");
  const [finalDiagnosis, setFinalDiagnosis] = useState("");

  // Open dialog for adding a new row
  const openAddDialog = (table) => {
    setCurrentTable(table);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input change in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save new row data to the respective table
  const handleSaveRow = () => {
    if (currentTable === "details") {
      setDetailsRows([
        ...detailsRows,
        {
          no: detailsRows.length + 1,
          ...newRowData,
        },
      ]);
    } else if (currentTable === "history") {
      setHistoryRows([
        ...historyRows,
        {
          no: historyRows.length + 1,
          ...newRowData,
        },
      ]);
    } else if (currentTable === "movement") {
      setMovementRows([
        ...movementRows,
        {
          no: movementRows.length + 1,
          ...newRowData,
        },
      ]);
    }
    setNewRowData({});
    setOpenDialog(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <Grid container spacing={3}>
        {/* Radio Buttons */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <FormControlLabel value="new" control={<Radio />} label="New" />
              <FormControlLabel value="on-going" control={<Radio />} label="On-going" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Premises Affected</FormLabel>
            <RadioGroup
              value={premisesAffected}
              onChange={(e) => setPremisesAffected(e.target.value)}
            >
              <FormControlLabel value="backyard farm" control={<Radio />} label="Backyard Farm" />
              <FormControlLabel value="commercial farm" control={<Radio />} label="Commercial Farm" />
              <FormControlLabel value="semi-commercial" control={<Radio />} label="Semi-commercial" />
              <FormControlLabel value="holding yard" control={<Radio />} label="Holding Yard" />
              <FormControlLabel value="slaughterhouse" control={<Radio />} label="Slaughterhouse" />
              <FormControlLabel value="auction market" control={<Radio />} label="Auction Market" />
              <FormControlLabel value="stockyard" control={<Radio />} label="Stockyard" />
              <FormControlLabel value="others" control={<Radio />} label="Others" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Probable Source of Infection</FormLabel>
            <RadioGroup
              value={probableSourceOfInfection}
              onChange={(e) => setProbableSourceOfInfection(e.target.value)}
            >
              <FormControlLabel value="unknown or inconclusive" control={<Radio />} label="Unknown or Inconclusive" />
              <FormControlLabel value="introduction to new animal/s" control={<Radio />} label="Introduction to New Animal/s" />
              <FormControlLabel value="contact with infected animal/s" control={<Radio />} label="Contact with Infected Animal/s" />
              <FormControlLabel value="swill feeding" control={<Radio />} label="Swill Feeding" />
              <FormControlLabel value="fomites" control={<Radio />} label="Fomites" />
              <FormControlLabel value="vectors" control={<Radio />} label="Vectors" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Control Measures</FormLabel>
            <RadioGroup
              value={controlMeasures}
              onChange={(e) => setControlMeasures(e.target.value)}
            >
              <FormControlLabel value="no control measures" control={<Radio />} label="No Control Measures" />
              <FormControlLabel value="quarantine" control={<Radio />} label="Quarantine" />
              <FormControlLabel value="vaccination in response to outbreak" control={<Radio />} label="Vaccination in Response to Outbreak" />
              <FormControlLabel value="disinfection of infected premises" control={<Radio />} label="Disinfection of Infected Premises" />
              <FormControlLabel value="stamping out" control={<Radio />} label="Stamping Out" />
              <FormControlLabel value="modified stamping out" control={<Radio />} label="Modified Stamping Out" />
              <FormControlLabel value="control of vectors" control={<Radio />} label="Control of Vectors" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Nature of Diagnosis</FormLabel>
            <RadioGroup
              value={natureOfDiagnosis}
              onChange={(e) => setNatureOfDiagnosis(e.target.value)}
            >
              <FormControlLabel value="farmer's report" control={<Radio />} label="Farmer's Report" />
              <FormControlLabel value="clinical signs/lesions" control={<Radio />} label="Clinical Signs/Lesions" />
              <FormControlLabel value="history" control={<Radio />} label="History" />
              <FormControlLabel value="laboratory test" control={<Radio />} label="Laboratory Test" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Text Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date Reported"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={dateReported}
            onChange={(e) => setDateReported(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date Started"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={dateStarted}
            onChange={(e) => setDateStarted(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Place Affected"
            fullWidth
            value={placeAffected}
            onChange={(e) => setPlaceAffected(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Date of Visit"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={dateOfVisit}
            onChange={(e) => setDateOfVisit(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Investigator"
            fullWidth
            value={investigator}
            onChange={(e) => setInvestigator(e.target.value)}
          />
        </Grid>

        {/* Tables */}
        {/* Details Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="details table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Species</TableCell>
                  <TableCell>Sex</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Population</TableCell>
                  <TableCell>Cases</TableCell>
                  <TableCell>Deaths</TableCell>
                  <TableCell>Destroyed</TableCell>
                  <TableCell>Slaughtered</TableCell>
                  <TableCell>Vaccine History</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailsRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.species}</TableCell>
                    <TableCell>{row.sex}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.population}</TableCell>
                    <TableCell>{row.cases}</TableCell>
                    <TableCell>{row.deaths}</TableCell>
                    <TableCell>{row.destroyed}</TableCell>
                    <TableCell>{row.slaughtered}</TableCell>
                    <TableCell>{row.vaccineHistory}</TableCell>
                    <TableCell>{row.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openAddDialog("details")}
            style={{ marginTop: "10px" }}
          >
            Add Details Row
          </Button>
        </Grid>

        {/* History Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="history table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openAddDialog("history")}
            style={{ marginTop: "10px" }}
          >
            Add History Row
          </Button>
        </Grid>

        {/* Movement Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="movement table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Mode (In/Out)</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Barangay</TableCell>
                  <TableCell>Municipality</TableCell>
                  <TableCell>Province</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movementRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.barangay}</TableCell>
                    <TableCell>{row.municipality}</TableCell>
                    <TableCell>{row.province}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openAddDialog("movement")}
            style={{ marginTop: "10px" }}
          >
            Add Movement Row
          </Button>
        </Grid>

        {/* Signature Sections */}
        <Grid item xs={12}>
          <div>
            <strong>Signature Over Printed Name:</strong>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div>
            <strong>Head/Supervisor:</strong>
          </div>
        </Grid>
      </Grid>

      {/* Modal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
          {currentTable === "details" && (
            <>
              <TextField
                label="Species"
                name="species"
                fullWidth
                margin="normal"
                value={newRowData.species || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Sex"
                name="sex"
                fullWidth
                margin="normal"
                value={newRowData.sex || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Age"
                name="age"
                fullWidth
                margin="normal"
                value={newRowData.age || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Population"
                name="population"
                fullWidth
                margin="normal"
                value={newRowData.population || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Cases"
                name="cases"
                fullWidth
                margin="normal"
                value={newRowData.cases || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Deaths"
                name="deaths"
                fullWidth
                margin="normal"
                value={newRowData.deaths || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Destroyed"
                name="destroyed"
                fullWidth
                margin="normal"
                value={newRowData.destroyed || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Slaughtered"
                name="slaughtered"
                fullWidth
                margin="normal"
                value={newRowData.slaughtered || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Vaccine History"
                name="vaccineHistory"
                fullWidth
                margin="normal"
                value={newRowData.vaccineHistory || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Remarks"
                name="remarks"
                fullWidth
                margin="normal"
                value={newRowData.remarks || ""}
                onChange={handleInputChange}
              />
            </>
          )}
          {currentTable === "history" && (
            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              value={newRowData.description || ""}
              onChange={handleInputChange}
            />
          )}
          {currentTable === "movement" && (
            <>
              <TextField
                label="Date"
                name="date"
                fullWidth
                margin="normal"
                value={newRowData.date || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Mode (In/Out)"
                name="mode"
                fullWidth
                margin="normal"
                value={newRowData.mode || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Type"
                name="type"
                fullWidth
                margin="normal"
                value={newRowData.type || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Barangay"
                name="barangay"
                fullWidth
                margin="normal"
                value={newRowData.barangay || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Municipality"
                name="municipality"
                fullWidth
                margin="normal"
                value={newRowData.municipality || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Province"
                name="province"
                fullWidth
                margin="normal"
                value={newRowData.province || ""}
                onChange={handleInputChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveRow} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default DiseaseInvestigationForm;
