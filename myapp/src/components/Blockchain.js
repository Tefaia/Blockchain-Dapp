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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { sender, recipient, amount } = formData;
      const response = await api.createTransactions(sender, recipient, amount, web3);
      setMessage(response.message);
      setFormData({ sender: '', recipient: '', amount: '' });
    } catch (error) {
      console.error('Error creating transaction:', error);
      setMessage('An error occurred while creating the transaction.');
    }
  };

  const [miningFormData, setMiningFormData] = useState({
    address: '',
    difficulty: '',
  });
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionData, setTransactionData] = useState({
    sender: '',
    recipient: '',
    amount: ''
  });
  const [formData, setFormData] = useState({
    sender: '',
    recipient: '',
    amount: ''
  });
  const [blockFormData, setBlockFormData] = useState({
    sender: '',
    recipient: '',
    amount: '',
    minerAddress: '',
    difficulty: '',
  });
  

  const [message, setMessage] = useState('');

  const handleMiningFormChange = (event) => {
    const { name, value } = event.target;
    setMiningFormData({ ...miningFormData, [name]: value });
  };

  const handleTransactionHashChange = (event) => {
    setTransactionHash(event.target.value);
  };

  const handleBlockFormChange = (event) => {
    const { name, value } = event.target;
    setBlockFormData({ ...blockFormData, [name]: value });
  };
  
  const handleBlockFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { sender, recipient, amount, minerAddress, difficulty } = blockFormData;
  
      // Basic input validation
      if (!sender || !recipient || !amount || !minerAddress || !difficulty) {
        throw new Error('Please fill out all fields');
      }
  
      const response = await api.createBlock(sender, recipient, amount, minerAddress, difficulty, web3);
      setMessage(response.message);
  
      // Reset form data after successful block creation
      setBlockFormData({
        sender: '',
        recipient: '',
        amount: '',
        minerAddress: '',
        difficulty: '',
      });
    } catch (error) {
      console.error('Error creating block:', error);
      setMessage('An error occurred while creating the block.');
    }
  };
  
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

  const mineBlockDebug = async () => {
    try {
      const { address, difficulty } = miningFormData;
      await api.mineNewBlock(address, difficulty);
      setError(null);
    } catch (error) {
      setError('Error mining block in debug mode. Please try again later.');
    }
  };

  const fetchPendingTransactions = async () => {
    try {
      if (!web3) {
        setError('MetaMask not connected');
        return;
      }

      // Use web3 instance to fetch pending transactions
      const pendingTransactions = await api.getPendingTransactions(web3);
      console.log(pendingTransactions); // Handle pending transactions as needed
      setError(null);
    } catch (error) {
      setError('Error fetching pending transactions. Please try again later.');
    }
  };

  const fetchConfirmedTransactions = async () => {
    try {
      if (!web3) {
        setError('MetaMask not connected');
        return;
      }

      // Use web3 instance to fetch confirmed transactions
      const confirmedTransactions = await api.getConfirmedTransactions(web3);
      console.log(confirmedTransactions); // Handle confirmed transactions as needed
      setError(null);
    } catch (error) {
      setError('Error fetching confirmed transactions. Please try again later.');
    }
  };

  const fetchTransactionByHash = async () => {
    try {
      if (!web3) {
        setError('MetaMask not connected');
        return;
      }

      const transaction = await api.getTransactionDetails(transactionHash, web3);
      console.log(transaction); // Handle the transaction by its hash as needed
      setError(null);
    } catch (error) {
      setError('Error fetching transaction by hash. Please try again later.');
    }
  };

  const createNewBlock = async () => {
    try {
        // Extract transaction data from state
        const { sender, recipient, amount, minerAddress, difficulty } = transactionData;

        // Check if all transaction fields are filled
        if (!sender || !recipient || !amount || !minerAddress || !difficulty) {
            setError('Please fill out all transaction fields');
            return;
        }

        // Send transaction data to the backend for block creation
        await api.createNewBlock(sender, recipient, amount, minerAddress, difficulty);

        // Reset transaction data and clear error upon successful block creation
        setTransactionData({ sender: '', recipient: '', amount: '', minerAddress: '', difficulty: '' });
        setError(null);

        // Provide feedback to the user
        alert('Transaction processed successfully!');
    } catch (error) {
        // Handle errors encountered during block creation
        setError('Error creating transaction. Please try again later.');
    }
};

