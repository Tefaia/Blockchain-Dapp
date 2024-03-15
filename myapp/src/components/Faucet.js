import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../api/api';

function Faucet() {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setReceiver(accounts[0]); // Fill recipient address with connected account address
          }
        }
      } catch (error) {
        console.error('Error fetching account:', error);
      }
    }

    fetchAccount();
  }, []);

  const handleReceiverChange = (event) => {
    setReceiver(event.target.value);
  };

  const handleRequestFunds = async () => {
    try {
      if (!receiver) {
        setError('Please enter receiver address');
        return;
      }

      const response = await api.requestFaucetFunds(receiver);
      setMessage(response.message);
      setError('');
    } catch (error) {
      setError('Error requesting funds. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Faucet Component</h2>
      {account && (
        <div className="mb-3">
          <label htmlFor="account" className="form-label">Connected Account:</label>
          <input
            type="text"
            id="account"
            className="form-control"
            value={account}
            readOnly
          />
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="receiver" className="form-label">Receiver Address:</label>
        <input
          type="text"
          id="receiver"
          className="form-control"
          value={receiver}
          onChange={handleReceiverChange}
          readOnly
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleRequestFunds}>Request Funds</button>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default Faucet;
