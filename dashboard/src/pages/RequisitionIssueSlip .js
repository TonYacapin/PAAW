import React, { useState } from 'react';

const RequisitionIssueSlip = () => {
  const [requisitionRows, setRequisitionRows] = useState([{ stockNo: '', unit: '', quantity: '', description: '' }]);
  const [issuanceRows, setIssuanceRows] = useState([{ quantity: '', remarks: '' }]);

  const handleRequisitionChange = (index, field, value) => {
    const newRows = [...requisitionRows];
    newRows[index][field] = value;
    setRequisitionRows(newRows);
  };

  const addRequisitionRow = () => {
    setRequisitionRows([...requisitionRows, { stockNo: '', unit: '', quantity: '', description: '' }]);
    setIssuanceRows([...issuanceRows, { quantity: '', remarks: '' }]); // Add a corresponding issuance row
  };

  const handleIssuanceChange = (index, field, value) => {
    const newRows = [...issuanceRows];
    newRows[index][field] = value;
    setIssuanceRows(newRows);
  };

  const addIssuanceRow = () => {
    if (requisitionRows.length === issuanceRows.length) {
      setIssuanceRows([...issuanceRows, { quantity: '', remarks: '' }]);
    } else {
      alert('Add a corresponding requisition row before adding an issuance row.');
    }
  };

  const removeRequisitionRow = (index) => {
    const newRequisitionRows = [...requisitionRows];
    newRequisitionRows.splice(index, 1);
    setRequisitionRows(newRequisitionRows);

    const newIssuanceRows = [...issuanceRows];
    newIssuanceRows.splice(index, 1);
    setIssuanceRows(newIssuanceRows);
  };

  const removeIssuanceRow = (index) => {
    const newIssuanceRows = [...issuanceRows];
    newIssuanceRows.splice(index, 1);
    setIssuanceRows(newIssuanceRows);

    const newRequisitionRows = [...requisitionRows];
    newRequisitionRows.splice(index, 1);
    setRequisitionRows(newRequisitionRows);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white">
      <h1 className="text-xl font-bold mb-4">Requisition and Issue Slip</h1>

      {/* Header Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Header fields */}
        <div>
          <label>Division:</label>
          <input type="text" className="border w-full p-2" />
        </div>
        <div>
          <label>Office:</label>
          <input type="text" className="border w-full p-2" />
        </div>
        <div>
          <label>Responsibility Center:</label>
          <input type="text" className="border w-full p-2" />
        </div>
        <div>
          <label>Code:</label>
          <input type="text" className="border w-full p-2" />
        </div>
        <div>
          <label>RIS No.:</label>
          <input type="text" className="border w-full p-2" />
        </div>
        <div>
          <label>SAI No.:</label>
          <input type="text" className="border w-full p-2" />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" className="border w-full p-2" />
        </div>
      </div>

      {/* Requisition Section */}
      <div className="border p-4 mb-4">
        <h2 className="font-bold mb-2">Requisition</h2>
        <table className="w-full table-auto border">
          <thead>
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
                <td><input type="text" className="border w-full p-1" value={row.stockNo} onChange={(e) => handleRequisitionChange(index, "stockNo", e.target.value)} /></td>
                <td><input type="text" className="border w-full p-1" value={row.unit} onChange={(e) => handleRequisitionChange(index, "unit", e.target.value)} /></td>
                <td><input type="number" className="border w-full p-1" value={row.quantity} onChange={(e) => handleRequisitionChange(index, "quantity", e.target.value)} /></td>
                <td><input type="text" className="border w-full p-1" value={row.description} onChange={(e) => handleRequisitionChange(index, "description", e.target.value)} /></td>
                <td><button onClick={() => removeRequisitionRow(index)} className="bg-red-500 text-white px-2 py-1">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRequisitionRow} className="mt-2 bg-blue-500 text-white px-4 py-2">Add Row</button>
      </div>

      {/* Issuance Section */}
      <div className="border p-4 mb-4">
        <h2 className="font-bold mb-2">Issuance</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issuanceRows.map((row, index) => (
              <tr key={index}>
                <td><input type="number" className="border w-full p-1" value={row.quantity} onChange={(e) => handleIssuanceChange(index, "quantity", e.target.value)} /></td>
                <td><input type="text" className="border w-full p-1" value={row.remarks} onChange={(e) => handleIssuanceChange(index, "remarks", e.target.value)} /></td>
                <td><button onClick={() => removeIssuanceRow(index)} className="bg-red-500 text-white px-2 py-1">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label>Purpose:</label>
          <input type="text" className="border w-full p-2" />
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label>Requested by:</label>
            <input type="text" className="border w-full p-2" />
          </div>
          <div>
            <label>Approved by:</label>
            <input type="text" className="border w-full p-2" />
          </div>
          <div>
            <label>Issued by:</label>
            <input type="text" className="border w-full p-2" />
          </div>
          <div>
            <label>Received by:</label>
            <input type="text" className="border w-full p-2" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label>Signature:</label>
            <input type="text" className="border w-full p-2" />
          </div>
          <div>
            <label>Printed Name:</label>
            <input type="text" className="border w-full p-2" />
          </div>
          <div>
            <label>Designation:</label>
            <input type="text" className="border w-full p-2" />
          </div>
          <div>
            <label>Date:</label>
            <input type="date" className="border w-full p-2" />
          </div>
        </div>
      </div>

      <button  className="mt-2 bg-blue-500 text-white px-4 py-2">Save Form</button>
    </div>
  );
};

export default RequisitionIssueSlip;