const handleTransactionDataChange = (event) => {
    const { name, value } = event.target;
    setTransactionData(prevTransactionData => ({
        ...prevTransactionData,
        [name]: value
    }));
};


  return (
    <div className="container">
  
      <h2>Blockchain Information</h2>
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
          <h3>General Info</h3>
          <pre>{JSON.stringify(generalInfo, null, 2)}</pre>
        </div>
        <div className="col">
          <h3>Detailed Info</h3>
          <pre>{JSON.stringify(detailedInfo, null, 2)}</pre>
        </div>
        <div className="col">
          <h3>Debug Info</h3>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      </div>
      <hr />
      <h3>Mine Block in Debug Mode</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Miner Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={miningFormData.address}
            onChange={handleMiningFormChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="difficulty" className="form-label">
            Difficulty
          </label>
          <input
            type="text"
            className="form-control"
            id="difficulty"
            name="difficulty"
            value={miningFormData.difficulty}
            onChange={handleMiningFormChange}
          />
        </div>
        <button
          type="button"
          className="btn btn-success"
          onClick={mineBlockDebug}
        >
          Mine Block in Debug Mode
        </button>
      </form>
      <hr />
      <div>
        <h3>Transactions</h3>
        <button className="btn btn-primary me-2" onClick={fetchPendingTransactions}>
          Fetch Pending Transactions
        </button>
        <button className="btn btn-primary me-2" onClick={fetchConfirmedTransactions}>
          Fetch Confirmed Transactions
        </button>
       
        <div className="container">
  <h2>Create Transaction</h2>
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label htmlFor="sender" className="form-label">Sender:</label>
      <input type="text" className="form-control" id="sender" name="sender" value={formData.sender} onChange={handleInputChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="recipient" className="form-label">Recipient:</label>
      <input type="text" className="form-control" id="recipient" name="recipient" value={formData.recipient} onChange={handleInputChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="amount" className="form-label">Amount:</label>
      <input type="text" className="form-control" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} />
    </div>
    <button type="submit" className="btn btn-primary">Submit Transaction</button>
  </form>
  {message && <div className="alert alert-danger">{message}</div>}
</div>

        <div className="mb-3">
          <label htmlFor="transactionHash" className="form-label">
            Transaction Hash
          </label>
          <input
            type="text"
            className="form-control"
            id="transactionHash"
            value={transactionHash}
            onChange={handleTransactionHashChange}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={fetchTransactionByHash}>
          Fetch Transaction by Hash
        </button>
      </div>
      <hr />
      <div className="mb-3">
        <h3>Create New Block</h3>
        <form onSubmit={handleBlockFormSubmit}>
          <div className="mb-3">
            <label htmlFor="sender" className="form-label">
              Sender:
            </label>
            <input
              type="text"
              className="form-control"
              id="sender"
              name="sender"
              value={blockFormData.sender}
              onChange={handleBlockFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="recipient" className="form-label">
              Recipient:
            </label>
            <input
              type="text"
              className="form-control"
              id="recipient"
              name="recipient"
              value={blockFormData.recipient}
              onChange={handleBlockFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount:
            </label>
            <input
              type="text"
              className="form-control"
              id="amount"
              name="amount"
              value={blockFormData.amount}
              onChange={handleBlockFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="minerAddress" className="form-label">
              Miner Address:
            </label>
            <input
              type="text"
              className="form-control"
              id="minerAddress"
              name="minerAddress"
              value={blockFormData.minerAddress}
              onChange={handleBlockFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="difficulty" className="form-label">
              Difficulty:
            </label>
            <input
              type="text"
              className="form-control"
              id="difficulty"
              name="difficulty"
              value={blockFormData.difficulty}
              onChange={handleBlockFormChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create New Block
          </button>
        </form>
      </div>
</div>
  );
}

export default Blockchain;
