import React, { useEffect, useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Import MUI Calendar Icon

const AuditLogList = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [userFilter, setUserFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [collectionFilter, setCollectionFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/audit-logs`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Set the Authorization header
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch audit logs');
                const data = await response.json();
                setAuditLogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditLogs();
    }, []);

    // Filtering logic
    const filteredLogs = auditLogs.filter(log => {
        const matchesUser = log.user.toLowerCase().includes(userFilter.toLowerCase());
        const matchesAction = !actionFilter || log.action.toLowerCase().includes(actionFilter.toLowerCase());
        const matchesStatus = !statusFilter || log.status === statusFilter;
        const matchesCollection = !collectionFilter || log.collectionName.toLowerCase().includes(collectionFilter.toLowerCase());

        const logDate = new Date(log.timestamp);
        const afterStartDate = !startDate || logDate >= new Date(startDate);
        const beforeEndDate = !endDate || logDate <= new Date(endDate);

        return matchesUser && matchesAction && matchesStatus && matchesCollection && afterStartDate && beforeEndDate;
    });

    // Calculate statistics
    const stats = {
        total: filteredLogs.length,
        successCount: filteredLogs.filter(log => log.status === 'success').length,
        failureCount: filteredLogs.filter(log => log.status === 'failure').length,
        uniqueUsers: new Set(filteredLogs.map(log => log.user)).size,
        uniqueActions: new Set(filteredLogs.map(log => log.action)).size
    };

    if (loading) return <div className="text-center mt-6">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-6">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Audit Logs</h2>

            {/* Statistics Panel */}
            <div className="mb-6">
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                >
                    {showStats ? 'Hide Statistics' : 'Show Statistics'}
                </button>

                {showStats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded">
                        <div className="text-center p-3 bg-white rounded shadow">
                            <div className="font-bold">Total Logs</div>
                            <div className="text-xl">{stats.total}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded shadow">
                            <div className="font-bold">Success</div>
                            <div className="text-xl text-green-600">{stats.successCount}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded shadow">
                            <div className="font-bold">Failures</div>
                            <div className="text-xl text-red-600">{stats.failureCount}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded shadow">
                            <div className="font-bold">Unique Users</div>
                            <div className="text-xl">{stats.uniqueUsers}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded shadow">
                            <div className="font-bold">Unique Actions</div>
                            <div className="text-xl">{stats.uniqueActions}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Filter by user..."
                    value={userFilter}
                    onChange={e => setUserFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                />
                <input
                    type="text"
                    placeholder="Filter by action..."
                    value={actionFilter}
                    onChange={e => setActionFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                </select>
                <input
                    type="text"
                    placeholder="Filter by collection..."
                    value={collectionFilter}
                    onChange={e => setCollectionFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                />
                <div className="relative">
                    <CalendarTodayIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded p-2 pl-9 w-full"
                        placeholder="Start Date"
                    />
                </div>
                <div className="relative">
                    <CalendarTodayIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded p-2 pl-9 w-full"
                        placeholder="End Date"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">Action</th>
                            <th className="py-2 px-4 border">Collection</th>
                            <th className="py-2 px-4 border">Document ID</th>
                            <th className="py-2 px-4 border">User</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Timestamp</th>
                            <th className="py-2 px-4 border">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">{log.action}</td>
                                <td className="py-2 px-4 border">{log.collectionName}</td>
                                <td className="py-2 px-4 border">{log.documentId}</td>
                                <td className="py-2 px-4 border">{log.user}</td>
                                <td className={`py-2 px-4 border ${log.status === 'success' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {log.status}
                                </td>
                                <td className="py-2 px-4 border">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogList;
