import React, { useState } from "react";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import "./RoutineServicesMonitoringReport.css"; // Import CSS file

const RoutineServicesMonitoringReport = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    barangay: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    contactNumber: "",
    species: "",
    sex: "",
    age: "",
    animalRegistered: "",
    noOfHeads: "",
    activity: "",
    remark: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setRows([...rows, formData]);
    handleClose();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" className="underlined-title">
        Routine Services Monitoring Report
      </Typography>
      <Grid container spacing={2}>
        {/* Text Fields */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Province" variant="outlined" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Municipality" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Reporting Period" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Livestock Technician"
            variant="outlined"
          />
        </Grid>

        {/* Add Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add
          </Button>
        </Grid>

        {/* Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Barangay</TableCell>
                  <TableCell>Client Information</TableCell>
                  <TableCell>Animal Information</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Remark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.barangay}</TableCell>
                    <TableCell>
                      <div>First Name: {row.firstName}</div>
                      <div>Last Name: {row.lastName}</div>
                      <div>Gender: {row.gender}</div>
                      <div>Birthday: {row.birthday}</div>
                      <div>Contact Number: {row.contactNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div>Species: {row.species}</div>
                      <div>Sex: {row.sex}</div>
                      <div>Age: {row.age}</div>
                      <div>Animal Registered: {row.animalRegistered}</div>
                      <div>No. of Heads: {row.noOfHeads}</div>
                    </TableCell>
                    <TableCell>{row.activity}</TableCell>
                    <TableCell>{row.remark}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Signature Section */}
      <Box sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <div className="underlined-title">
            Signature Over Printed Name
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="underlined-title">
            Head/Supervisor
          </div>
        </Grid>
      </Box>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Client Information */}
            <Grid item xs={12}>
              <Typography variant="h6">Client Information</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                variant="outlined"
                value={formData.date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Barangay"
                name="barangay"
                variant="outlined"
                value={formData.barangay}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Birthday"
                name="birthday"
                variant="outlined"
                value={formData.birthday}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                variant="outlined"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </Grid>

            {/* Animal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Animal Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Species"
                name="species"
                variant="outlined"
                value={formData.species}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sex"
                name="sex"
                variant="outlined"
                value={formData.sex}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                variant="outlined"
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                row
                name="animalRegistered"
                value={formData.animalRegistered}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="No. of Heads"
                name="noOfHeads"
                variant="outlined"
                value={formData.noOfHeads}
                onChange={handleChange}
              />
            </Grid>

            {/* Activity Dropdown */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Activity
              </Typography>
              <Select
                fullWidth
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="deworming">Deworming</MenuItem>
                <MenuItem value="wound treatment">Wound Treatment</MenuItem>
                <MenuItem value="vitamin supplementation">
                  Vitamin Supplementation
                </MenuItem>
                <MenuItem value="iron supplementation">
                  Iron Supplementation
                </MenuItem>
                <MenuItem value="consultation">Consultation</MenuItem>
                <MenuItem value="support">Support</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remark"
                name="remark"
                variant="outlined"
                value={formData.remark}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoutineServicesMonitoringReport;
