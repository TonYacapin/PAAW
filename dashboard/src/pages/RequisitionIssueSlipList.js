import React, { useEffect, useState } from 'react';
import axiosInstance from '../component/axiosInstance';
import Modal from '../component/Modal';
import RequisitionDetails from './RequisitionDetails'; // Create this component for modal details
import RequisitionIssueSlip from './RequisitionIssueSlip ';
function RequisitionIssueSlipList() {
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequisition, setSelectedRequisition] = useState(null);
    const [isSlipModalOpen, setIsSlipModalOpen] = useState(false); // State for RequisitionIssueSlip modal
    useEffect(() => {
        const fetchRequisitions = async () => {
            try {
                const response = await axiosInstance.get('/api/requisitions');
                setRequisitions(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching requisitions:", err);
                setError("Failed to fetch requisitions");
                setLoading(false);
            }
        };

        fetchRequisitions();
    }, []);

    const handleViewDetails = (requisition) => {
        setSelectedRequisition(requisition);
        setIsModalOpen(true);
    };
    const handleOpenSlipModal = () => {
        setIsSlipModalOpen(true);
    };

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Requisition Issue Slip List</h2>

            <button
                onClick={handleOpenSlipModal}
                className=" bg-[#1b5b40] mb-4 px-4 py-2 text-white rounded "
            >
                Open Requisition Issue Slip
            </button>

            {/* Table with requisition data */}
            {requisitions.length === 0 ? (
                <p className="text-center py-4">No requisitions found.</p>
            ) : (
                <div className="overflow-auto border rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#1b5b40] text-white">
                                <th className="border border-gray-300 p-4">No.</th>
                                <th className="border border-gray-300 p-4">Date</th>
                                <th className="border border-gray-300 p-4">Requisition ID</th>
                                <th className="border border-gray-300 p-4">Requested By</th>
                                <th className="border border-gray-300 p-4">Status</th>
                                <th className="border border-gray-300 p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requisitions.map((requisition, index) => (
                                <tr key={requisition._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-4">{index + 1}</td>
                                    <td className="border border-gray-300 p-4">{new Date(requisition.date).toLocaleDateString()}</td>
                                    <td className="border border-gray-300 p-4">{requisition._id}</td>
                                    <td className="border border-gray-300 p-4">{requisition.sentby}</td>
                                    <td className="border border-gray-300 p-4">{requisition.formStatus}</td>
                                    <td className="border border-gray-300 p-4">
                                        <button
                                            onClick={() => handleViewDetails(requisition)}
                                            className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-[#1b5b40]"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Requisition Details Modal */}
            {isModalOpen && selectedRequisition && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <RequisitionDetails requisition={selectedRequisition} />
                </Modal>
            )}

            {/* Requisition Issue Slip Modal */}
            {isSlipModalOpen && (
                <Modal isOpen={isSlipModalOpen} onClose={() => setIsSlipModalOpen(false)}>
                    <RequisitionIssueSlip />
                </Modal>
            )}
        </div>
    );
}

export default RequisitionIssueSlipList;
