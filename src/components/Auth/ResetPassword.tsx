import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      // Assuming you have a correct endpoint for password reset
      await axios.post('https://my-home-xlox.onrender.com', { token, newPassword });
      setMessage('Password updated successfully.');
    } catch (error) {
      console.error('Failed to update password:', error);
      setMessage('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-[#575DFB] hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md"
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
        <p className="text-sm mt-4">{message}</p>
      </div>
    </div>
  );
};

export default ResetPassword;
