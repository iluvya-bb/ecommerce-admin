import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Assuming an API service exists

const Settings = () => {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [contactPhoneNumber, setContactPhoneNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [googleCoordinates, setGoogleCoordinates] = useState('');
  const [address, setAddress] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [qpay, setQpay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.getSettings();
        const { data } = response.data;
        if (data.logo) {
          setPreview(`http://localhost:8002/${data.logo}`);
        }
        if (data.contactPhoneNumber) {
          setContactPhoneNumber(data.contactPhoneNumber);
        }
        if (data.contactEmail) {
          setContactEmail(data.contactEmail);
        }
        if (data.googleCoordinates) {
          setGoogleCoordinates(data.googleCoordinates);
        }
        if (data.address) {
          setAddress(data.address);
        }
        if (data.bankAccount) {
          setBankAccount(data.bankAccount);
        }
        if (data.bankAccountName) {
          setBankAccountName(data.bankAccountName);
        }
        if (data.bankName) {
          setBankName(data.bankName);
        }
        if (data.qpay) {
          setQpay(data.qpay === 'true');
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
      if (logo) {
        formData.append('logo', logo);
      }
      formData.append('contactPhoneNumber', contactPhoneNumber);
      formData.append('contactEmail', contactEmail);
      formData.append('googleCoordinates', googleCoordinates);
      formData.append('address', address);
      formData.append('bankAccount', bankAccount);
      formData.append('bankAccountName', bankAccountName);
      formData.append('bankName', bankName);
      formData.append('qpay', qpay);
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
        <div className="mb-4">
          <label htmlFor="contactPhoneNumber" className="block text-lg font-medium mb-2">Contact Phone Number</label>
          <input type="text" id="contactPhoneNumber" value={contactPhoneNumber} onChange={(e) => setContactPhoneNumber(e.target.value)} className="w-full p-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="contactEmail" className="block text-lg font-medium mb-2">Contact Email</label>
          <input type="email" id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full p-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="googleCoordinates" className="block text-lg font-medium mb-2">Google Maps Coordinates</label>
          <input type="text" id="googleCoordinates" value={googleCoordinates} onChange={(e) => setGoogleCoordinates(e.target.value)} className="w-full p-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-medium mb-2">Address</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="bankAccount" className="block text-lg font-medium mb-2">Bank Account</label>
          <input type="text" id="bankAccount" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full p-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="bankAccountName" className="block text-lg font-medium mb-2">Bank Account Name</label>
          <input type="text" id="bankAccountName" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} className="w-full p-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="bankName" className="block text-lg font-medium mb-2">Bank Name</label>
          <input type="text" id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full p-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="qpay" className="block text-lg font-medium mb-2">Enable QPay</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="qpay" checked={qpay} onChange={(e) => setQpay(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
