import React, { useEffect, useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axiosInstance from '../../component/axiosInstance';
import CardBox from '../../component/CardBox';
import SuccessModal from '../../component/SuccessModal';

const AuditLogList = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    outcome: '',
    resource: '',
    startDate: '',
    endDate: ''
  });

  // UI states
  const [showStats, setShowStats] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const logsPerPage = 30;

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await axiosInstance.get('/api/audit-logs');
        setAuditLogs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      user: '',
      action: '',
      outcome: '',
      resource: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
  };

  // Filtering logic
  const filteredLogs = auditLogs.filter(log => {
    const matchesUser = log.user.toLowerCase().includes(filters.user.toLowerCase());
    const matchesAction = !filters.action || log.action.toLowerCase().includes(filters.action.toLowerCase());
    const matchesOutcome = !filters.outcome || log.outcome === filters.outcome;
    const matchesResource = !filters.resource || log.resource.toLowerCase().includes(filters.resource.toLowerCase());

    const logDate = new Date(log.timestamp);
    const afterStartDate = !filters.startDate || logDate >= new Date(filters.startDate);
    const beforeEndDate = !filters.endDate || logDate <= new Date(filters.endDate);

    return matchesUser && matchesAction && matchesOutcome && matchesResource && afterStartDate && beforeEndDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  // Calculate statistics
  const stats = {
    total: filteredLogs.length,
    successCount: filteredLogs.filter(log => log.outcome === 'successful').length,
    failureCount: filteredLogs.filter(log => log.outcome === 'failed').length,
    uniqueUsers: new Set(filteredLogs.map(log => log.user)).size,
    uniqueActions: new Set(filteredLogs.map(log => log.action)).size
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm text-white bg-darkgreen hover:bg-darkergreen rounded-lg"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 text-sm text-white bg-darkgreen hover:bg-darkergreen rounded-lg"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-sm text-gray-600">Total Logs</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-sm text-green-600">Successful</div>
            <div className="text-2xl font-semibold text-green-700">{stats.successCount}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-sm text-red-600">Failed</div>
            <div className="text-2xl font-semibold text-red-700">{stats.failureCount}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-sm text-blue-600">Unique Users</div>
            <div className="text-2xl font-semibold text-blue-700">{stats.uniqueUsers}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-sm text-purple-600">Unique Actions</div>
            <div className="text-2xl font-semibold text-purple-700">{stats.uniqueActions}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <CardBox>
        {/* <div className="mb-6 bg-gray-50 p-4 rounded-lg"> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Filter by user..."
              value={filters.user}
              onChange={e => handleFilterChange('user', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Filter by action..."
              value={filters.action}
              onChange={e => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <select
              value={filters.outcome}
              onChange={e => handleFilterChange('outcome', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Outcomes</option>
              <option value="successful">Successful</option>
              <option value="failed">Failure</option>
              <option value="in progress">In Progress</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Filter by resource..."
              value={filters.resource}
              onChange={e => handleFilterChange('resource', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="relative">
              <CalendarTodayIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={filters.startDate}
                onChange={e => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 pl-9 border rounded-lg"
              />
            </div>
            <div className="relative">
              <CalendarTodayIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={filters.endDate}
                onChange={e => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 pl-9 border rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-darkgreen hover:bg-darkergreen text-white rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        {/* </div> */}
        </CardBox>
      )}

      {/* Results summary */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>
          Showing {(currentPage - 1) * logsPerPage + 1} - {Math.min(currentPage * logsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-darkgreen text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Outcome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLogs.map(log => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{log.resource}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{log.resourceId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{log.user}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    log.outcome === 'successful' 
                      ? 'bg-green-100 text-green-800' 
                      : log.outcome === 'failure'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.outcome}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        
      )}


    </div>
 
  );
};

export default AuditLogList;