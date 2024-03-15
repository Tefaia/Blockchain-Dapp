import React, { useState } from 'react';
import api from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Miner() {
  const [minerAddress, setMinerAddress] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddressChange = (event) => {
    setMinerAddress(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setMinerAddress(window.ethereum.selectedAddress); // Set miner address to connected account address
        setSuccessMessage('Connected to MetaMask');
      } else {
        setErrorMessage('MetaMask is not installed. Please install MetaMask to use this feature.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setErrorMessage('Error connecting to MetaMask. Please try again later.');
    }
  };

  const mineBlock = async () => {
    try {
      // Check if MetaMask is connected
      if (!window.ethereum || !window.ethereum.selectedAddress) {
        setErrorMessage('Please connect to MetaMask first');
        return;
      }

      const response = await api.mineBlock(window.ethereum.selectedAddress, difficulty);
      console.log(response); // For debugging purposes
      setSuccessMessage('Block mined successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error mining block:', error);
      setSuccessMessage('');
      setErrorMessage('Error mining block. Please try again later.');
    }
  };

  const getMiningJob = async () => {
    try {
      const response = await api.getMiningJob(minerAddress, difficulty);
      console.log(response); // For debugging purposes
      setSuccessMessage('Mining job retrieved successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error getting mining job:', error);
      setSuccessMessage('');
      setErrorMessage('Error getting mining job. Please try again later.');
    }
  };

  const submitMinedBlock = async () => {
    try {
      const response = await api.submitMinedBlock();
      console.log(response); // For debugging purposes
      setSuccessMessage('Mined block submitted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting mined block:', error);
      setSuccessMessage('');
      setErrorMessage('Error submitting mined block. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Miner Component</h2>
      <button className="btn btn-primary me-3" onClick={connectMetaMask}>
        Connect to MetaMask
      </button>
      <div className="mb-3">
        <label className="form-label">Miner Address:</label>
        <input type="text" className="form-control" value={minerAddress} onChange={handleAddressChange} readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label">Difficulty:</label>
        <input type="text" className="form-control" value={difficulty} onChange={handleDifficultyChange} />
      </div>
      <button className="btn btn-primary me-3" onClick={mineBlock}>
        Mine Block
      </button>
      <button className="btn btn-primary me-3" onClick={getMiningJob}>
        Get Mining Job
      </button>
      <button className="btn btn-success" onClick={submitMinedBlock}>
        Submit Mined Block
      </button>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
    </div>
  );
}

export default Miner;
