import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./VeterinaryQuarantineInspectionReport.css";

const initialFormState = {
  classification: "",
  carabao: "",
  cattle: "",
  horse: "",
  goat: "",
  sheep: "",
  swine: "",
  doc: "",
  pullet: "",
  culled: "",
  broiler: "",
  gameFowl: "",
  duck: "",
  dog: "",
  others: "",
};

function VeterinaryQuarantineInspectionReport() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleOpen = (index = null) => {
    if (index !== null) {
      // Set formData to the row data if editing
      setFormData(rows[index]);
      setCurrentIndex(index);
      setEditMode(true);
    } else {
      setFormData(initialFormState);
      setCurrentIndex(null);
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue =
      name !== "classification" && name !== "others"
        ? isNaN(value)
          ? ""
          : value
        : value;
    setFormData({ ...formData, [name]: numericValue });
  };

  const handleSave = () => {
    if (editMode && currentIndex !== null) {
      // Update existing row
      const updatedRows = [...rows];
      updatedRows[currentIndex] = formData;
      setRows(updatedRows);
    } else {
      // Add new row
      const existingRowIndex = rows.findIndex(
        (row) => row.classification === formData.classification
      );

      if (existingRowIndex > -1) {
        const updatedRows = [...rows];
        const existingRow = updatedRows[existingRowIndex];
        updatedRows[existingRowIndex] = {
          ...existingRow,
          carabao: (
            parseFloat(existingRow.carabao || 0) +
            parseFloat(formData.carabao || 0)
          ).toString(),
          cattle: (
            parseFloat(existingRow.cattle || 0) +
            parseFloat(formData.cattle || 0)
          ).toString(),
          horse: (
            parseFloat(existingRow.horse || 0) + parseFloat(formData.horse || 0)
          ).toString(),
          goat: (
            parseFloat(existingRow.goat || 0) + parseFloat(formData.goat || 0)
          ).toString(),
          sheep: (
            parseFloat(existingRow.sheep || 0) + parseFloat(formData.sheep || 0)
          ).toString(),
          swine: (
            parseFloat(existingRow.swine || 0) + parseFloat(formData.swine || 0)
          ).toString(),
          doc: (
            parseFloat(existingRow.doc || 0) + parseFloat(formData.doc || 0)
          ).toString(),
          pullet: (
            parseFloat(existingRow.pullet || 0) +
            parseFloat(formData.pullet || 0)
          ).toString(),
          culled: (
            parseFloat(existingRow.culled || 0) +
            parseFloat(formData.culled || 0)
          ).toString(),
          broiler: (
            parseFloat(existingRow.broiler || 0) +
            parseFloat(formData.broiler || 0)
          ).toString(),
          gameFowl: (
            parseFloat(existingRow.gameFowl || 0) +
            parseFloat(formData.gameFowl || 0)
          ).toString(),
          duck: (
            parseFloat(existingRow.duck || 0) + parseFloat(formData.duck || 0)
          ).toString(),
          dog: (
            parseFloat(existingRow.dog || 0) + parseFloat(formData.dog || 0)
          ).toString(),
          others: (
            parseFloat(existingRow.others || 0) +
            parseFloat(formData.others || 0)
          ).toString(),
        };
        setRows(updatedRows);
      } else {
        setRows([...rows, formData]);
      }
    }

    setFormData(initialFormState);
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 align="center"><b>Veterinary Quarantine Inspection Report</b></h1>

      <TextField
        label="Total Fees Collected/Remitted"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <TextField
        label="Total No. of Outgoing Shipment"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add
      </Button>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableCell align="center" colSpan={16}>
              Live Animals
            </TableCell>
            <TableRow>
              <TableCell rowSpan={2}>Classification</TableCell>
              <TableCell rowSpan={2}>Carabao (hds)</TableCell>
              <TableCell rowSpan={2}>Cattle (hds)</TableCell>
              <TableCell rowSpan={2}>Horse (hds)</TableCell>
              <TableCell rowSpan={2}>Goat (hds)</TableCell>
              <TableCell rowSpan={2}>Sheep (hds)</TableCell>
              <TableCell rowSpan={2}>Swine (hds)</TableCell>
              <TableCell colSpan={5} align="center">
                Chicken (hds)
              </TableCell>
              <TableCell rowSpan={2}>Duck (hds)</TableCell>
              <TableCell rowSpan={2}>Dog (hds)</TableCell>
              <TableCell rowSpan={2}>Others (Please Specify)</TableCell>
              <TableCell rowSpan={2}>Actions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>DOC</TableCell>
              <TableCell>Pullet</TableCell>
              <TableCell>Culled</TableCell>
              <TableCell>Broiler</TableCell>
              <TableCell>Game Fowl</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.classification}</TableCell>
                <TableCell>{row.carabao}</TableCell>
                <TableCell>{row.cattle}</TableCell>
                <TableCell>{row.horse}</TableCell>
                <TableCell>{row.goat}</TableCell>
                <TableCell>{row.sheep}</TableCell>
                <TableCell>{row.swine}</TableCell>
                <TableCell>{row.doc}</TableCell>
                <TableCell>{row.pullet}</TableCell>
                <TableCell>{row.culled}</TableCell>
                <TableCell>{row.broiler}</TableCell>
                <TableCell>{row.gameFowl}</TableCell>
                <TableCell>{row.duck}</TableCell>
                <TableCell>{row.dog}</TableCell>
                <TableCell>{row.others}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpen(index)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Total</TableCell>
              {[
                "carabao",
                "cattle",
                "horse",
                "goat",
                "sheep",
                "swine",
                "doc",
                "pullet",
                "culled",
                "broiler",
                "gameFowl",
                "duck",
                "dog",
                "others",
              ].map((key, index) => (
                <TableCell key={index}>
                  {rows.reduce(
                    (sum, row) => sum + parseFloat(row[key] || 0),
                    0
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell align="center" colSpan={14}>
              Animal By-Products
            </TableCell>

            <TableRow>
              <TableCell>Beef (kg)</TableCell>
              <TableCell>Carabeef (kg)</TableCell>
              <TableCell>Pork (kg)</TableCell>
              <TableCell>Cheval (kg)</TableCell>
              <TableCell>Chevon (kg)</TableCell>
              <TableCell>Mutton (kg)</TableCell>
              <TableCell>Poultry Meat (kg)</TableCell>
              <TableCell>Table Eggs (pcs)</TableCell>
              <TableCell>Embryonated Egg (pcs)</TableCell>
              <TableCell>Dung (bags)</TableCell>
              <TableCell>Others(Please Specify)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
        </Table>

        <TextField
          label="Total No. of Incoming Shipment"
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            maxHeight: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          <h2>{editMode ? "Edit Entry" : "Add New Entry"}</h2>
          <form>
            {Object.keys(initialFormState).map((key) => (
              <TextField
                key={key}
                label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                inputProps={
                  key !== "classification" && key !== "others"
                    ? { pattern: "[0-9]*" }
                    : {}
                }
              />
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
              sx={{ mt: 2 }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCancel}
              fullWidth
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default VeterinaryQuarantineInspectionReport;
