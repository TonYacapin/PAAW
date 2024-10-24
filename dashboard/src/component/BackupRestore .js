import React, { useState } from 'react';
import axiosInstance from './axiosInstance';

const BackupRestore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      const response = await axiosInstance.post('/api/backup-restore/backup', {}, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition
          ? contentDisposition.split('filename=')[1]?.split(';')[0].replace(/['"]/g, '')
          : 'backup.json.gz';

        const blob = new Blob([response.data], { type: 'application/gzip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setMessage('Backup created successfully');
      } else {
        throw new Error('Failed to create backup');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleRestore = async (event) => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      setProgress(0);

      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('backup', file);

      await axiosInstance.post('/api/backup-restore/restore', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      setMessage('Database restored successfully');
    } catch (err) {
      setError(err.message || 'Failed to restore backup');
    } finally {
      setIsLoading(false);
      setProgress(0);
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
            onChange={handleRestore}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      </div>

      {isLoading && <p>Processing... {progress}%</p>}
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default BackupRestore;
