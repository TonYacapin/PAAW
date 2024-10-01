import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../component/Modal';
import MunicipalityTargetForms from './MunicipalityTargetForms';

const MunicipalityTargetList = () => {
    const [targets, setTargets] = useState([]);
    const [municipality, setMunicipality] = useState('');
    const [targetYear, setTargetYear] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [allMunicipalityTargets, setAllMunicipalityTargets] = useState([]);
    const municipalities = [
        'Ambaguio', 'Bagabag', 'Bayombong', 'Diadi', 'Quezon', 'Solano',
        'Villaverde', 'Alfonso Castañeda', 'Aritao', 'Bambang', 'Dupax del Norte',
        'Dupax del Sur', 'Kayapa', 'Kasibu', 'Santa Fe'
    ];

    const fetchTargets = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mtargets`, {
                params: { municipality, targetYear },
            });
            setTargets(response.data);
        } catch (error) {
            console.error('Error fetching targets', error);
        }
    };

    useEffect(() => {
        fetchTargets();
    }, [municipality, targetYear]);

    const handleEditTarget = async (target) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mtargets`, {
                params: { type: target.type, targetYear: target.targetYear },
            });
            setAllMunicipalityTargets(response.data);
            setSelectedTarget(target);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching all municipality targets', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Targets</h1>

            <div className="mb-4">
                <label className="block">Filter by Municipality</label>
                <select value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="border p-2 w-full">
                    <option value="">Select Municipality</option>
                    {municipalities.map((m, index) => (
                        <option key={index} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block">Filter by Target Year</label>
                <input
                    type="number"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Enter Target Year"
                />
            </div>

            <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white py-2 px-4 mb-4">
                Add New Target
            </button>

            {/* Wrapper div for a scrollable table */}
            <div className="overflow-x-auto max-w-full">
                <div className="max-h-64 overflow-y-auto"> {/* Set a maximum height and enable scrolling */}
                    <table className="min-w-full border-collapse text-sm"> {/* Reduced font size */}
                        <thead>
                            <tr>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Municipality</th>
                                <th className="border p-2">Semi Annual Target</th>
                                <th className="border p-2">Target Year</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {targets.length > 0 ? (
                                targets.map((target) => (
                                    <tr key={target._id}>
                                        <td className="border p-2">{target.type}</td>
                                        <td className="border p-2">{target.municipality}</td>
                                        <td className="border p-2">{target.semiAnnualTarget}</td>
                                        <td className="border p-2">{target.targetYear}</td>
                                        <td className="border p-2">
                                            <button
                                                className="bg-yellow-500 text-white py-1 px-3"
                                                onClick={() => handleEditTarget(target)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="border p-2 text-center">No targets found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                setSelectedTarget(null);
                setAllMunicipalityTargets(null);
            }}>
                <MunicipalityTargetForms
                    targetData={selectedTarget}
                    allMunicipalityTargets={allMunicipalityTargets}
                />
            </Modal>
        </div>
    );
};

export default MunicipalityTargetList;
