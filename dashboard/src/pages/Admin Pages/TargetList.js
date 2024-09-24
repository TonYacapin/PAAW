import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../component/Modal';
import TargetForm from './TargetForm';

const TargetList = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [targets, setTargets] = useState([]);
    const [error, setError] = useState('');
    const [selectedTarget, setSelectedTarget] = useState(null); // State for the target being edited

    const fetchTargets = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/targets`);
            setTargets(response.data);
        } catch (err) {
            setError(err.response.data.message || 'An error occurred while fetching data');
        }
    };

    useEffect(() => {
        fetchTargets();
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedTarget(null); // Reset selected target
        fetchTargets();
    };

    const handleEditClick = (target) => {
        setSelectedTarget(target);
        setModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Target Value List</h2>
            {error && <p className="text-red-500">{error}</p>}
            <button
                className="px-4 py-2 my-4 bg-darkgreen hover:bg-darkergreen text-white rounded"
                onClick={() => {
                    setSelectedTarget(null); // Prepare for adding a new target
                    setModalOpen(true);
                }}
            >
                Add Target Value
            </button>
            <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-darkgreen text-white">
                    <tr>
                        <th className="border px-4 py-2">Type</th>
                        <th className="border px-4 py-2">Target</th>
                        <th className="border px-4 py-2">Semi Annual Target</th>
                        <th className="border px-4 py-2">Target Year</th>
                        <th className="border px-4 py-2">Actions</th> {/* New Actions column */}
                    </tr>
                </thead>
                <tbody>
                    {targets.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center border px-4 py-2">No targets available</td>
                        </tr>
                    ) : (
                        targets.map((target) => (
                            <tr key={target._id}>
                                <td className="border px-4 py-2">{target.Type}</td>
                                <td className="border px-4 py-2">{target.target}</td>
                                <td className="border px-4 py-2">{target.semiAnnualTarget}</td>
                                <td className="border px-4 py-2">{target.targetYear}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        className="bg-darkgreen hover:bg-darkergreen text-white rounded-md px-7 py-1"
                                        onClick={() => handleEditClick(target)} // Open form to edit
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <TargetForm onClose={handleModalClose} target={selectedTarget} /> {/* Pass selected target */}
            </Modal>
        </div>
    );
};

export default TargetList;
