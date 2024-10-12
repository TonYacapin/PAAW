import React, { useState, useMemo } from 'react';
import VeterinaryShipmentForm from './VeterinaryShipmentForm'; // Re-added import
import Modal from '../../component/Modal'; // Re-added import

// Sample dummy data
const dummyShipments = [
    {
        id: 1,
        shipmentType: 'Outgoing',
        shipperName: 'John Doe',
        date: '2024-10-01',
        pointOfOrigin: 'Farm A',
        remarks: 'Healthy animals',
        liveAnimals: { Carabao: 1, Cattle: 2, Swine: 3, Horse: 0, Chicken: 10, Duck: 5, Other: 0 },
        animalByProducts: { Beef: 10, Carabeef: 0, Pork: 20, PoultryMeat: 30, Egg: 50, ChickenDung: 100 },
    },
    {
        id: 2,
        shipmentType: 'Incoming',
        shipperName: 'Jane Smith',
        date: '2024-10-02',
        pointOfOrigin: 'Farm B',
        remarks: 'Some sick animals',
        liveAnimals: { Carabao: 0, Cattle: 1, Swine: 2, Horse: 1, Chicken: 15, Duck: 0, Other: 1 },
        animalByProducts: { Beef: 0, Carabeef: 5, Pork: 15, PoultryMeat: 10, Egg: 30, ChickenDung: 50 },
    },
    // Add more dummy data as needed
];

const VeterinaryShipmentList = () => {
    const [shipments] = useState(dummyShipments);
    const [filter, setFilter] = useState({ type: '', date: '', shipper: '', liveAnimal: '', animalByProduct: '' });
    const [isModalOpen, setModalOpen] = useState(false); // State to manage the modal visibility
    const [showFilters, setShowFilters] = useState(true); // State to manage filter visibility

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const filteredShipments = useMemo(() => {
        return shipments.filter(shipment => {
            const matchesType = filter.type ? shipment.shipmentType === filter.type : true;
            const matchesDate = filter.date ? shipment.date === filter.date : true;
            const matchesShipper = filter.shipper ? shipment.shipperName.toLowerCase().includes(filter.shipper.toLowerCase()) : true;
            const matchesLiveAnimal = filter.liveAnimal ? shipment.liveAnimals[filter.liveAnimal] > 0 : true;
            const matchesAnimalByProduct = filter.animalByProduct ? shipment.animalByProducts[filter.animalByProduct] > 0 : true;

            return matchesType && matchesDate && matchesShipper && matchesLiveAnimal && matchesAnimalByProduct;
        });
    }, [shipments, filter]);

    // Analysis Data
    const analysisData = useMemo(() => {
        const totalShipments = filteredShipments.length;
        let totalLiveAnimals = 0;
        let totalAnimalByProducts = 0;

        filteredShipments.forEach(shipment => {
            if (filter.liveAnimal) {
                totalLiveAnimals += shipment.liveAnimals[filter.liveAnimal] || 0;
            } else {
                totalLiveAnimals += Object.values(shipment.liveAnimals).reduce((sum, count) => sum + count, 0);
            }

            if (filter.animalByProduct) {
                totalAnimalByProducts += shipment.animalByProducts[filter.animalByProduct] || 0;
            } else {
                totalAnimalByProducts += Object.values(shipment.animalByProducts).reduce((sum, count) => sum + count, 0);
            }
        });

        return { totalShipments, totalLiveAnimals, totalAnimalByProducts };
    }, [filteredShipments, filter]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-darkgreen text-center">Veterinary Shipment List</h2>


            {/* Filter Section */}
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-darkgreen hover:bg-darkergreen text-white rounded px-4 py-2"
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

          

            {showFilters && (
                <div className="flex flex-wrap space-x-4 mb-4">
                    <select
                        name="type"
                        value={filter.type}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="">All Shipment Types</option>
                        <option value="Outgoing">Outgoing</option>
                        <option value="Incoming">Incoming</option>
                    </select>
                    <input
                        type="text"
                        name="shipper"
                        value={filter.shipper}
                        onChange={handleFilterChange}
                        placeholder="Filter by Shipper"
                        className="border border-gray-300 rounded p-2"
                    />
                    <input
                        type="date"
                        name="date"
                        value={filter.date}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded p-2"
                    />
                    <select
                        name="liveAnimal"
                        value={filter.liveAnimal}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="">Filter by Live Animal</option>
                        {Object.keys(dummyShipments[0].liveAnimals).map((animal) => (
                            <option key={animal} value={animal}>{animal}</option>
                        ))}
                    </select>
                    <select
                        name="animalByProduct"
                        value={filter.animalByProduct}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="">Filter by Animal By-Product</option>
                        {Object.keys(dummyShipments[0].animalByProducts).map((product) => (
                            <option key={product} value={product}>{product}</option>
                        ))}
                    </select>
                </div>
            )}
              {/* Analysis Section */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Analysis</h3>
                <p>Total Shipments: {analysisData.totalShipments}</p>
                <p>Total Live Animals: {analysisData.totalLiveAnimals}</p>
                <p>Total Animal By-Products: {analysisData.totalAnimalByProducts}</p>
            </div>

            {/* Button to Open Modal */}
            <button
                onClick={() => setModalOpen(true)}
                className="bg-darkgreen hover:bg-darkergreen text-white rounded px-4 py-2"
            >
                Add Shipment
            </button>

            {/* Shipments Table */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Shipment Type</th>
                        <th className="border border-gray-300 p-2">Shipper Name</th>
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Point of Origin</th>
                        <th className="border border-gray-300 p-2">Remarks</th>
                        <th className="border border-gray-300 p-2">Live Animals</th>
                        <th className="border border-gray-300 p-2">Animal By-Products</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredShipments.map((shipment) => {
                        const liveAnimalEntries = Object.entries(shipment.liveAnimals).filter(([animal, count]) =>
                            count > 0 && (!filter.liveAnimal || animal === filter.liveAnimal)
                        );
                        const animalByProductEntries = Object.entries(shipment.animalByProducts).filter(([product, count]) =>
                            count > 0 && (!filter.animalByProduct || product === filter.animalByProduct)
                        );

                        const rowsToRender = Math.max(liveAnimalEntries.length, animalByProductEntries.length);

                        return Array.from({ length: rowsToRender }).map((_, index) => (
                            <tr key={`${shipment.id}-${index}`}>
                                {index === 0 && (
                                    <>
                                        <td className="border border-gray-300 p-2" rowSpan={rowsToRender}>{shipment.shipmentType}</td>
                                        <td className="border border-gray-300 p-2" rowSpan={rowsToRender}>{shipment.shipperName}</td>
                                        <td className="border border-gray-300 p-2" rowSpan={rowsToRender}>{shipment.date}</td>
                                        <td className="border border-gray-300 p-2" rowSpan={rowsToRender}>{shipment.pointOfOrigin}</td>
                                        <td className="border border-gray-300 p-2" rowSpan={rowsToRender}>{shipment.remarks}</td>
                                    </>
                                )}
                                <td className="border border-gray-300 p-2">{liveAnimalEntries[index]?.[0] || '-'}</td>
                                <td className="border border-gray-300 p-2">{animalByProductEntries[index]?.[0] || '-'}</td>
                            </tr>
                        ));
                    })}
                </tbody>
            </table>

            {/* Modal Component */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <VeterinaryShipmentForm />
                </Modal>
            )}
        </div>
    );
};

export default VeterinaryShipmentList;
