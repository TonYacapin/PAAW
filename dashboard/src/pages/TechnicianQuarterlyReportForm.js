import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import FormSubmit from '../component/FormSubmit';
import ConfirmationModal from '../component/ConfirmationModal';

const TechnicianQuarterlyReportForm = () => {
    const [formData, setFormData] = useState({
        technicianName: '',
        municipality: '',
        province: '',
        remarks: '',
        dateSubmitted: '',
        animalEntries: []
    });
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [entryToRemove, setEntryToRemove] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addAnimalEntry = () => {
        setFormData({
            ...formData,
            animalEntries: [
                ...formData.animalEntries,
                {
                    no: formData.animalEntries.length + 1,
                    farmerName: '',
                    address: '',
                    damIdNo: '',
                    breed: '',
                    color: '',
                    estrus: '',
                    dateOfAI: '',
                    sireId: '',
                    aiServiceNo: '',
                    dateCalved: '',
                    classification: '',
                    sex: '',
                    calveColor: ''
                }
            ]
        });
        setSelectedEntry(formData.animalEntries.length);
    };

    const openConfirmationModal = (index) => {
        setEntryToRemove(index);
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmRemove = () => {
        if (entryToRemove !== null) {
            const newEntries = formData.animalEntries.filter((_, i) => i !== entryToRemove);
            const updatedEntries = newEntries.map((entry, i) => ({ ...entry, no: i + 1 }));
            setFormData({ ...formData, animalEntries: updatedEntries });
        }
        setIsConfirmationModalOpen(false);
        setEntryToRemove(null);
    };

    const handleCancelRemove = () => {
        setIsConfirmationModalOpen(false);
        setEntryToRemove(null);
    };

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...formData.animalEntries];
        newEntries[index][field] = value;
        setFormData({ ...formData, animalEntries: newEntries });
    };

    const openModal = (index) => {
        setSelectedEntry(index);
    };

    const closeModal = () => {
        setSelectedEntry(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('YOUR_API_ENDPOINT', formData);
            if (response.status === 201) {
                setAlert({ show: true, message: 'Report submitted successfully', type: 'success' });
                // Reset form or handle successful submission
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            setAlert({ show: true, message: 'Failed to submit report', type: 'error' });
        }
    };

    const exportAsCSV = () => {
        const csvData = [
            [
                'Technician Name',
                'Municipality',
                'Province',
                'Remarks',
                'Date Submitted',
                'Farmer Name',
                'Address',
                'Dam ID No.',
                'Breed',
                'Color',
                'Estrus',
                'Date of AI',
                'Sire ID',
                'AI Service No.',
                'Date Calved',
                'Classification',
                'Sex',
                'Calve Color',
            ],
            ...formData.animalEntries.map((entry) => [
                formData.technicianName,
                formData.municipality,
                formData.province,
                formData.remarks,
                formData.dateSubmitted,
                entry.farmerName,
                entry.address,
                entry.damIdNo,
                entry.breed,
                entry.color,
                entry.estrus,
                entry.dateOfAI,
                entry.sireId,
                entry.aiServiceNo,
                entry.dateCalved,
                entry.classification,
                entry.sex,
                entry.calveColor,
            ]),
        ];

        const csvContent = Papa.unparse(csvData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'technician_quarterly_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importCSV = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            complete: (results) => {
                const [header, ...rows] = results.data;

                const technicianNameIndex = header.indexOf('Technician Name');
                const municipalityIndex = header.indexOf('Municipality');
                const provinceIndex = header.indexOf('Province');
                const remarksIndex = header.indexOf('Remarks');
                const dateSubmittedIndex = header.indexOf('Date Submitted');

                const newEntries = rows.map((row, index) => ({
                    no: index + 1,
                    farmerName: row[5] || '',
                    address: row[6] || '',
                    damIdNo: row[7] || '',
                    breed: row[8] || '',
                    color: row[9] || '',
                    estrus: row[10] || '',
                    dateOfAI: row[11] || '',
                    sireId: row[12] || '',
                    aiServiceNo: row[13] || '',
                    dateCalved: row[14] || '',
                    classification: row[15] || '',
                    sex: row[16] || '',
                    calveColor: row[17] || '',
                }));

                setFormData({
                    technicianName: rows[0][technicianNameIndex] || '',
                    municipality: rows[0][municipalityIndex] || '',
                    province: rows[0][provinceIndex] || '',
                    remarks: rows[0][remarksIndex] || '',
                    dateSubmitted: rows[0][dateSubmittedIndex] || '',
                    animalEntries: newEntries,
                });
            },
        });
    };

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-6xl bg-white shadow-md rounded p-8">
                <h1 className="text-3xl font-bold mb-4 text-[#1b5b40]">Technician's Quarterly Calf Drop Report</h1>

                {alert.show && (
                    <div className={`mb-4 p-4 rounded ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        <p>{alert.message}</p>
                    </div>
                )}

                {/* General Information */}
                <div className="border-b-2 border-gray-300 pb-4 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Technician & Report Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="technicianName">
                                AI Technician Name
                            </label>
                            <input
                                type="text"
                                id="technicianName"
                                name="technicianName"
                                value={formData.technicianName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateSubmitted">
                                Date Submitted
                            </label>
                            <input
                                type="date"
                                id="dateSubmitted"
                                name="dateSubmitted"
                                value={formData.dateSubmitted}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="municipality">
                                Municipality
                            </label>
                            <select
                                id="municipality"
                                name="municipality"
                                value={formData.municipality}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select Municipality</option>
                                <option value="Ambaguio">Ambaguio</option>
                                <option value="Bagabag">Bagabag</option>
                                <option value="Bayombong">Bayombong</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
                                Province
                            </label>
                            <input
                                type="text"
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>
                </div>

                {/* Remarks */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
                        Remarks
                    </label>
                    <textarea
                        id="remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                    />
                </div>

                {/* Animal Entries */}
                <h3 className="text-lg font-semibold mb-4">Animal Entries</h3>
                <button
                    type="button"
                    onClick={addAnimalEntry}
                    className="mb-4 px-4 py-2 bg-darkgreen text-white rounded"
                >
                    + Add Entry
                </button>
                <div className="max-h-[40vh] overflow-auto">
                    {formData.animalEntries.map((entry, index) => (
                        <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
                            <h3 className="text-xl font-semibold mb-2">Entry {entry.no}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <p>Farmer: {entry.farmerName || "N/A"}</p>
                                <p>Dam ID: {entry.damIdNo || "N/A"}</p>
                                <p>Date of AI: {entry.dateOfAI || "N/A"}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => openModal(index)}
                                className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded mr-2"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => openConfirmationModal(index)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <FormSubmit
                    handleImportCSV={importCSV}
                    handleExportCSV={exportAsCSV}
                    handleSubmit={handleSubmit}
                />
            </form>

            {/* Modal for Editing Entries */}
            {selectedEntry !== null && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">
                            Edit Animal Entry {formData.animalEntries[selectedEntry].no}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="farmerName">
                                    Farmer's Name
                                </label>
                                <input
                                    type="text"
                                    id="farmerName"
                                    value={formData.animalEntries[selectedEntry].farmerName}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'farmerName', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    value={formData.animalEntries[selectedEntry].address}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'address', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="damIdNo">
                                    Dam ID No.
                                </label>
                                <input
                                    type="text"
                                    id="damIdNo"
                                    value={formData.animalEntries[selectedEntry].damIdNo}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'damIdNo', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="breed">
                                    Breed
                                </label>
                                <input
                                    type="text"
                                    id="breed"
                                    value={formData.animalEntries[selectedEntry].breed}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'breed', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                                    Color
                                </label>
                                <input
                                    type="text"
                                    id="color"
                                    value={formData.animalEntries[selectedEntry].color}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'color', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estrus">
                                    Estrus
                                </label>
                                <input
                                    type="text"
                                    id="estrus"
                                    value={formData.animalEntries[selectedEntry].estrus}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'estrus', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfAI">
                                    Date of AI
                                </label>
                                <input
                                    type="date"
                                    id="dateOfAI"
                                    value={formData.animalEntries[selectedEntry].dateOfAI}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'dateOfAI', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sireId">
                                    Sire ID
                                </label>
                                <input
                                    type="text"
                                    id="sireId"
                                    value={formData.animalEntries[selectedEntry].sireId}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'sireId', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aiServiceNo">
                                    AI Service No.
                                </label>
                                <input
                                    type="text"
                                    id="aiServiceNo"
                                    value={formData.animalEntries[selectedEntry].aiServiceNo}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'aiServiceNo', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateCalved">
                                    Date Calved
                                </label>
                                <input
                                    type="date"
                                    id="dateCalved"
                                    value={formData.animalEntries[selectedEntry].dateCalved}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'dateCalved', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classification">
                                    Classification
                                </label>
                                <input
                                    type="text"
                                    id="classification"
                                    value={formData.animalEntries[selectedEntry].classification}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'classification', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sex">
                                    Sex
                                </label>
                                <select
                                    id="sex"
                                    value={formData.animalEntries[selectedEntry].sex}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'sex', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="calveColor">
                                    Calve Color
                                </label>
                                <input
                                    type="text"
                                    id="calveColor"
                                    value={formData.animalEntries[selectedEntry].calveColor}
                                    onChange={(e) => handleEntryChange(selectedEntry, 'calveColor', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded mr-2"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Entry Deletion */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
                message="Are you sure you want to remove this entry?"
            />
        </div>
    );
};

export default TechnicianQuarterlyReportForm;
