import React, { useState, useRef } from 'react';
import axiosInstance from './axiosInstance';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';


const BackupRestore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

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

      const fileName = response.headers['content-disposition']
        ? response.headers['content-disposition'].split('filename=')[1]?.split(';')[0].replace(/['"]/g, '')
        : `backup-${new Date().toISOString()}.json.gz`;

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
    } catch (err) {
      console.error('Backup error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create backup');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleRestore = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        setError('Please select a file');
        return;
      }

      console.log('Selected file:', file);

      if (!file.name.endsWith('.gz')) {
        setError('Please select a valid backup file (.gz format)');
        return;
      }

      setIsLoading(true);
      setError(null);
      setMessage(null);
      setProgress(0);

      // Create FormData and append file
      const formData = new FormData();
      formData.append('backup', file);

      const token = localStorage.getItem('token');

      // Create a custom axios instance for the restore request
      const customAxiosInstance = axios.create({
        baseURL: axiosInstance.defaults.baseURL,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const response = await customAxiosInstance.post('/api/backup-restore/restore', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      setMessage(response.data.message || 'Database restored successfully');
    } catch (err) {
      console.error('Restore error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to restore backup');
    } finally {
      setIsLoading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-black mb-6 text-center w-full">
        Backup and Restore
      </h2>

      <div className="flex flex-col sm:flex-row gap-8 text-center w-full justify-center">
        <button
          onClick={handleBackup}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-4 bg-darkgreen text-white rounded-md hover:bg-darkergreen transition duration-200 ease-in-out disabled:opacity-50 w-full p-5"
        >
          <DownloadIcon />
          {isLoading ? 'Creating Backup...' : 'Backup Database'}
        </button>

        <label className={`flex items-center justify-center gap-2 px-4 py-4 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition duration-200 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} w-full p-5`}>
          <UploadIcon />
          {isLoading ? 'Restoring...' : 'Restore Database'}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleRestore}
            disabled={isLoading}
            accept=".gz"
            className="hidden"
          />
        </label>
      </div>

      {isLoading && (
        <div className="text-center">
          <p className="text-gray-600">Processing... {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default BackupRestore;