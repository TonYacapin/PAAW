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

const initialProductState = {
  beef: "",
  carabeef: "",
  pork: "",
  cheval: "",
  chevon: "",
  mutton: "",
  poultryMeat: "",
  tableEggs: "",
  embryonatedEgg: "",
  dung: "",
  others: "",
};

function VeterinaryQuarantineInspectionReport() {
  const [rows, setRows] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductMode, setEditProductMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [productData, setProductData] = useState(initialProductState);

  const handleOpen = (index = null) => {
    if (index !== null) {
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

  const handleOpenProductModal = (index = null) => {
    if (index !== null) {
      setProductData(productRows[index]);
      setCurrentProductIndex(index);
      setEditProductMode(true);
    } else {
      setProductData(initialProductState);
      setCurrentProductIndex(null);
      setEditProductMode(false);
    }
    setOpenProductModal(true);
  };

  const handleCloseProductModal = () => setOpenProductModal(false);

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

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    const numericValue = isNaN(value) ? "" : value;
    setProductData({ ...productData, [name]: numericValue });
  };

  const handleSave = () => {
    if (editMode && currentIndex !== null) {
      const updatedRows = [...rows];
      updatedRows[currentIndex] = formData;
      setRows(updatedRows);
    } else {
      const existingRowIndex = rows.findIndex(
        (row) => row.classification === formData.classification
      );

      if (existingRowIndex > -1) {
        const updatedRows = [...rows];
        const existingRow = updatedRows[existingRowIndex];
        updatedRows[existingRowIndex] = {
          ...existingRow,
          ...Object.keys(initialFormState).reduce((acc, key) => {
            acc[key] = (
              parseFloat(existingRow[key] || 0) + parseFloat(formData[key] || 0)
            ).toString();
            return acc;
          }, {}),
        };
        setRows(updatedRows);
      } else {
        setRows([...rows, formData]);
      }
    }

    setFormData(initialFormState);
    handleClose();
  };

  const handleSaveProduct = () => {
    if (editProductMode && currentProductIndex !== null) {
      const updatedProductRows = [...productRows];
      updatedProductRows[currentProductIndex] = productData;
      setProductRows(updatedProductRows);
    } else {
      setProductRows([...productRows, productData]);
    }

    setProductData(initialProductState);
    handleCloseProductModal();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 align="center">
        <b>Veterinary Quarantine Inspection Report</b>
      </h1>

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
        Add For Live Animals
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

      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleOpenProductModal()}
        style={{ marginLeft: "10px" }}
      >
        Add For Animal By-Product
      </Button>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableCell align="center" colSpan={12}>
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
              <TableCell>Others (Please Specify)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.beef}</TableCell>
                <TableCell>{row.carabeef}</TableCell>
                <TableCell>{row.pork}</TableCell>
                <TableCell>{row.cheval}</TableCell>
                <TableCell>{row.chevon}</TableCell>
                <TableCell>{row.mutton}</TableCell>
                <TableCell>{row.poultryMeat}</TableCell>
                <TableCell>{row.tableEggs}</TableCell>
                <TableCell>{row.embryonatedEgg}</TableCell>
                <TableCell>{row.dung}</TableCell>
                <TableCell>{row.others}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenProductModal(index)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <TextField
        label="Total No. of Incoming Shipment"
        variant="outlined"
        fullWidth
        margin="normal"
      />

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
              onClick={handleClose}
              fullWidth
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openProductModal} onClose={handleCloseProductModal}>
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
          <h2>
            {editProductMode ? "Edit Product Entry" : "Add New Product Entry"}
          </h2>
          <form>
            {Object.keys(initialProductState).map((key) => (
              <TextField
                key={key}
                label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                name={key}
                value={productData[key]}
                onChange={handleProductChange}
                fullWidth
                margin="normal"
                inputProps={{ pattern: "[0-9]*" }}
              />
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveProduct}
              fullWidth
              sx={{ mt: 2 }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseProductModal}
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
