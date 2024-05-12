import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../api/api';

function ConnectedAddress({ username }) {
  const [walletInfo, setWalletInfo] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateWallet = async () => {
    try {
      const walletData = await api.searchUser(username);
      setWalletInfo(walletData);
      setError('');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h2 className="text-primary mb-4">Wallet Address</h2>
      <button className="btn btn-primary me-2" onClick={handleGenerateWallet}>Get My Address</button>
      {error && <p>Error: {error}</p>}
      {walletInfo && (
        <div>
          <p>Address: {walletInfo.address}</p>
        </div>
      )}
    </div>
  );
}

export default ConnectedAddress;
