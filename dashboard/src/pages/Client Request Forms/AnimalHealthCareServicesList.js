import React, { useEffect, useState } from 'react';
import axiosInstance from '../../component/axiosInstance';

function AnimalHealthCareServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/api/animal-health-care-services');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to fetch services");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Animal Health Care Services List</h2>
      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-4">No.</th>
              <th className="border border-gray-300 p-4">Client Name</th>
              <th className="border border-gray-300 p-4">Municipality</th>
              <th className="border border-gray-300 p-4">Service Date</th>
              <th className="border border-gray-300 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td className="border border-gray-300 p-4">{index + 1}</td>
                <td className="border border-gray-300 p-4">{service.clientInfo.name}</td>
                <td className="border border-gray-300 p-4">{service.clientInfo.municipality}</td>
                <td className="border border-gray-300 p-4">{new Date(service.createdAt).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-4">
                  {/* Here you can add buttons for actions like Edit or Delete */}
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AnimalHealthCareServicesList;
