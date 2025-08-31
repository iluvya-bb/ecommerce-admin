import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Assuming an API service exists

const Settings = () => {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(null);
  const [heroBackgroundImagePreview, setHeroBackgroundImagePreview] = useState(null);
  
  const [settings, setSettings] = useState({
    contactPhoneNumber: '',
    contactEmail: '',
    googleCoordinates: '',
    address: '',
    bankAccount: '',
    bankAccountName: '',
    bankName: '',
    qpay: false,
    heroHeadline: '',
    heroSubheadline: '',
    heroCta: '',
    heroLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.getSettings();
        const { data } = response.data;
        
        setSettings(prev => ({
          ...prev,
          ...data,
          qpay: data.qpay === 'true',
        }));

        if (data.logo) {
          setPreview(`${import.meta.env.VITE_API_URL}/${data.logo}`);
        }
        if (data.heroImage) {
          setHeroImagePreview(`${import.meta.env.VITE_API_URL}/${data.heroImage}`);
        }
        if (data.heroBackgroundImage) {
          setHeroBackgroundImagePreview(`${import.meta.env.VITE_API_URL}/${data.heroBackgroundImage}`);
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

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImage(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleHeroBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroBackgroundImage(file);
      setHeroBackgroundImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
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
      if (heroImage) {
        formData.append('heroImage', heroImage);
      }
      if (heroBackgroundImage) {
        formData.append('heroBackgroundImage', heroBackgroundImage);
      }
      
      for (const key in settings) {
        formData.append(key, settings[key]);
      }

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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {error && <p className="text-red-500 mb-4 md:col-span-2">{error}</p>}
        
        {/* General Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">General</h2>
          <div className="mb-4">
            <label htmlFor="logo" className="block text-lg font-medium mb-2">Logo</label>
            <input type="file" id="logo" onChange={handleFileChange} className="p-2 border rounded-lg"/>
          </div>
          {preview && <img src={preview} alt="Logo Preview" className="w-48 h-auto object-contain mb-4 rounded-lg shadow-md" />}
          <div className="mb-4">
            <label htmlFor="contactPhoneNumber" className="block text-lg font-medium mb-2">Contact Phone Number</label>
            <input type="text" id="contactPhoneNumber" value={settings.contactPhoneNumber} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="contactEmail" className="block text-lg font-medium mb-2">Contact Email</label>
            <input type="email" id="contactEmail" value={settings.contactEmail} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="googleCoordinates" className="block text-lg font-medium mb-2">Google Maps Coordinates</label>
            <input type="text" id="googleCoordinates" value={settings.googleCoordinates} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-lg font-medium mb-2">Address</label>
            <input type="text" id="address" value={settings.address} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="bankAccount" className="block text-lg font-medium mb-2">Bank Account</label>
            <input type="text" id="bankAccount" value={settings.bankAccount} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="bankAccountName" className="block text-lg font-medium mb-2">Bank Account Name</label>
            <input type="text" id="bankAccountName" value={settings.bankAccountName} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="bankName" className="block text-lg font-medium mb-2">Bank Name</label>
            <input type="text" id="bankName" value={settings.bankName} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="qpay" className="block text-lg font-medium mb-2">Enable QPay</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="qpay" checked={settings.qpay} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Hero Banner Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Hero Banner</h2>
          <div className="mb-4">
            <label htmlFor="heroImage" className="block text-lg font-medium mb-2">Hero Image</label>
            <input type="file" id="heroImage" onChange={handleHeroImageChange} className="p-2 border rounded-lg"/>
          </div>
          {heroImagePreview && <img src={heroImagePreview} alt="Hero Image Preview" className="w-full h-auto object-contain mb-4 rounded-lg shadow-md" />}
          <div className="mb-4">
            <label htmlFor="heroBackgroundImage" className="block text-lg font-medium mb-2">Hero Background Image</label>
            <input type="file" id="heroBackgroundImage" onChange={handleHeroBackgroundImageChange} className="p-2 border rounded-lg"/>
          </div>
          {heroBackgroundImagePreview && <img src={heroBackgroundImagePreview} alt="Hero Background Image Preview" className="w-full h-auto object-contain mb-4 rounded-lg shadow-md" />}
          <div className="mb-4">
            <label htmlFor="heroHeadline" className="block text-lg font-medium mb-2">Headline</label>
            <input type="text" id="heroHeadline" value={settings.heroHeadline} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="heroSubheadline" className="block text-lg font-medium mb-2">Subheadline</label>
            <input type="text" id="heroSubheadline" value={settings.heroSubheadline} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="heroCta" className="block text-lg font-medium mb-2">Button Text (CTA)</label>
            <input type="text" id="heroCta" value={settings.heroCta} onChange={handleInputChange} className="w-full p-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label htmlFor="heroLink" className="block text-lg font-medium mb-2">Button Link</label>
            <input type="text" id="heroLink" value={settings.heroLink} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="/products"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            {loading ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
