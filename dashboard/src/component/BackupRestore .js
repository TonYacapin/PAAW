import React, { useState } from 'react';
import axiosInstance from './axiosInstance'; // Adjust the import path as needed

const BackupRestore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      const response = await axiosInstance.post('/api/backup-restore/backup', {}, {
        responseType: 'blob', // Important to set the response type for downloading files
      });

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
        : 'backup.json';

      // Convert response to blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage('Backup created successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (event) => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('backup', file);

      const response = await axiosInstance.post('/backup-restore/restore', formData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Restore failed');
      }

      setMessage('Database restored successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <button
          onClick={handleBackup}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <span className="material-icons">download</span>
          Backup Database
        </button>

        <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer disabled:opacity-50">
          <span className="material-icons">upload</span>
          Restore Database
          <input
            type="file"
            accept=".json"
            onChange={handleRestore}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      </div>

      {isLoading && (
        <div className="p-4 border border-yellow-400 bg-yellow-100 text-yellow-800 rounded-md">
          <strong>Processing...</strong>
          <p>Please wait while we process your request.</p>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-400 bg-red-100 text-red-800 rounded-md">
          <strong>Error</strong>
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="p-4 border border-green-400 bg-green-100 text-green-800 rounded-md">
          <strong>Success</strong>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default BackupRestore;
