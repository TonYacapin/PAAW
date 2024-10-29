import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

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
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-black mb-6 text-center w-full">Backup and Restore</h2>
      <div className="flex flex-col sm:flex-row gap-8 text-center w-full justify-center">
        <button
          onClick={handleBackup}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-4 bg-darkgreen text-white rounded-md hover:bg-darkergreen transition duration-200 ease-in-out disabled:opacity-50 w-full p-5"
        >
          <DownloadIcon />
          Backup Database
        </button>

        <label className="flex items-center justify-center gap-2 px-4 py-4 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition duration-200 ease-in-out disabled:opacity-50 w-full p-5">
          <UploadIcon />
          Restore Database
          <input
            type="file"
            onChange={handleRestore}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      </div>

      {isLoading && <p className="text-gray-600">Processing... {progress}%</p>}
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default BackupRestore;
