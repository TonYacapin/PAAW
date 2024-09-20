// TargetForm.js
import React, { useState } from 'react';
import axios from 'axios';

const TargetForm = ({ onClose }) => {
    const [type, setType] = useState('');
    const [target, setTarget] = useState('');
    const [semiAnnualTarget, setSemiAnnualTarget] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/targets`, {
                Type: type,
                target: Number(target),
                semiAnnualTarget: Number(semiAnnualTarget),
                targetDate: targetDate,
            });

            if (response.status === 201) {
                setSuccess('Target created successfully!');
                // Clear the form
                setType('');
                setTarget('');
                setSemiAnnualTarget('');
                setTargetDate('');
                // Call the onClose function to refresh the list
                onClose();
            }
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Add Target</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select a type</option>
                        <option value="Hemorrhagic Septicemia">Hemorrhagic Septicemia</option>
                        <option value="Newcastle Disease">Newcastle Disease</option>
                        <option value="Hog Cholera">Hog Cholera</option>
                        <option value="Deworming">Deworming</option>
                        <option value="Wound Treatment">Wound Treatment</option>
                        <option value="Vitamin Supplementation">Vitamin Supplementation</option>
                        <option value="Iron Supplementation">Iron Supplementation</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Support">Support</option>
                        <option value="No. of dogs immunized against rabies and registered">
                            No. of dogs immunized against rabies and registered
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Target</label>
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Semi Annual Target</label>
                    <input
                        type="number"
                        value={semiAnnualTarget}
                        onChange={(e) => setSemiAnnualTarget(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Target Date</label>
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TargetForm;
