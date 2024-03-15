import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../api/api';
import Web3 from 'web3';

function Wallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const enableMetaMask = async () => {
      if (window.ethereum) {
        // Request user accounts using the new method
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('MetaMask enabled and accounts access granted.');
        } catch (error) {
          console.error('Error enabling MetaMask accounts access:', error);
          setError('Error enabling MetaMask accounts access. Please make sure MetaMask is installed and unlocked.');
        }
      } else {
        setError('MetaMask not detected. Please install MetaMask to continue.');
      }
    };

    enableMetaMask();

  }, []);

  const createAccount = async () => {
    try {
      const response = await api.generateNewAddress();
      setAccount(response);
      // Import address and private key into MetaMask
      await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [
          {
            eth_accounts: [
              {
                address: response.address,
                privateKey: response.privateKey
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Error creating account. Please try again later.');
    }
  };

  const getBalance = async () => {
    try {
      if (window.ethereum && account) {
        const web3 = new Web3(window.ethereum);
        const balance = await web3.eth.getBalance(account.address);
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        setBalance(formattedBalance);
      } else {
        setError('MetaMask not detected or no account selected.');
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      setError('Error getting balance. Please try again later.');
    }
  };

  const getTransactions = async () => {
    try {
      if (window.ethereum && account) {
        // Fetch transactions for the current account from your API
        const response = await api.accountTransactions(account);
        setTransactions(response.transactions);
      } else {
        setError('MetaMask not detected or no account selected.');
      }
    } catch (error) {
      console.error('Error getting transactions:', error);
      setError('Error getting transactions. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Wallet Component</h2>
      <button className="btn btn-primary me-3" onClick={createAccount}>Create Account</button>
      <button className="btn btn-primary me-3" onClick={getBalance}>Get Balance</button>
      <button className="btn btn-primary" onClick={getTransactions}>Get Transactions</button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {account && (
        <div className="mt-3">
          <h3>Account Details</h3>
          <p><strong>Address:</strong> {account.address}</p>
          <p><strong>Private Key:</strong> {account.privateKey}</p>
        </div>
      )}

      {balance && <p className="mt-3"><strong>Balance:</strong> {balance}</p>}

      {transactions && (
        <div className="mt-3">
          <h3>Transactions</h3>
          <ul className="list-group">
            {transactions.map((transaction, index) => (
              <li key={index} className="list-group-item">{transaction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Wallet;
