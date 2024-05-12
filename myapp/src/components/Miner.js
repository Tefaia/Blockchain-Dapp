import React, { useState, useEffect } from 'react';
import api from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Miner() {
  const [minerAddress, setMinerAddress] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getAccounts = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setMinerAddress(accounts[0]); // Set miner address to the first account
          }
        }
      } catch (error) {
        console.error('Error retrieving accounts from MetaMask:', error);
        setErrorMessage('Error retrieving accounts from MetaMask. Please try again later.');
      }
    };

    getAccounts();
  }, []);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const mineBlockDebug = async () => {
    try {
      // Check if MetaMask is connected
      if (!window.ethereum || !window.ethereum.selectedAddress) {
        setErrorMessage('Please connect to MetaMask first');
        return;
      }

      const requestData = { minerAddress, difficulty }; // Use minerAddress state directly
      console.log('Data being passed to mineBlock:', requestData); // Log data being passed
      const response = await api.mineNewBlock(requestData.minerAddress, requestData.difficulty);
      console.log('Mine Block Response:', response); // For debugging purposes
      setSuccessMessage('Block mined successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error mining block:', error);
      setSuccessMessage('');
      setErrorMessage('Error mining block. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Miner Component</h2>
      <div className="mb-3">
        <label className="form-label">Miner Address:</label>
        <input type="text" className="form-control" value={minerAddress} readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label">Difficulty:</label>
        <input type="text" className="form-control" value={difficulty} onChange={handleDifficultyChange} />
      </div>

      <button
        type="button"
        className="btn btn-success"
        onClick={mineBlockDebug}
      >
        Mine Block in Debug Mode
      </button>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
    </div>
  );
}

export default Miner;
