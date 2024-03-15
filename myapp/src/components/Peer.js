import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import api from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Peer() {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [blockCount, setBlockCount] = useState(null);

  useEffect(() => {
    // Call notifyNewBlock automatically when the component mounts
    notifyNewBlock();
    // Fetch the block count
    fetchBlockCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const checkMetaMaskConnection = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setConnectionStatus(`Connected to MetaMask. Account: ${accounts[0]}`);
        setConnectedAccount(accounts[0]);
        return accounts[0];
      } catch (error) {
        setConnectionStatus('MetaMask connection denied.');
        console.error('MetaMask connection error:', error);
      }
    } else {
      setConnectionStatus('No MetaMask detected.');
      console.error('No MetaMask detected.');
    }
    return null;
  };

  const notifyNewBlock = async () => {
    try {
      const account = await checkMetaMaskConnection();
      if (account) {
        // Call the backend API route to notify peers about a new block
        await api.notifyNewBlock(account);
        console.log('New block notified to peers successfully');
        setNotificationMessage('New block notified to peers successfully');
      } else {
        setNotificationMessage('Error notifying peers: MetaMask not connected.');
      }
    } catch (error) {
      console.error('Error notifying peers about a new block:', error);
      setNotificationMessage('Error notifying peers about a new block');
    }
  };

  const fetchBlockCount = async () => {
    try {
      const response = await api.getBlockCount();
      setBlockCount(response.count);
    } catch (error) {
      console.error('Error fetching block count:', error);
    }
  };

  return (
    <div>
      <p>{connectionStatus}</p>
      <p>{notificationMessage}</p>
      <p>{`Connected Account: ${connectedAccount || 'Not connected'}`}</p>
      <p>{`Block Count: ${blockCount !== null ? blockCount : 'Loading...'}`}</p>
    </div>
  );
}

export default Peer;
