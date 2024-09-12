// src/components/AdvancedRabiesReportChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie, Doughnut, Bubble, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, ArcElement, BubbleController, ScatterController, PointElement } from 'chart.js';

ChartJS.register(
    Tooltip,
    Legend,
    Title,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    BubbleController,
    ScatterController,
    PointElement
);

const RabiesReportChart = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ dateRange: [null, null], municipality: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.0.112:5000/api/entries');
                const reports = response.data;

                // Apply filters
                let filteredReports = reports;

                if (filters.dateRange[0] && filters.dateRange[1]) {
                    filteredReports = filteredReports.filter(report => {
                        const reportDate = new Date(report.dateReported).getTime();
                        return reportDate >= new Date(filters.dateRange[0]).getTime() && reportDate <= new Date(filters.dateRange[1]).getTime();
                    });
                }

                if (filters.municipality) {
                    filteredReports = filteredReports.filter(report => report.municipality === filters.municipality);
                }

                // Data structures for charts
                const municipalityCounts = {};
                const vaccineCounts = {};
                const dateCounts = {};
                const sexCounts = {};
                const bubbleData = [];
                const scatterData = [];

                // Process each filtered report
                filteredReports.forEach((report) => {
                    const { municipality, vaccineUsed, entries } = report;

                    // Municipality and vaccine data
                    if (!municipalityCounts[municipality]) municipalityCounts[municipality] = 0;
                    if (!vaccineCounts[vaccineUsed]) vaccineCounts[vaccineUsed] = 0;

                    entries.forEach(entry => {
                        const date = new Date(entry.date).toLocaleDateString();
                        const sex = entry.clientInfo.gender;

                        // Municipality data
                        municipalityCounts[municipality] += 1;

                        // Vaccine type data
                        vaccineCounts[vaccineUsed] += 1;

                        // Date-based data
                        if (!dateCounts[date]) dateCounts[date] = 0;
                        dateCounts[date] += 1;

                        // Sex-based data
                        if (!sexCounts[sex]) sexCounts[sex] = 0;
                        sexCounts[sex] += 1;

                        // Bubble chart data
                        bubbleData.push({
                            x: new Date(entry.date).getTime(), // Date in timestamp
                            y: municipalityCounts[municipality],
                            r: 5 // Bubble radius
                        });

                        // Scatter chart data
                        scatterData.push({
                            x: new Date(entry.date).getTime(), // X-axis: Date
                            y: Object.keys(municipalityCounts).indexOf(municipality), // Y-axis: Municipality
                            r: 5 // Radius to simulate density
                        });
                    });
                });

                // Prepare chart data
                setData({
                    lineChart: {
                        labels: Object.keys(municipalityCounts),
                        datasets: [
                            {
                                label: 'Vaccinations per Municipality',
                                data: Object.values(municipalityCounts),
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderWidth: 1,
                            }
                        ],
                    },
                    barChart: {
                        labels: Object.keys(vaccineCounts),
                        datasets: [
                            {
                                label: 'Vaccinations per Vaccine Type',
                                data: Object.values(vaccineCounts),
                                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                borderWidth: 1,
                            }
                        ],
                    },
                    pieChart: {
                        labels: Object.keys(sexCounts),
                        datasets: [
                            {
                                label: 'Vaccinations by Animal Sex',
                                data: Object.values(sexCounts),
                                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                                borderWidth: 1,
                            }
                        ],
                    },
                    doughnutChart: {
                        labels: Object.keys(vaccineCounts),
                        datasets: [
                            {
                                label: 'Vaccine Distribution',
                                data: Object.values(vaccineCounts),
                                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                                borderWidth: 1,
                            }
                        ],
                    },
                    bubbleChart: {
                        datasets: [
                            {
                                label: 'Vaccinations Over Time',
                                data: bubbleData,
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderWidth: 1,
                            }
                        ],
                    },
                    scatterChart: {
                        datasets: [
                            {
                                label: 'Vaccination Frequency',
                                data: scatterData,
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                borderWidth: 1,
                            }
                        ],
                        options: {
                            scales: {
                                x: {
                                    type: 'linear',
                                    position: 'bottom',
                                },
                                y: {
                                    type: 'category',
                                    labels: Object.keys(municipalityCounts),
                                },
                            },
                        }
                    }
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            dateRange: name === 'startDate'
                ? [value, prev.dateRange[1]]
                : [prev.dateRange[0], value]
        }));
    };

    const handleMunicipalityChange = (e) => {
        setFilters(prev => ({ ...prev, municipality: e.target.value }));
    };

    if (loading) {
        return <div>Loading chart data...</div>;
    }

    return (
        <div>
            <h2>Rabies Vaccination Reports</h2>

            {/* Filter Controls */}
            <div>
                <label>
                    Start Date:
                    <input type="date" name="startDate" onChange={handleDateChange} />
                </label>
                <label>
                    End Date:
                    <input type="date" name="endDate" onChange={handleDateChange} />
                </label>
                <label>
                    Municipality:
                    <input type="text" value={filters.municipality} onChange={handleMunicipalityChange} />
                </label>
            </div>

            {/* Line Chart */}
            <div>
                <h3>Vaccinations per Municipality</h3>
                <Line data={data.lineChart} />
            </div>

            {/* Bar Chart */}
            <div>
                <h3>Vaccinations per Vaccine Type</h3>
                <Bar data={data.barChart} />
            </div>

            {/* Pie Chart */}
            <div>
                <h3>Vaccinations by Animal Sex</h3>
                <Pie data={data.pieChart} />
            </div>

            {/* Doughnut Chart */}
            <div>
                <h3>Vaccine Distribution</h3>
                <Doughnut data={data.doughnutChart} />
            </div>

        </div>

    );
};

export default RabiesReportChart;
