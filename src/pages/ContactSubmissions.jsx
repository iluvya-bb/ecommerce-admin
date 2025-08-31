import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FaEye, FaTrashAlt } from 'react-icons/fa';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await API.getContacts();
        setSubmissions(response.data.data);
      } catch (err) {
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    if (!submission.isRead) {
      // Mark as read in the backend
      API.updateContact(submission.id, { isRead: true }).then(() => {
        // Update state to reflect the change
        setSubmissions(submissions.map(s => s.id === submission.id ? { ...s, isRead: true } : s));
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await API.deleteContact(id);
        setSubmissions(submissions.filter(s => s.id !== id));
      } catch (err) {
        setError('Failed to delete submission');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Submissions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id} className={`${!submission.isRead ? 'font-bold' : ''}`}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{submission.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{submission.email}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(submission.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${submission.isRead ? 'text-green-900' : 'text-yellow-900'}`}>
                    <span aria-hidden className={`absolute inset-0 ${submission.isRead ? 'bg-green-200' : 'bg-yellow-200'} opacity-50 rounded-full`}></span>
                    <span className="relative">{submission.isRead ? 'Read' : 'Unread'}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button onClick={() => handleView(submission)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FaEye /></button>
                  <button onClick={() => handleDelete(submission.id)} className="text-red-600 hover:text-red-900"><FaTrashAlt /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedSubmission.name}</h2>
            <p className="text-gray-600 mb-2">{selectedSubmission.email}</p>
            <p className="text-gray-500 text-sm mb-4">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p>{selectedSubmission.message}</p>
            </div>
            <button onClick={() => setSelectedSubmission(null)} className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
