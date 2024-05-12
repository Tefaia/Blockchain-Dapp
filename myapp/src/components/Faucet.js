import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.min.css';

function Faucet() {
  const [message, setMessage] = useState('');
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          console.error('Error requesting account access:', error);
        }
      } else {
        console.error('MetaMask extension not detected');
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (web3) {
        const accs = await web3.eth.getAccounts();
        setAccounts(accs);
        if (accs.length > 0) {
          setAddress(accs[0]); // Set the address to the first account
        }
      }
    };

    fetchAccounts();
  }, [web3]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          const url = `http://localhost:3002/faucet/balance/${address}`;
          const response = await axios.get(url);
          setBalance(response.data.balance);
          setError('');
        } catch (error) {
          setBalance('');
          setError(`Error: ${error.response.data.error}`);
        }
      }
    };

    fetchBalance();
  }, [address]);

  const handleTokenRequest = async (e) => {
    e.preventDefault();
  
    try {
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect MetaMask.');
      }
  
      const address = accounts[0]; // Get the first account from MetaMask
      const baseUrl = 'http://localhost:3002/faucet'; // Base URL for the faucet API
      const url = `${baseUrl}/sendtokens/${address}`;
  
      const response = await axios.post(url);
      setMessage(response.data.message); // Update to access the message property of the response
    } catch (error) {
      setMessage(`Token request failed: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
            <p className="text-center">Address: {address}</p>
            {balance && <p className="mt-3">Balance: {balance}</p>}
            {error && <p className="mt-3 text-danger">{error}</p>}
              <h2 className="card-title text-center mb-4">Token Faucet</h2>
              <form onSubmit={handleTokenRequest}>
                <button type="submit" className="btn btn-primary btn-block mt-4">Request Tokens</button>
              </form>
              {message && <p className="mt-3 text-center">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faucet;
