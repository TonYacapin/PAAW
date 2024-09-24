// TargetForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CardBox from "../../component/CardBox";

const TargetForm = ({ onClose, target }) => {
  const [type, setType] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [semiAnnualTarget, setSemiAnnualTarget] = useState("");
  const [targetYear, setTargetYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (target) {
      setType(target.Type);
      setTargetValue(target.target);
      setSemiAnnualTarget(target.semiAnnualTarget);
      setTargetYear(target.targetYear);
    }
  }, [target]);

  const handleQuarterChange = (e) => {
    const value = e.target.value;
    setTargetValue(value);
    setSemiAnnualTarget(value * 2); // Update semiAnnualTarget based on targetValue
  };

  const handleSemiAnnualChange = (e) => {
    const value = e.target.value;
    setSemiAnnualTarget(value);
    setTargetValue(value / 2); // Update targetValue based on semiAnnualTarget
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(targetYear)) {
      setError("Please enter a valid 4-digit year.");
      return;
    }

    try {
      const url = target
        ? `${process.env.REACT_APP_API_BASE_URL}/api/targets/${target._id}`
        : `${process.env.REACT_APP_API_BASE_URL}/api/targets`;
      const method = target ? "put" : "post";
      const response = await axios[method](url, {
        Type: type,
        target: Number(targetValue),
        semiAnnualTarget: Number(semiAnnualTarget),
        targetYear: Number(targetYear),
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Target saved successfully!");
        // Clear the form
        setType("");
        setTargetValue("");
        setSemiAnnualTarget("");
        setTargetYear("");
        onClose();
      }
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {target ? "Edit Target" : "Add Target"}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <CardBox
        content={
          <>
            <form onSubmit={handleSubmit} className="bg-white space-y-4">
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select a type</option>
                  <option value="Hemorrhagic Septicemia">
                    Hemorrhagic Septicemia
                  </option>
                  <option value="Newcastle Disease">New Castle Disease</option>
                  <option value="Hog Cholera">Hog Cholera</option>
                  <option value="Deworming">Deworming</option>
                  <option value="Wound Treatment">Wound Treatment</option>
                  <option value="Vitamin Supplementation">
                    Vitamin Supplementation
                  </option>
                  <option value="Iron Supplementation">
                    Iron Supplementation
                  </option>
                  <option value="Consultation">Consultation</option>
                  <option value="Support">Support</option>
                  <option value="No. of dogs immunized against rabies and registered">
                    No. of dogs immunized against rabies and registered
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Second Quarter Target
                </label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={handleQuarterChange} // Update handler
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Semi Annual Target
                </label>
                <input
                  type="number"
                  value={semiAnnualTarget}
                  onChange={handleSemiAnnualChange} // Update handler
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Target Year</label>
                <input
                  type="number"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  required
                  placeholder="e.g., 2024"
                  min="1900"
                  max="2100"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-darkgreen text-white p-2 rounded-md hover:bg-darkergreen"
              >
                {target ? "Update" : "Submit"}
              </button>
            </form>
          </>
        }
      />
    </div>
  );
};

export default TargetForm;
