// TargetList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../component/Modal';
import TargetForm from './TargetForm';

const TargetList = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [targets, setTargets] = useState([]);
    const [error, setError] = useState('');

    // Function to fetch targets
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

    // Function to handle modal close and refresh the target list
    const handleModalClose = () => {
        setModalOpen(false);
        fetchTargets(); // Refresh the target list when modal closes
    };

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Target Value List</h2>
            {error && <p className="text-red-500">{error}</p>}
            <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setModalOpen(true)}
            >
                Add Target Value
            </button>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Type</th>
                        <th className="border px-4 py-2">Target</th>
                        <th className="border px-4 py-2">Semi Annual Target</th>
                        <th className="border px-4 py-2">Target Date</th>
                    </tr>
                </thead>
                <tbody>
                    {targets.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center border px-4 py-2">No targets available</td>
                        </tr>
                    ) : (
                        targets.map((target) => (
                            <tr key={target._id}>
                                <td className="border px-4 py-2">{target.Type}</td>
                                <td className="border px-4 py-2">{target.target}</td>
                                <td className="border px-4 py-2">{target.semiAnnualTarget}</td>
                                <td className="border px-4 py-2">{new Date(target.targetDate).toLocaleDateString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <TargetForm onClose={handleModalClose} />
            </Modal>
        </div>
    );
};

export default TargetList;
