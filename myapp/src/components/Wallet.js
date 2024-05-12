import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Import the api.js file
import 'bootstrap/dist/css/bootstrap.min.css';

function Wallet({ username }) {
  const [walletInfo, setWalletInfo] = useState(null);
  const [error, setError] = useState('');

  const fetchWalletInfo = async () => {
    try {
      const walletData = await api.searchUser(username);
      setWalletInfo(walletData);
      setError('');
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchWalletInfo();
  }, [username]);

  const handleGenerateWallet = async () => {
    fetchWalletInfo();
  };

  return (
    <div>
      <h2 className="text-primary mb-4">Wallet</h2>
      <button className="btn btn-primary me-2" onClick={handleGenerateWallet}>Generate Wallet</button>
      {error && <p className="text-danger">{error}</p>}
      {walletInfo && (
        <div>
          <p>Address: {walletInfo.address}</p>
          <p>Balance: {walletInfo.balance}</p>
          {walletInfo.privateKey && <p>Private Key: {walletInfo.privateKey}</p>}
        </div>
      )}
    </div>
  );
}

export default Wallet;
