import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../component/axiosInstance";
import VeterinaryShipmentForm from "./VeterinaryShipmentForm";
import Modal from "../../component/Modal";

const VeterinaryShipmentList = () => {
  const [shipments, setShipments] = useState([]); // State for fetched shipments
  const [filter, setFilter] = useState({
    type: "",
    date: "",
    shipper: "",
    liveAnimal: "",
    animalByProduct: "",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [showAnalysis, setshowAnalysis] = useState(false); // Added state for filter visibility

  const fetchShipments = async () => {
    try {
      const response = await axiosInstance.get(`/api/vetshipform`);
      setShipments(response.data); // Set fetched data to state
    } catch (error) {
      console.error("Error fetching shipments:", error);
    }
  };

  useEffect(() => {
    fetchShipments(); // Fetch shipments on component mount
  }, [shipments]);
  // Fetch data from the API
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axiosInstance.get(`/api/vetshipform`);
        setShipments(response.data); // Set fetched data to state
      } catch (error) {
        console.error("Error fetching shipments:", error);
      }
    };
    fetchShipments();
  }, []);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesType = filter.type
        ? shipment.shipmentType === filter.type
        : true;
      const matchesDate = filter.date
        ? shipment.date.split("T")[0] === filter.date
        : true;
      const matchesShipper = filter.shipper
        ? shipment.shipperName
            .toLowerCase()
            .includes(filter.shipper.toLowerCase())
        : true;
      const matchesLiveAnimal = filter.liveAnimal
        ? shipment.liveAnimals[filter.liveAnimal] > 0
        : true;
      const matchesAnimalByProduct = filter.animalByProduct
        ? shipment.animalByProducts[filter.animalByProduct] > 0
        : true;

      return (
        matchesType &&
        matchesDate &&
        matchesShipper &&
        matchesLiveAnimal &&
        matchesAnimalByProduct
      );
    });
  }, [shipments, filter]);

  // Analysis Data
  const analysisData = useMemo(() => {
    const totalShipments = filteredShipments.length;
    let totalLiveAnimals = 0;
    let totalAnimalByProducts = 0;

    filteredShipments.forEach((shipment) => {
      if (filter.liveAnimal) {
        totalLiveAnimals += shipment.liveAnimals[filter.liveAnimal] || 0;
      } else {
        totalLiveAnimals += Object.values(shipment.liveAnimals).reduce(
          (sum, count) => sum + count,
          0
        );
      }

      if (filter.animalByProduct) {
        totalAnimalByProducts +=
          shipment.animalByProducts[filter.animalByProduct] || 0;
      } else {
        totalAnimalByProducts += Object.values(
          shipment.animalByProducts
        ).reduce((sum, count) => sum + count, 0);
      }
    });

    return { totalShipments, totalLiveAnimals, totalAnimalByProducts };
  }, [filteredShipments, filter]);

  const handleNewShipment = async (data) => {
    try {
      const response = await axiosInstance.post(`/api/vetshipform`, data);
      setShipments([...shipments, response.data]); // Update the shipments list with the new shipment
      setModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error adding new shipment:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-black mb-8">
        Veterinary Shipment List
      </h2>

      {/* Filter Section */}
      <div className="flex justify-between mb-4"></div>

      <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
          {shipments[0] &&
            Object.keys(shipments[0].liveAnimals).map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
        </select>
        <select
          name="animalByProduct"
          value={filter.animalByProduct}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">Filter by Animal By-Product</option>
          {shipments[0] &&
            Object.keys(shipments[0].animalByProducts).map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
        </select>
      </div>

      {/* Analysis Section */}
      {showAnalysis && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Analysis</h3>
          <p>Total Shipments: {analysisData.totalShipments}</p>
          <p>Total Live Animals: {analysisData.totalLiveAnimals}</p>
          <p>Total Animal By-Products: {analysisData.totalAnimalByProducts}</p>
        </div>
      )}

      <div className="flex flex-row gap-2">
        {" "}
        <button
          onClick={() => setModalOpen(true)}
          className="bg-darkgreen hover:bg-darkergreen text-white rounded px-4 py-2"
        >
          Add Shipment
        </button>
        <button
          onClick={() => setshowAnalysis(!showAnalysis)} // Toggle filter visibility
          className="bg-darkgreen hover:bg-darkergreen text-white rounded px-4 py-2"
        >
          {showAnalysis ? "Hide Analysis" : "Show Analysis"}
        </button>
      </div>
      {/* Button to Open Modal */}

      {/* Modal for Adding New Shipment */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <VeterinaryShipmentForm onSubmit={handleNewShipment} />
      </Modal>

      {/* Shipments Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-[#1b5b40] text-white">
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
            const liveAnimalEntries = Object.entries(
              shipment.liveAnimals
            ).filter(
              ([animal, count]) =>
                count > 0 &&
                (!filter.liveAnimal || animal === filter.liveAnimal)
            );
            const animalByProductEntries = Object.entries(
              shipment.animalByProducts
            ).filter(
              ([product, count]) =>
                count > 0 &&
                (!filter.animalByProduct || product === filter.animalByProduct)
            );

            const maxRows = Math.max(
              liveAnimalEntries.length,
              animalByProductEntries.length
            );

            return Array.from({ length: maxRows }).map((_, index) => (
              <tr key={`${shipment._id}-${index}`}>
                {index === 0 && (
                  <>
                    <td
                      className="border border-gray-300 p-2"
                      rowSpan={maxRows}
                    >
                      {shipment.shipmentType}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      rowSpan={maxRows}
                    >
                      {shipment.shipperName}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      rowSpan={maxRows}
                    >
                      {new Date(shipment.date).toLocaleDateString()}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      rowSpan={maxRows}
                    >
                      {shipment.pointOfOrigin}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      rowSpan={maxRows}
                    >
                      {shipment.remarks}
                    </td>
                  </>
                )}

                <td className="border border-gray-300 p-2">
                  {liveAnimalEntries[index]
                    ? `${liveAnimalEntries[index][0]} (${liveAnimalEntries[index][1]})`
                    : ""}
                </td>
                <td className="border border-gray-300 p-2">
                  {animalByProductEntries[index]
                    ? `${animalByProductEntries[index][0]} (${animalByProductEntries[index][1]})`
                    : ""}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VeterinaryShipmentList;
