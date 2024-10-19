import React, { useState } from "react";
import CardBox from "../component/CardBox";
import StepperComponent from "../component/StepperComponent";
import FormSubmit from "../component/FormSubmit";
import { Add } from "@mui/icons-material";

const RequisitionIssueSlip = () => {
  const [requisitionRows, setRequisitionRows] = useState([
    { stockNo: "", unit: "", quantity: "", description: "" },
  ]);

  const [issuanceRows, setIssuanceRows] = useState([
    { quantity: "", description: "", remarks: "" },
  ]);

  const handleRequisitionChange = (index, field, value) => {
    const newRows = [...requisitionRows];
    newRows[index][field] = value;
    setRequisitionRows(newRows);

    if (field === "description") {
      const newIssuanceRows = [...issuanceRows];
      newIssuanceRows[index][field] = value;
      setIssuanceRows(newIssuanceRows);
    }
  };

  const addRequisitionRow = () => {
    setRequisitionRows([
      ...requisitionRows,
      { stockNo: "", unit: "", quantity: "", description: "" },
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
    </CardBox>,
    <CardBox>
      <div className="p-4 mb-4 flex flex-col gap-4">
        {/* Requisition Section */}
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
                      value={row.stockNo}
                      onChange={(e) =>
                        handleRequisitionChange(
                          index,
                          "stockNo",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border w-full p-1"
                      value={row.unit}
                      onChange={(e) =>
                        handleRequisitionChange(index, "unit", e.target.value)
                      }
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
                    <input
                      type="text"
                      className="border w-full p-1"
                      value={row.description}
                      onChange={(e) =>
                        handleRequisitionChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />
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
                    onChange={(e) =>
                      handleIssuanceChange(index, "quantity", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="border w-full p-1"
                    value={row.description}
                    onChange={(e) =>
                      handleIssuanceChange(index, "description", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="border w-full p-1"
                    value={row.remarks}
                    onChange={(e) =>
                      handleIssuanceChange(index, "remarks", e.target.value)
                    }
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
        handleImportCSV={() => {}}
        handleExportCSV={() => {}}
        handleSubmit={() => {}}
      />
    </div>
  );
};

export default RequisitionIssueSlip;
