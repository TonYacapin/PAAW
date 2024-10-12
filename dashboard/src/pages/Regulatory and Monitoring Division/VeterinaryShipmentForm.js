import React, { useState } from 'react';
import StepperComponent from '../../component/StepperComponent';

const VeterinaryShipmentForm = () => {
  const [shipmentType, setShipmentType] = useState('');
  const [shipperName, setShipperName] = useState('');
  const [date, setDate] = useState('');
  const [pointOfOrigin, setPointOfOrigin] = useState('');
  const [remarks, setRemarks] = useState('');
  
  const [liveAnimals, setLiveAnimals] = useState({
    Carabao: 0,
    Cattle: 0,
    Swine: 0,
    Horse: 0,
    Chicken: 0,
    Duck: 0,
    Other: 0,
  });

  const [animalByProducts, setAnimalByProducts] = useState({
    Beef: 0,
    Carabeef: 0,
    Pork: 0,
    PoultryMeat: 0,
    Egg: 0,
    ChickenDung: 0,
  });

  const handleLiveAnimalChange = (e) => {
    setLiveAnimals({ ...liveAnimals, [e.target.name]: e.target.value });
  };

  const handleAnimalByProductChange = (e) => {
    setAnimalByProducts({ ...animalByProducts, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      shipmentType,
      shipperName,
      date,
      pointOfOrigin,
      remarks,
      liveAnimals,
      animalByProducts,
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <fieldset className="border border-gray-300 rounded p-4">
              <legend className="font-semibold text-darkgreen">Shipment Type</legend>
              <div className="flex space-x-8">
                <div className="flex items-center">
                  <input
                    type="radio"
                    value="Outgoing"
                    checked={shipmentType === 'Outgoing'}
                    onChange={(e) => setShipmentType(e.target.value)}
                    className="mr-2 text-darkgreen border-gray-300 focus:ring-darkgreen"
                  />
                  <label className="text-black">Outgoing Shipment</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    value="Incoming"
                    checked={shipmentType === 'Incoming'}
                    onChange={(e) => setShipmentType(e.target.value)}
                    className="mr-2 text-darkgreen border-gray-300 focus:ring-darkgreen"
                  />
                  <label className="text-black">Incoming Shipment</label>
                </div>
              </div>
            </fieldset>
            <div>
              <label className="block mb-1 text-black">
                Name of Shippers:
                <input
                  type="text"
                  value={shipperName}
                  onChange={(e) => setShipperName(e.target.value)}
                  required
                  placeholder="Enter shipper's name"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-darkgreen"
                />
              </label>
            </div>
            <div>
              <label className="block mb-1 text-black">
                Date:
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-darkgreen"
                />
              </label>
            </div>
          </div>
        );
      case 1:
        return (
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="font-semibold text-darkgreen">Live Animals</legend>
            {Object.keys(liveAnimals).map((animal) => (
              <div key={animal} className="flex justify-between items-center mb-2">
                <label className="block text-black">{animal}:</label>
                <input
                  type="number"
                  name={animal}
                  value={liveAnimals[animal]}
                  onChange={handleLiveAnimalChange}
                  min="0"
                  placeholder="0"
                  className="border border-gray-300 rounded p-3 w-1/3 focus:outline-none focus:ring-2 focus:ring-darkgreen"
                />
              </div>
            ))}
          </fieldset>
        );
      case 2:
        return (
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="font-semibold text-darkgreen">Animal By Products</legend>
            {Object.keys(animalByProducts).map((product) => (
              <div key={product} className="flex justify-between items-center mb-2">
                <label className="block text-black">{product}:</label>
                <input
                  type="number"
                  name={product}
                  value={animalByProducts[product]}
                  onChange={handleAnimalByProductChange}
                  min="0"
                  placeholder="0"
                  className="border border-gray-300 rounded p-3 w-1/3 focus:outline-none focus:ring-2 focus:ring-darkgreen"
                />
              </div>
            ))}
          </fieldset>
        );
      case 3:
        return (
          <div>
            <div>
              <label className="block mb-1 text-black">
                Point of Origin:
                <input
                  type="text"
                  value={pointOfOrigin}
                  onChange={(e) => setPointOfOrigin(e.target.value)}
                  placeholder="Enter point of origin"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-darkgreen"
                />
              </label>
            </div>
            <div>
              <label className="block mb-1 text-black">
                Remarks:
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Additional remarks (optional)"
                  className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-darkgreen"
                  rows="4"
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-darkgreen text-center">Veterinary Shipment Form</h2>
      <StepperComponent
        pages={['Step 1', 'Step 2', 'Step 3', 'Step 4']}
        renderStepContent={renderStepContent}
      />
      <button
        type="submit"
        className="bg-darkgreen text-white p-4 rounded hover:bg-darkergreen transition duration-200 w-full"
      >
        Submit
      </button>
    </form>
  );
};

export default VeterinaryShipmentForm;
