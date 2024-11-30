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
  Button,
} from "@mui/material"; 
import Navbar from "../../component/Navbar";

const DiseaseIncidenceReport = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [checked, setChecked] = useState("");
  const [noted, setNoted] = useState("");

  const handleNameChange = (event) => setName(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);
  const handlePositionChange = (event) => setPosition(event.target.value);
  const handleSubmitted = (event) => setSubmitted(event.target.value);
  const handleNoted = (event) => setNoted(event.target.value);
  const handleChecked = (event) => setChecked(event.target.value);

  return (
    <>
    <Navbar/>
      <div className="title">Disease Surveillance and Incidence Report</div>
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
              {
                category: "Avian Poultry",
                diseases: ["Avian Influenza", "Newcastle Disease (ND)"],
              },
              {
                category: "Swine",
                diseases: ["Foot and Mouth Disease", "Classical Swine Fever"],
              },
              {
                category: "Cattle",
                diseases: [
                  "Blackleg",
                  "Anthrax",
                  "Foot and Mouth Disease (FMD)",
                  "Hemorrhagic Septicemia",
                  "Surra",
                ],
              },
              {
                category: "Carabao",
                diseases: [
                  "Anthrax",
                  "Foot and Mouth Disease (FMD)",
                  "Hemorrhagic Septicemia",
                  "Surra",
                ],
              },
              {
                category: "Goat",
                diseases: [
                  "Rabies",
                  "Anthrax",
                  "Foot and Mouth Disease (FMD)",
                  "Hemorrhagic Septicemia",
                  "Caprine Arthritis Encephalitis (CAE)",
                ],
              },
              {
                category: "Sheep",
                diseases: [
                  "Anthrax",
                  "Foot and Mouth Disease (FMD)",
                  "Hemorrhagic Septicemia",
                  "Caprine Arthritis Encephalitis (CAE)",
                ],
              },
              { category: "Dog", diseases: ["Rabies"] },
              { category: "Cat", diseases: ["Rabies"] },
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
                      <TableCell
                        key={j}
                        className="table-cell-body"
                        align="center"
                      ></TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4} p={2} borderTop="1px solid #ccc">
  {/* Date Field */}
  <Typography variant="body1" sx={{ fontSize: "12px" }}>
    Date:
  </Typography>
  <TextField
    value={date}
    onChange={handleDateChange}
    placeholder="Enter the date"
    variant="outlined"
    margin="none"
    type="date"
    InputLabelProps={{ shrink: true }}
  />

  {/* Fields in a Row */}
  <Box display="flex" flexDirection="row" gap={2} mt={2}>
    {/* Prepared by */}
    <Box flex="1">
      <Typography variant="body1" sx={{ fontSize: "12px" }}>
        Prepared by:
      </Typography>
      <TextField
        value={name}
        onChange={handleNameChange}
        placeholder="Name"
        variant="outlined"
        margin="none"
        size="small"
        sx={{ fontSize: "20px" }} // Larger font size for the name
        fullWidth
      />
    </Box>

    {/* Submitted by */}
    <Box flex="1">
      <Typography variant="body1" sx={{ fontSize: "12px" }}>
        Submitted by:
      </Typography>
      <TextField
        value={submitted}
        onChange={handleSubmitted}
        placeholder="Name"
        variant="outlined"
        margin="none"
        size="small"
        sx={{ fontSize: "14px" }} // Adjust size as needed
        fullWidth
      />
    </Box>

    {/* Checked by */}
    <Box flex="1">
      <Typography variant="body1" sx={{ fontSize: "12px" }}>
        Checked by:
      </Typography>
      <TextField
        value={checked}
        onChange={handleChecked}
        placeholder="Name"
        variant="outlined"
        margin="none"
        size="small"
        sx={{ fontSize: "14px" }} // Adjust size as needed
        fullWidth
      />
    </Box>

    {/* Noted by */}
    <Box flex="1">
      <Typography variant="body1" sx={{ fontSize: "12px" }}>
        Noted by:
      </Typography>
      <TextField
        value={noted}
        onChange={handleNoted}
        placeholder="Name"
        variant="outlined"
        margin="none"
        size="small"
        sx={{ fontSize: "14px" }} // Adjust size as needed
        fullWidth
      />
    </Box>
  </Box>

  {/* Save Button */}
  <Button variant="contained" color="primary" style={{ marginTop: 50 }}>
    Save
  </Button>
</Box>

    </>
  );
};

export default DiseaseIncidenceReport;
