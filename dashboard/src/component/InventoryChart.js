import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axiosInstance from './axiosInstance';
import ChartGroup from './ChartGroup'; // Import your ChartGroup component

const InventoryChart = () => {
    const [barChartData, setBarChartData] = useState(null);
    const [suppliesCountData, setSuppliesCountData] = useState(null); // New state for supplies count chart
    const [outData, setOutData] = useState(null); // New state for 'out' chart data
    const [lowStockItems, setLowStockItems] = useState([]);
    const [selectedChart, setSelectedChart] = useState(null); // State for selected chart

    
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

                // Aggregate Quantities for Supplies Count Chart: Avoid duplicates
                const aggregatedData = data.reduce((acc, item) => {
                    if (acc[item.supplies]) {
                        acc[item.supplies] += item.quantity; // Increment quantity if item already exists
                    } else {
                        acc[item.supplies] = item.quantity; // Add new item
                    }
                    return acc;
                }, {});

                const itemNames = Object.keys(aggregatedData);
                const itemQuantities = Object.values(aggregatedData);

                setSuppliesCountData({
                    labels: itemNames,
                    datasets: [
                        {
                            label: 'Supplies Count',
                            data: itemQuantities,
                            backgroundColor: ["#1b5b40", "#ffe459", "#123c29", "#e5cd50"],
                            borderColor: "#4b97e3",
                            borderWidth: 1,
                        },
                    ],
                });

                // Aggregate 'Out' Data for new chart: Avoid duplicates and sum 'out' quantities
                const outAggregatedData = data.reduce((acc, item) => {
                    if (acc[item.supplies]) {
                        acc[item.supplies] += item.out; // Increment out value if item already exists
                    } else {
                        acc[item.supplies] = item.out; // Add new item
                    }
                    return acc;
                }, {});

                const outItemNames = Object.keys(outAggregatedData);
                const outQuantities = Object.values(outAggregatedData);

                setOutData({
                    labels: outItemNames,
                    datasets: [
                        {
                            label: 'Out Supplies Count',
                            data: outQuantities,
                            backgroundColor: ["#1b5b40", "#ffe459", "#123c29", "#e5cd50"],
                            borderColor: "#c04e29",
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

    // Ensure data is available before rendering charts
    if (!barChartData || !suppliesCountData || !outData) {
        return <div>Loading charts...</div>; // You can display a loading spinner here if needed
    }

    // Prepare charts array for ChartGroup component
    const charts = [
        {
            label: 'Supplies Count by Item',
            content: (
                <Bar
                    data={suppliesCountData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true, position: 'top' },
                        },
                    }}
                />
            ),
            style: "col-span-2", // Added col-span-2 style
        },
        {
            label: 'Out Supplies Count by Item',
            content: (
                <Bar
                    data={outData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true, position: 'top' },
                        },
                    }}
                />
            ),
            style: "col-span-2", // Added col-span-2 style
        },
    ];

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

            {/* Chart Group Component to render all charts */}
            {charts.length > 0 && (
                <ChartGroup
                    charts={charts}
                    title="Inventory Charts"
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart} // Pass state and setter here
                />
            )}
        </div>
    );
};

export default InventoryChart;
