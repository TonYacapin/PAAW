import React, { useState } from 'react';
import axiosInstance from '../component/axiosInstance';
import Papa from 'papaparse';
import FormSubmit from '../component/FormSubmit';
import ConfirmationModal from '../component/ConfirmationModal';
import BarangayDropDown from '../component/BarangayDropDown';

const OffspringMonitoring = () => {
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [entryToRemove, setEntryToRemove] = useState(null);

    // Main fields state
    const [municipality, setMunicipality] = useState('');
    const [dateReported, setDateReported] = useState('');

    const addEntry = () => {
        setEntries([
            ...entries,
            {
                no: entries.length + 1,
                name: '',
                dateOfAi: '',
                dateOfMonitoring: '',
                barangay: '',
                species: '',
                aiTech: '',
                calvingDate: '',
                sex: '',
            },
        ]);
        setSelectedEntry(entries.length);
    };

    const openConfirmationModal = (index) => {
        setEntryToRemove(index);
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmRemove = () => {
        if (entryToRemove !== null) {
            const newEntries = entries.filter((_, i) => i !== entryToRemove);

            const updatedEntries = newEntries.map((entry, i) => ({
                ...entry,
                no: i + 1,
            }));

            setEntries(updatedEntries);

            if (selectedEntry === entryToRemove) {
                setSelectedEntry(null);
            } else if (selectedEntry > entryToRemove) {
                setSelectedEntry(selectedEntry - 1);
            }
        }
        setIsConfirmationModalOpen(false);
        setEntryToRemove(null);
    };

    const handleCancelRemove = () => {
        setIsConfirmationModalOpen(false);
        setEntryToRemove(null);
    };

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const openModal = (index) => {
        setSelectedEntry(index);
    };

    const closeModal = () => {
        setSelectedEntry(null);
    };

    const saveEntries = async () => {
        try {
            console.log(entries);
            const response = await axiosInstance.post(`/api/offspring-monitoring`, {
                municipality,
                dateReported,
                entries,
            });
            if (response.status === 201) {
                alert('Entries saved successfully');
                setEntries([]);
                setMunicipality('');
                setDateReported('');
            }
        } catch (error) {
            console.error('Error saving entries:', error);
            alert('Failed to save entries');
        }
    };

    const exportAsCSV = () => {
        const data = [];

        data.push({
            Municipality: municipality,
            DateReported: dateReported,
            no: '',
            Name: '',
            DateOfAi: '',
            DateOfMonitoring: '',
            Barangay: '',
            Species: '',
            AiTech: '',
            CalvingDate: '',
            Sex: '',
        });

        entries.forEach((entry) => {
            data.push({
                Municipality: '',
                DateReported: '',
                no: entry.no,
                Name: entry.name,
                DateOfAi: entry.dateOfAi,
                DateOfMonitoring: entry.dateOfMonitoring,
                Barangay: entry.barangay,
                Species: entry.species,
                AiTech: entry.aiTech,
                CalvingDate: entry.calvingDate,
                Sex: entry.sex,
            });
        });

        const csv = Papa.unparse(data);
        const date = new Date().toISOString().split('T')[0];
        const fileName = `offspring_monitoring_report_${municipality}_${date}.csv`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importCSV = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const importedData = results.data;
                const mainFields = importedData[0];
                setMunicipality(mainFields.Municipality);
                setDateReported(mainFields.DateReported);

                const importedEntries = importedData.slice(1).map((entry, index) => ({
                    no: index + 1,
                    name: entry.Name,
                    dateOfAi: entry.DateOfAi,
                    dateOfMonitoring: entry.DateOfMonitoring,
                    barangay: entry.Barangay,
                    species: entry.Species,
                    aiTech: entry.AiTech,
                    calvingDate: entry.CalvingDate,
                    sex: entry.Sex,
                }));

                setEntries(importedEntries);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                alert('Failed to import CSV file.');
            },
        });
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Offspring Monitoring Report</h2>

                {/* Main fields */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label htmlFor="municipality" className="block mb-1">Municipality</label>
                        <select
                            id="municipality"
                            value={municipality}
                            onChange={(e) => setMunicipality(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Select Municipality</option>
                            <option value="Ambaguio">Ambaguio</option>
                            <option value="Bagabag">Bagabag</option>
                            <option value="Bayombong">Bayombong</option>
                            <option value="Diadi">Diadi</option>
                            <option value="Quezon">Quezon</option>
                            <option value="Solano">Solano</option>
                            <option value="Villaverde">Villaverde</option>
                            <option value="Alfonso Castañeda">Alfonso Castañeda</option>
                            <option value="Aritao">Aritao</option>
                            <option value="Bambang">Bambang</option>
                            <option value="Dupax del Norte">Dupax del Norte</option>
                            <option value="Dupax del Sur">Dupax del Sur</option>
                            <option value="Kayapa">Kayapa</option>
                            <option value="Kasibu">Kasibu</option>
                            <option value="Santa Fe">Santa Fe</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dateReported" className="block mb-1">Date Reported</label>
                        <input
                            id="dateReported"
                            type="date"
                            value={dateReported}
                            onChange={(e) => setDateReported(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>

                {/* Modal for Editing Entries */}
                {selectedEntry !== null && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-4">Edit Offspring Monitoring Entry {entries[selectedEntry].no}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="name" className="block mb-1">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={entries[selectedEntry].name}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'name', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dateOfAi" className="block mb-1">Date of AI</label>
                                    <input
                                        id="dateOfAi"
                                        type="date"
                                        value={entries[selectedEntry].dateOfAi}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'dateOfAi', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dateOfMonitoring" className="block mb-1">Date of Monitoring</label>
                                    <input
                                        id="dateOfMonitoring"
                                        type="date"
                                        value={entries[selectedEntry].dateOfMonitoring}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'dateOfMonitoring', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <BarangayDropDown municipality={municipality} onChange={(e) => handleEntryChange(selectedEntry, 'barangay', e.target.value)}/>
                                </div>
                                {/* <div>
                                    <label htmlFor="barangay" className="block mb-1">Barangay</label>
                                    <input
                                        id="barangay"
                                        type="text"
                                        value={entries[selectedEntry].barangay}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'barangay', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div> */}
                                <div>
                                    <label htmlFor="species" className="block mb-1">Species</label>
                                    <input
                                        id="species"
                                        type="text"
                                        value={entries[selectedEntry].species}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'species', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="aiTech" className="block mb-1">AI Tech</label>
                                    <input
                                        id="aiTech"
                                        type="text"
                                        value={entries[selectedEntry].aiTech}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'aiTech', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="calvingDate" className="block mb-1">Calving Date</label>
                                    <input
                                        id="calvingDate"
                                        type="date"
                                        value={entries[selectedEntry].calvingDate}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'calvingDate', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sex" className="block mb-1">Sex</label>
                                    <select
                                        id="sex"
                                        value={entries[selectedEntry].sex}
                                        onChange={(e) => handleEntryChange(selectedEntry, 'sex', e.target.value)}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">Select Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded mr-2"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                    message="Are you sure you want to remove this entry?"
                />

                <div>
                    <button
                        type="button"
                        onClick={addEntry}
                        className="mb-4 px-4 py-2 bg-darkgreen text-white rounded"
                    >
                        + Add Entry
                    </button>
                    <div className="max-h-[40vh] overflow-auto">
                        {entries.map((entry, index) => (
                            <div key={index} className="mb-4 p-4 border rounded bg-gray-100">
                                <h3 className="text-xl font-semibold mb-2">Entry {entry.no}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <p>Name: {entry.name || 'N/A'}</p>
                                    <p>Date of AI: {entry.dateOfAi || 'N/A'}</p>
                                    <p>Date of Monitoring: {entry.dateOfMonitoring || 'N/A'}</p>
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
                    <div className="mb-3" />
                </div>
                <FormSubmit
                    handleImportCSV={importCSV}
                    handleExportCSV={exportAsCSV}
                    handleSubmit={saveEntries}
                />
        </div>
        </>
    );
};

export default OffspringMonitoring;