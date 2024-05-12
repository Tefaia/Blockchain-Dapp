import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import api from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Blockchain() {
  const [generalInfo, setGeneralInfo] = useState({});
  const [detailedInfo, setDetailedInfo] = useState({});
  const [debugInfo, setDebugInfo] = useState({});
  const [error, setError] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
        } catch (error) {
          console.error('User denied account access:', error);
          // Handle denial of access
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
      } else {
        console.error('No Ethereum browser extension detected');
        // Handle the case where no provider is available
      }
    };

    initWeb3();
  }, []);


  const fetchGeneralInfo = async () => {
    try {
      const response = await api.getGeneralBlockchainInfo();
      setGeneralInfo(response);
      setError(null);
    } catch (error) {
      setError('Error fetching general information. Please try again later.');
    }
  };

  const fetchDetailedInfo = async () => {
    try {
      const response = await api.getDetailedBlockchainInfo();
      setDetailedInfo(response);
      setError(null);
    } catch (error) {
      setError('Error fetching detailed information. Please try again later.');
    }
  };

  const fetchDebugInfo = async () => {
    try {
      const response = await api.getDebugInfo();
      setDebugInfo(response);
      setError(null);
    } catch (error) {
      setError('Error fetching debug information. Please try again later.');
    }
  };

  const resetBlockchain = async () => {
    try {
      await api.resetBlockchain();
      setError(null);
      setDebugInfo({ isValid: false }); // Reset debug info
    } catch (error) {
      setError('Error resetting blockchain. Please try again later.');
    }
  };

  return (
    <div className="container">
      
      <h2 className="text-primary mb-4">Blockchain Information</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary me-2" onClick={fetchGeneralInfo}>
        Fetch General Info
      </button>
      <button className="btn btn-primary me-2" onClick={fetchDetailedInfo}>
        Fetch Detailed Info
      </button>
      <button className="btn btn-primary me-2" onClick={fetchDebugInfo}>
        Fetch Debug Info
      </button>
      <button className="btn btn-danger me-2" onClick={resetBlockchain}>
        Reset Blockchain
      </button>
      <hr />

      <div className="row">
        <div className="col">
          <h3 className="text-primary mb-4">General Info</h3>
          <pre>{JSON.stringify(generalInfo, null, 2)}</pre>
        </div>
        <div className="col">
          <h3 className="text-primary mb-4">Detailed Info</h3>
          <pre>{JSON.stringify(detailedInfo, null, 2)}</pre>
        </div>
        <div className="col">
          <h3 className="text-primary mb-4">Debug Info</h3>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      </div>
     

     
    </div>
  );
}

export default Blockchain;
