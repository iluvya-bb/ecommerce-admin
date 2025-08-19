import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Assuming an API service exists

const Settings = () => {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.getSettings();
        if (response.data.data.logo) {
          setPreview(`http://localhost:8002/${response.data.data.logo}`);
        }
      } catch (err) {
        setError("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('logo', logo);
      await API.updateSettings(formData);
      alert("Settings updated successfully!");
    } catch (err) {
      setError("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="logo" className="block text-lg font-medium mb-2">Logo</label>
          <input type="file" id="logo" onChange={handleFileChange} className="p-2 border rounded-lg"/>
        </div>
        {preview && <img src={preview} alt="Logo Preview" className="w-48 h-auto object-contain mb-4 rounded-lg shadow-md" />}
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
