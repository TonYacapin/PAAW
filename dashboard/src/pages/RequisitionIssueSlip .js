import React, { useState, useEffect } from "react";
import axiosInstance from "../component/axiosInstance";
import CardBox from "../component/CardBox";
import StepperComponent from "../component/StepperComponent";
import FormSubmit from "../component/FormSubmit";
import { Add } from "@mui/icons-material";
import Modal from "../component/Modal";
import { jwtDecode } from "jwt-decode";


const RequisitionIssueSlip = () => {

  const [sentby, setsentby] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const user = decodedToken.email;
        console.log(user); // Adjust this key based on your token's structure
        setsentby(user);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);


  const [requisitionRows, setRequisitionRows] = useState([
    { stockNo: 1, unit: "", quantity: "", description: "" }, // Start with stockNo = 1
  ]);

  const [issuanceRows, setIssuanceRows] = useState([
    { quantity: "", description: "", remarks: "" },
  ]);

  const [inventoryData, setInventoryData] = useState([]); // State to store inventory data
  const [supplyOptions, setSupplyOptions] = useState([]); //

  const [isStocksModalOpen, setStocksModalOpen] = useState(false); // State for stocks modal



  // State for additional text fields
  const [division, setDivision] = useState("");
  const [office, setOffice] = useState("");
  const [responsibilityCenter, setResponsibilityCenter] = useState("");
  const [code, setCode] = useState("");
  const [risNo, setRisNo] = useState("");
  const [saiNo, setSaiNo] = useState("");
  const [date, setDate] = useState(""); // Date for the requisition
  const [purpose, setPurpose] = useState("");
  const [designation, setDesignation] = useState("");

  const handleSubmit = async () => {


    // Create the payload based on the state values
    const requisitionIssuanceData = {
      division,
      office,
      responsibilityCenter,
      code,
      risNo,
      saiNo,
      date,
      purpose,
      designation,
      requisitionRows,
      issuanceRows,
      sentby
    };

    console.log(requisitionIssuanceData)

    try {
      // Send POST request to your backend
      const response = await axiosInstance.post("/api/requisitions", requisitionIssuanceData);
      console.log("Requisition Issuance created successfully:", response.data);
      // Handle successful submission (e.g., reset the form, show a success message)
      resetForm();
    } catch (error) {
      console.error("Error creating requisition issuance:", error);
      // Handle error (e.g., show an error message)
    }
  };

  // Function to reset the form after successful submission
  const resetForm = () => {
    setDivision("");
    setOffice("");
    setResponsibilityCenter("");
    setCode("");
    setRisNo("");
    setSaiNo("");
    setDate("");
    setPurpose("");
    setDesignation("");
    setRequisitionRows([{ stockNo: "", unit: "", quantity: "", description: "" }]);
    setIssuanceRows([{ quantity: "", description: "", remarks: "" }]);
  };


  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        // available stocks data
        const response = await axiosInstance.get("/api/inventory");
        setInventoryData(response.data); // Set the fetched data to state
        console.log("Inventory Data:", response.data); // For debugging

        // Extract supplies and units for dropdown options only if quantity is greater than 0
        const supplies = response.data
          .filter(item => item.quantity > 0) // Filter items with quantity greater than 0
          .map(item => ({
            supply: item.supplies,
            unit: item.unit
          }));

        setSupplyOptions(supplies);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventoryData();
  }, []); // Fetch data only once when the component mounts


  const handleRequisitionChange = (index, field, value) => {
    const newRows = [...requisitionRows];
    newRows[index][field] = value;

    // If the description is changed, update the unit as well
    if (field === "description") {
      const selectedSupply = supplyOptions.find(supply => supply.supply === value);
      newRows[index].unit = selectedSupply ? selectedSupply.unit : ""; // Set unit based on selected description
    }


    setRequisitionRows(newRows);



    if (field === "description") {
      const newIssuanceRows = [...issuanceRows];
      newIssuanceRows[index][field] = value;
      setIssuanceRows(newIssuanceRows);
    }
  };

  const addRequisitionRow = () => {
    setRequisitionRows((prevRows) => [
      ...prevRows,
      {
        stockNo: prevRows.length + 1, // Calculate stockNo based on current length
        unit: "",
        quantity: "",
        description: ""
      }
    ]);
    setIssuanceRows([
      ...issuanceRows,
      { quantity: "", description: "", remarks: "" },
    ]);
  };

  const handleIssuanceChange = (index, field, value) => {
    const newRows = [...issuanceRows];
    newRows[index][field] = value;
    setIssuanceRows(newRows);
  };

  const removeRequisitionRow = (index) => {
    const newRequisitionRows = [...requisitionRows];
    newRequisitionRows.splice(index, 1);
    setRequisitionRows(newRequisitionRows);

    const newIssuanceRows = [...issuanceRows];
    newIssuanceRows.splice(index, 1);
    setIssuanceRows(newIssuanceRows);
  };


  const pages = [
    <CardBox>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Header Information */}
        <div>
          <label>Division:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          />
        </div>
        <div>
          <label>Office:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={office}
            onChange={(e) => setOffice(e.target.value)}
          />
        </div>
        <div>
          <label>Responsibility Center:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={responsibilityCenter}
            onChange={(e) => setResponsibilityCenter(e.target.value)}
          />
        </div>
        <div>
          <label>Code:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <label>RIS No.:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={risNo}
            onChange={(e) => setRisNo(e.target.value)}
          />
        </div>
        <div>
          <label>SAI No.:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={saiNo}
            onChange={(e) => setSaiNo(e.target.value)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            className="border w-full p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
    </CardBox>,
    <CardBox>
      <div className="p-4 mb-4 flex flex-col gap-4">
        {/* Requisition Section */}
        <button
          onClick={() => setStocksModalOpen(true)}
          className="mt-2 bg-darkgreen text-white px-4 py-2"
        >
          View Available Stocks
        </button>
        <h2 className="font-bold mb-2">Requisition</h2>
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-darkgreen text-white">
              <tr>
                <th>Stock No.</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requisitionRows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="border w-full p-1"
                      value={row.stockNo || index + 1} // Display the stockNo from the row
                      readOnly // Make it read-only
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border w-full p-1"
                      value={row.unit}
                      readOnly // Set as read-only since it will be auto-filled
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="border w-full p-1"
                      value={row.quantity}
                      onChange={(e) =>
                        handleRequisitionChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="border w-full p-1"
                      value={row.description}
                      onChange={(e) =>
                        handleRequisitionChange(index, "description", e.target.value)
                      }
                    >
                      <option value="">Select a supply</option>
                      {supplyOptions.map((supply, i) => (
                        <option key={i} value={supply.supply}>
                          {supply.supply}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => removeRequisitionRow(index)}
                      className="bg-red-500 text-white px-2 py-1"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addRequisitionRow}
          className="mt-2 bg-darkgreen text-white px-4 py-2"
        >
          <Add />
          Add Row
        </button>
      </div>
    </CardBox>,
    <CardBox>
      <div className="p-4 mb-4">
        {/* Issuance Section */}
        <h2 className="font-bold mb-2">Issuance</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Description</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {issuanceRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    className="border w-full p-1"
                    value={row.quantity}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="border w-full p-1"
                    value={row.description}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="border w-full p-1"
                    value={row.remarks}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardBox>,
    <CardBox>
      {/* Footer Section */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label>Purpose:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={purpose} // Bind to state variable
            onChange={(e) => setPurpose(e.target.value)} // Update state on change
          />

        </div>
        <div>
          <label>Designation:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={designation} // Bind to state variable
            onChange={(e) => setDesignation(e.target.value)} // Update state on change
          />
        </div>



      </div>
    </CardBox>,
  ];
  const renderStepContent = (step) => {
    if (step >= pages.length) {
      return pages[pages.length - 1];
    }
    return pages[step] || <div>No content available for this step.</div>;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white">
      <h1 className="text-xl font-bold mb-4">Requisition and Issue Slip</h1>
      <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      <FormSubmit
        handleImportCSV={() => { }}
        handleExportCSV={() => { }}
        handleSubmit={handleSubmit}
      />

      <Modal isOpen={isStocksModalOpen} onClose={() => setStocksModalOpen(false)}>
        <h2 className="font-bold mb-4">Available Stocks</h2>
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-darkgreen text-white">
              <tr>
                <th>Supply</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Out</th>
                <th>Total</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr key={index}>
                  <td>{item.supplies}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>{item.out}</td>
                  <td>{item.total}</td>
                  <td>{item.category}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

    </div>
  );
};

export default RequisitionIssueSlip;