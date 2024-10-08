import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import FormSubmit from '../component/FormSubmit';


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

    const handleChange = (e, index = null, field = null) => {
        if (index !== null && field) {
            const updatedEntries = [...formData.animalEntries];
            updatedEntries[index][field] = e.target.value;
            setFormData({ ...formData, animalEntries: updatedEntries });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
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

                const newEntries = rows.map((row) => ({
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
        <>
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-6xl bg-white shadow-md rounded p-8 overflow-auto h-[60vh]">
                <h1 className="text-3xl font-bold mb-4 text-[#1b5b40]">Technician's Quarterly Calf Drop Report</h1>

                {alert.show && (
                    <div className={`mb-4 p-4 rounded ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        <p>{alert.message}</p>
                    </div>
                )}

                {/* General Information */}
                <div className="border-b-2 border-gray-300 pb-4 mb-4">
                    <h1 className="text-xl font-semibold mb-4">Technician & Report Information</h1>
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
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
                        Remarks
                    </label>
                    <textarea
                        id="remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none             focus:shadow-outline"
                        rows="4"
                    />
                </div>

                {/* Animal Entries */}
                <h3 className="text-lg font-semibold mb-4">Animal Entries</h3>
                {formData.animalEntries.map((entry, index) => (
                    <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`farmerName_${index}`}>
                                    Farmer's Name
                                </label>
                                <input
                                    type="text"
                                    id={`farmerName_${index}`}
                                    name="farmerName"
                                    value={entry.farmerName}
                                    onChange={(e) => handleChange(e, index, 'farmerName')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`address_${index}`}>
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id={`address_${index}`}
                                    name="address"
                                    value={entry.address}
                                    onChange={(e) => handleChange(e, index, 'address')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`damIdNo_${index}`}>
                                    Dam ID No.
                                </label>
                                <input
                                    type="text"
                                    id={`damIdNo_${index}`}
                                    name="damIdNo"
                                    value={entry.damIdNo}
                                    onChange={(e) => handleChange(e, index, 'damIdNo')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`breed_${index}`}>
                                    Breed
                                </label>
                                <input
                                    type="text"
                                    id={`breed_${index}`}
                                    name="breed"
                                    value={entry.breed}
                                    onChange={(e) => handleChange(e, index, 'breed')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`color_${index}`}>
                                    Color
                                </label>
                                <input
                                    type="text"
                                    id={`color_${index}`}
                                    name="color"
                                    value={entry.color}
                                    onChange={(e) => handleChange(e, index, 'color')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`estrus_${index}`}>
                                    Estrus
                                </label>
                                <input
                                    type="text"
                                    id={`estrus_${index}`}
                                    name="estrus"
                                    value={entry.estrus}
                                    onChange={(e) => handleChange(e, index, 'estrus')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`dateOfAI_${index}`}>
                                    Date of AI
                                </label>
                                <input
                                    type="date"
                                    id={`dateOfAI_${index}`}
                                    name="dateOfAI"
                                    value={entry.dateOfAI}
                                    onChange={(e) => handleChange(e, index, 'dateOfAI')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`sireId_${index}`}>
                                    Sire ID
                                </label>
                                <input
                                    type="text"
                                    id={`sireId_${index}`}
                                    name="sireId"
                                    value={entry.sireId}
                                    onChange={(e) => handleChange(e, index, 'sireId')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`aiServiceNo_${index}`}>
                                    AI Service No.
                                </label>
                                <input
                                    type="text"
                                    id={`aiServiceNo_${index}`}
                                    name="aiServiceNo"
                                    value={entry.aiServiceNo}
                                    onChange={(e) => handleChange(e, index, 'aiServiceNo')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`dateCalved_${index}`}>
                                    Date Calved
                                </label>
                                <input
                                    type="date"
                                    id={`dateCalved_${index}`}
                                    name="dateCalved"
                                    value={entry.dateCalved}
                                    onChange={(e) => handleChange(e, index, 'dateCalved')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`classification_${index}`}>
                                    Classification
                                </label>
                                <input
                                    type="text"
                                    id={`classification_${index}`}
                                    name="classification"
                                    value={entry.classification}
                                    onChange={(e) => handleChange(e, index, 'classification')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`sex_${index}`}>
                                    Sex
                                </label>
                                <select
                                    id={`sex_${index}`}
                                    name="sex"
                                    value={entry.sex}
                                    onChange={(e) => handleChange(e, index, 'sex')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`calveColor_${index}`}>
                                    Calve Color
                                </label>
                                <input
                                    type="text"
                                    id={`calveColor_${index}`}
                                    name="calveColor"
                                    value={entry.calveColor}
                                    onChange={(e) => handleChange(e, index, 'calveColor')}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => openConfirmationModal(index)}
                            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Remove Entry
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addAnimalEntry}
                    className="mb-4 px-4 py-2 bg-darkgreen text-white rounded"
                >
                    Add Animal Entry
                </button>
                <FormSubmit
        handleImportCSV={importCSV}
        handleExportCSV={exportAsCSV}
        handleSubmit={handleSubmit}
      />
                

                {/* Confirmation Modal */}
                {isConfirmationModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h3 className="text-lg font-semibold">Confirm Removal</h3>
                            <h4>Are you sure you want to remove this entry?</h4>
                            <div className='mt-4'></div>
                            <div className="flex justify-end gap-4">
                                
                                <button
                                    onClick={() => setIsConfirmationModalOpen(false)}
                                    className="px-4 py-2 bg-darkgreen text-white rounded"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleConfirmRemove}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
        </>
    );
};

export default TechnicianQuarterlyReportForm;

