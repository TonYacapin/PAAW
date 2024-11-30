import React, { useEffect, useState } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";  // Import the Modal component

const RabbiesVaccinantionNumberOfVisits = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/animal-health-care-services");
        const filteredData = response.data.filter(
          (item) => item.status === "Ongoing" && item.rabiesVaccinations.length > 0
        );
        setData(filteredData);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle edit button click
  const handleEdit = (index) => {
    setEditingIndex(index);
    // Create a deep copy of the item to avoid direct mutation
    setFormData(JSON.parse(JSON.stringify(data[index])));
    setIsModalOpen(true);  // Open the modal when editing
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object changes
    if (name.includes('clientInfo.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        clientInfo: {
          ...prev.clientInfo,
          [key]: value
        }
      }));
    } else if (name.includes('rabiesVaccinations[')) {
      const index = parseInt(name.split('[')[1].split(']')[0]);
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        rabiesVaccinations: prev.rabiesVaccinations.map((vaccination, i) =>
          i === index ? { ...vaccination, [key]: value } : vaccination
        )
      }));
    } else {
      // Handle direct changes
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Save edited data
  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/animal-health-care-services/${formData._id}`,
        formData
      );
      const updatedData = [...data];
      updatedData[editingIndex] = response.data;
      setData(updatedData);
      setIsModalOpen(false); // Close the modal after saving
      setEditingIndex(null);
    } catch (err) {
      setError("Error updating data");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without saving
    setEditingIndex(null);
    setFormData({});
  };

  // Filter the data based on the search query
  const filteredData = data.filter(item => 
    item.clientInfo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 py-10">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black mb-6">Rabies Vaccination Number of Visits</h2>
      
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {filteredData.map((item, index) => (
        <div key={item._id} className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md">
          <div>
            <h3 className="text-lg font-semibold">{item.clientInfo.name}</h3>
            <p>Barangay: {item.clientInfo.barangay}</p>
            {item.rabiesVaccinations.map((vaccination) => (
              <div key={vaccination._id}>
                <p>Pet Name: {vaccination.petName}</p>
                <p>Number of Shots: {vaccination.noOfVisit}</p>
              </div>
            ))}
            <button
              onClick={() => handleEdit(index)}
              className="p-2 bg-[#1b5b40] text-white hover:bg-darkergreen rounded "
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {/* Modal for editing */}
      <Modal isOpen={isModalOpen} onClose={handleCancel}>
        <div>
          <h3 className="text-xl font-semibold mb-4">Edit Entry</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name:
              </label>
              <input
                type="text"
                name="clientInfo.name"
                value={formData.clientInfo?.name || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                readOnly
              />
            </div>

            {formData.rabiesVaccinations?.map((vaccination, rabiesIndex) => (
              <div key={vaccination._id}>
                <h4 className="text-lg font-semibold">Pet Name: {vaccination.petName}</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Shots:
                  </label>
                  <input
                    type="number"
                    name={`rabiesVaccinations[${rabiesIndex}].noOfVisit`}
                    value={vaccination.noOfVisit || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSave}
                className="p-2 bg-[#1b5b40] text-white hover:bg-darkergreen rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default RabbiesVaccinantionNumberOfVisits;
