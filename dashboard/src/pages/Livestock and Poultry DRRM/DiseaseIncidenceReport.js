import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import "./DiseaseIncidenceReport.css"; // Ensure this file exists and is styled correctly

const DiseaseIncidenceReport = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleNameChange = (event) => setName(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);

  return (
    <>
      <div className="title">
        Disease Surveillance and Incidence Report
      </div>
      <TableContainer component={Paper} className="table-container">
        <Table
          size="small"
          aria-label="disease incidence report"
          className="table"
        >
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-cell" align="center" rowSpan={2}>
                Species/Disease
              </TableCell>
              <TableCell className="table-cell" align="center" colSpan={3}>
                Number of Cases
              </TableCell>
              <TableCell className="table-cell" align="center" colSpan={4}>
                Intervention
              </TableCell>
              <TableCell className="table-cell" align="center" rowSpan={2}>
                Specified Area
              </TableCell>
            </TableRow>
            <TableRow className="table-header-row">
              <TableCell className="table-cell" align="center">
                Occurrence
              </TableCell>
              <TableCell className="table-cell" align="center">
                Morbidity
              </TableCell>
              <TableCell className="table-cell" align="center">
                Mortality
              </TableCell>
              <TableCell className="table-cell" align="center">
                Disinfection
              </TableCell>
              <TableCell className="table-cell" align="center">
                Quarantine
              </TableCell>
              <TableCell className="table-cell" align="center">
                Vector Control
              </TableCell>
              <TableCell className="table-cell" align="center">
                None
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Animal Categories and Diseases */}
            {[
              { category: "Avian Poultry", diseases: [
                "Avian Influenza",
                "Newcastle Disease (ND)"
              ]},
              { category: "Swine", diseases: [
                "Foot and Mouth Disease",
                "Classical Swine Fever"
              ]},
              { category: "Cattle", diseases: [
                "Blackleg",
                "Anthrax",
                "Foot and Mouth Disease (FMD)",
                "Hemorrhagic Septicemia",
                "Surra"
              ]},
              { category: "Carabao", diseases: [
                "Anthrax",
                "Foot and Mouth Disease (FMD)",
                "Hemorrhagic Septicemia",
                "Surra"
              ]},
              { category: "Goat", diseases: [
                "Rabies",
                "Anthrax",
                "Foot and Mouth Disease (FMD)",
                "Hemorrhagic Septicemia",
                "Caprine Arthritis Encephalitis (CAE)"
              ]},
              { category: "Sheep", diseases: [
                "Anthrax",
                "Foot and Mouth Disease (FMD)",
                "Hemorrhagic Septicemia",
                "Caprine Arthritis Encephalitis (CAE)"
              ]},
              { category: "Dog", diseases: ["Rabies"]},
              { category: "Cat", diseases: ["Rabies"]}
            ].map((item, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell
                    className="table-cell-body"
                    align="left"
                    colSpan={9}
                    style={{ fontWeight: "bold" }}
                  >
                    {item.category}
                  </TableCell>
                </TableRow>
                {item.diseases.map((disease, i) => (
                  <TableRow key={i}>
                    <TableCell className="table-cell-body" align="left">
                      {disease}
                    </TableCell>
                    {/* Empty Cells for Number of Cases and Intervention */}
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j} className="table-cell-body" align="center"></TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4} p={2} borderTop="1px solid #ccc">
        <Typography variant="body1">Prepared by:</Typography>
        <TextField
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Typography variant="body1">Date:</Typography>
        <TextField
          value={date}
          onChange={handleDateChange}
          placeholder="Enter the date"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
          Save
        </Button>
      </Box>
    </>
  );
};

export default DiseaseIncidenceReport;
