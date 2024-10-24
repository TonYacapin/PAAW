import React, { useEffect, useState } from 'react';
import axiosInstance from '../../component/axiosInstance';
import Modal from '../../component/Modal'; 
import DiseaseInvestigationForm from './DiseaseInvestigationForm';

const DiseaseInvestigationTable = () => {
  const [investigations, setInvestigations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // State variables for filters
  const [farmerNameFilter, setFarmerNameFilter] = useState('');
  const [formStatusFilter, setFormStatusFilter] = useState('');

  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const response = await axiosInstance.get('/disease-investigation');
        setInvestigations(response.data);
      } catch (error) {
        console.error('Error fetching investigations:', error);
      }
    };

    fetchInvestigations();
  }, []);

  const handleRowClick = (investigation) => {
    setSelectedInvestigation(investigation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvestigation(null);
  };

  const handleOpenFormModal = () => {
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
  };

  const handleOpenEditStatusModal = (investigation) => {
    setSelectedInvestigation(investigation);
    setNewStatus(investigation.formStatus); // Set initial value to current status
    setEditStatusModalOpen(true);
  };

  const handleCloseEditStatusModal = () => {
    setEditStatusModalOpen(false);
    setSelectedInvestigation(null);
  };

  const handleEditStatus = async () => {
    if (!selectedInvestigation) return;

    try {
      await axiosInstance.put(`/disease-investigation/${selectedInvestigation._id}`, { status: newStatus });
      setInvestigations(prev =>
        prev.map(investigation =>
          investigation._id === selectedInvestigation._id ? { ...investigation, formStatus: newStatus } : investigation
        )
      );
      handleCloseEditStatusModal();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredInvestigations = investigations.filter(item => {
    const matchesFarmerName = item.farmerName.toLowerCase().includes(farmerNameFilter.toLowerCase());
    const matchesFormStatus = item.formStatus.toLowerCase().includes(formStatusFilter.toLowerCase());
    return matchesFarmerName && matchesFormStatus;
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Disease Investigation Reports</h1>

      {/* Filter Inputs */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Filter by Farmer Name"
          value={farmerNameFilter}
          onChange={(e) => setFarmerNameFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <select
          value={formStatusFilter}
          onChange={(e) => setFormStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Deleted">Deleted</option>
        </select>
      </div>

      <button 
        onClick={handleOpenFormModal} 
        className="mb-4 px-4 py-2 bg-darkgreen text-white rounded"
      >
        Add Investigation
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className='bg-pastelyellow text-sm'>
            <tr>
              <th className="py-3 px-6">Farmer Name</th>
              <th className="py-3 px-6">Farm Type</th>
              
              <th className="py-3 px-6">Control Measures</th>
              <th className="py-3 px-6">Tentative Diagnosis</th>
              <th className="py-3 px-6">Final Diagnosis</th>
              <th className="py-3 px-6">Nature of Diagnosis</th>
              <th className="py-3 px-6">Form Status</th>
              <th className="py-3 px-6">Actions</th> {/* New Actions Header */}
            </tr>
          </thead>
          <tbody>
            {filteredInvestigations.map((item) => (
              <tr key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-gray-100">
                <td className="py-3 px-6">{item.farmerName}</td>
                <td className="py-3 px-6">{item.farmType.join(', ')}</td>
                
                <td className="py-3 px-6">{item.controlmeasures}</td>
                <td className="py-3 px-6">{item.tentativediagnosis}</td>
                <td className="py-3 px-6">{item.finaldiagnosis}</td>
                <td className="py-3 px-6">{item.natureofdiagnosis}</td>
                <td className="py-3 px-6">{item.formStatus}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleOpenEditStatusModal(item);
                    }}
                    className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying detailed information */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedInvestigation && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-darkgreen">Investigation Details</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> <span className="text-gray-700">{selectedInvestigation.status}</span></p>
              <p><strong>No. of Visits:</strong> <span className="text-gray-700">{selectedInvestigation.noOfVisit}</span></p>
              <p><strong>Date Reported:</strong> <span className="text-gray-700">{new Date(selectedInvestigation.dateReported).toLocaleDateString()}</span></p>
              <p><strong>Date of Visit:</strong> <span className="text-gray-700">{new Date(selectedInvestigation.dateOfVisit).toLocaleDateString()}</span></p>
              <p><strong>Investigator:</strong> <span className="text-gray-700">{selectedInvestigation.investigator}</span></p>
              <p><strong>Place Affected:</strong> <span className="text-gray-700">{selectedInvestigation.placeAffected}</span></p>
              <p><strong>Farmer Name:</strong> <span className="text-gray-700">{selectedInvestigation.farmerName}</span></p>
              <p><strong>Farm Type:</strong> <span className="text-gray-700">{selectedInvestigation.farmType.join(', ')}</span></p>
              <p><strong>Probable Source of Infection:</strong> <span className="text-gray-700">{selectedInvestigation.probablesourceofinfection}</span></p>
              <p><strong>Control Measures:</strong> <span className="text-gray-700">{selectedInvestigation.controlmeasures}</span></p>
              <p><strong>Remarks:</strong> <span className="text-gray-700">{selectedInvestigation.remarks}</span></p>
              <p><strong>Tentative Diagnosis:</strong> <span className="text-gray-700">{selectedInvestigation.tentativediagnosis}</span></p>
              <p><strong>Final Diagnosis:</strong> <span className="text-gray-700">{selectedInvestigation.finaldiagnosis}</span></p>
              <p><strong>Nature of Diagnosis:</strong> <span className="text-gray-700">{selectedInvestigation.natureofdiagnosis}</span></p>
              <p><strong>Form Status:</strong> <span className="text-gray-700">{selectedInvestigation.formStatus}</span></p>
            </div>

            {/* Map through details array */}
            <h3 className="font-bold mt-6 text-lg text-darkgreen">Details:</h3>
            <div className="space-y-2">
              {selectedInvestigation.details.map((detail, index) => (
                <div key={index} className="p-2 border border-gray-300 rounded">
                  <p><strong>No:</strong> {detail.no}</p>
                  <p><strong>Species:</strong> {detail.species}</p>
                  <p><strong>Sex:</strong> {detail.sex}</p>
                  <p><strong>Age:</strong> {detail.age}</p>
                  <p><strong>Pop'n:</strong> {detail.population}</p>
                  <p><strong>Cases:</strong> {detail.cases}</p>
                  <p><strong>Deaths:</strong> {detail.deaths}</p>
                  <p><strong>Destroyed:</strong> {detail.destroyed}</p>
                  <p><strong>Slaughtered:</strong> {detail.slaughtered}</p>
                  <p><strong>Vaccine History:</strong> {detail.vaccineHistory}</p>
                  <p><strong>Remarks:</strong> {detail.remarks}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for adding new investigation */}
      <Modal isOpen={formModalOpen} onClose={handleCloseFormModal}>
        <DiseaseInvestigationForm onClose={handleCloseFormModal} />
      </Modal>

      {/* Modal for editing form status */}
      <Modal isOpen={editStatusModalOpen} onClose={handleCloseEditStatusModal}>
        {selectedInvestigation && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Form Status</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">New Status</label>
              <select
                value={newStatus} // Bind to newStatus state
                onChange={(e) => setNewStatus(e.target.value)} // Update newStatus state
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleEditStatus} 
                className="px-4 py-2 bg-darkgreen text-white rounded"
              >
                Save
              </button>
              <button 
                onClick={handleCloseEditStatusModal} 
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DiseaseInvestigationTable;
