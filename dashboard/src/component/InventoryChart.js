import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axiosInstance from './axiosInstance';

const InventoryChart = () => {
    const [barChartData, setBarChartData] = useState(null);
    const [lowStockItems, setLowStockItems] = useState([]);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axiosInstance.get('/api/inventory');
                const data = response.data;

                // Prepare Bar Chart Data: Total supplies by type
                const types = Array.from(new Set(data.map(item => item.type)));
                const typeTotals = types.map(type => {
                    return data
                        .filter(item => item.type === type)
                        .reduce((sum, item) => sum + item.total, 0);
                });

                setBarChartData({
                    labels: types,
                    datasets: [
                        {
                            label: 'Total Supplies by Type',
                            data: typeTotals,
                            backgroundColor: ["#1b5b40", "#ffe459", "#123c29", "#e5cd50"],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                            borderWidth: 1,
                        },
                    ],
                });

                // Identify Low Stock Items (threshold: quantity < 10)
                const lowStockThreshold = 10;
                const lowStock = data.filter(item => item.quantity < lowStockThreshold);
                setLowStockItems(lowStock);

            } catch (error) {
                console.error('Error fetching inventory data:', error);
            }
        };

        fetchInventory();
    }, []);

    return (
        <div>
            {/* Analysis Section */}
            <div>
                <h3 className="text-2xl font-bold text-darkgreen border-b-2 border-darkgreen pb-2">
                    Analysis: Low Stock Items
                </h3>
                {lowStockItems.length > 0 ? (
                    <ul className="text-gray-800 mt-4 text-lg leading-relaxed">
                        {lowStockItems.map(item => (
                            <li key={item._id}>
                                <strong>{item.supplies}</strong> from <strong>{item.source}</strong> has only <strong>{item.quantity}</strong> left.
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-800 mt-4 text-lg leading-relaxed">
                        All items are sufficiently stocked.
                    </p>
                )}
            </div>



            {/* Bar Chart */}
            {barChartData && (
                <div>

                    <Bar
                        data={barChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                            },
                        }}
                    />
                </div>
            )}


        </div>
    );
};

export default InventoryChart;
