import axios from 'axios';

const baseURL = 'http://localhost:3002'; // Base URL for your API

const makeRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${baseURL}${endpoint}`;
  console.log('Request URL:', url); // Log the constructed URL
  try {
    const config = {
      method,
      url,
      withCredentials: true,
      data
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
};


// API functions for generic blockchain functionalities
const api = {
  // Wallet Module
  accountBalance: async (address) => makeRequest(`/wallet/balances/${address}`),
  accountTransactions: async (address) => makeRequest(`/wallet/address/${address}/transactions`),


  // Faucet Module
  requestFaucetFunds:async (recipientAddress) => {
    try {
      if (!recipientAddress) {
        throw new Error('Please provide a recipient address');
      }
  
      const response = await makeRequest('/faucet/sendfunds', 'POST', { recipientAddress });
      return response;
    } catch (error) {
      throw error.response ? error.response.data.error : error.message;
    }
  },
  // Generate Address Module
  generateNewAddress: async () => makeRequest(`/wallet/generate`),

  // Peer Module
  connectPeers: async () => makeRequest(`/peers/connect`),
  notifyPeers: async () => makeRequest(`/peers/notify-new-block`),


  // Miner Module
  getMiningJob: async (minerAddress, difficulty) => {
    try {
      // Construct the request URL based on the provided address
      const url = `/mining/get-mining-job/${minerAddress}`;
  
      // Make the request with any additional parameters if needed
      const response = await makeRequest(url, 'GET', { difficulty });
  
      // Return the mining job data from the response
      return response.miningJob;
    } catch (error) {
      // Handle errors appropriately
      throw error.response ? error.response.data.error : error.message;
    }
  },
  
  submitMinedBlock: async (minerAddress, difficulty, /* any other necessary data */) => {
    try {
      // Construct the request data
      const requestData = {
        minerAddress,
        difficulty,
        // Add any other required data for submitting mined block
      };
  
      // Make the request
      const response = await makeRequest('/mining/submit-mined-block', 'POST', requestData);
  
      // Return the response or handle it as needed
      return response;
    } catch (error) {
      // Handle errors appropriately
      throw error.response ? error.response.data.error : error.message;
    }
  },
  // Block Module
  getAllBlocks: async () => makeRequest(`/blocks`),
  getBlockDetails: async (index) => makeRequest(`/blocks/${index}`),
  // Blockchain Module
  getGeneralBlockchainInfo: async () => makeRequest('/blockchain'),
  getDetailedBlockchainInfo: async () => makeRequest('/blockchain/info'),
  getDebugInfo: async () => makeRequest(`/blockchain/debug`),
  resetBlockchain: async () => makeRequest(`/blockchain/debug/reset-chain`, 'GET'),
  mineNewBlock: async (minerAddress, difficulty) => makeRequest(`/blockchain/debug/mine/${minerAddress}/${difficulty}`, 'GET'),
  gettransactions: async () => makeRequest(`/blockchain/transactions`, 'GET'),
  getPendingTransactions: async () => makeRequest(`/blockchain/transactions/pending`),
  getConfirmedTransactions: async () => makeRequest(`/blockchain/transactions/confirmed`),
  getTransactionDetails: async (tranHash) => makeRequest(`/blockchain/transactions/${tranHash}`),
  // Blockchain Module
createNewBlock: async (minerAddress, difficulty) => {
  try {
    const data = {
      minerAddress,
      difficulty,
    };
    const response = await makeRequest(`/blocks`, 'POST', data);
    return response;
  } catch (error) {
    throw error;
  }
},
createTransactions: async (sender, recipient, amount) => {
  try {
    const data = {
      sender,
      recipient,
      amount,
      
    };
    const response = await makeRequest(`/blockchain/transactions`, 'POST', data);
    return response;
  } catch (error) {
    throw error;
  }
},
 // Endpoint to initiate mining process
 mineBlock: async (minerAddress, difficulty) => {
  try {
    const requestData = { minerAddress, difficulty };
    const response = await makeRequest('/mine', 'POST', requestData);
    return response;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
},
listAllProducts: async () => makeRequest(`/marketplace/listAllProducts`, 'GET'),
addFunds: async (amount) => makeRequest(`/marketplace/addFunds`, 'POST', { amount }),
withdrawFunds: async (amount) => makeRequest(`/marketplace/withdrawFunds`, 'POST', { amount }),
addProduct: async (name, price) => {
    try {
      const data = { name, price };
      const response = await makeRequest('/marketplace/addProduct', 'POST', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (productId, name, price) => {
    try {
      const data = { productId, name, price };
      const response = await makeRequest('/marketplace/updateProduct', 'PUT', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await makeRequest(`/marketplace/deleteProduct/${productId}`, 'DELETE');
      return response;
    } catch (error) {
      throw error;
    }
  },
  createShipment: async (buyer, seller, productId) => makeRequest(`/marketplace/createShipment`, 'POST', { buyer, seller, productId }),
  updateShipmentStatus: async (buyer, seller, productId) => makeRequest(`/marketplace/updateShipmentStatus`, 'POST', { buyer, seller, productId }),
  purchaseProduct: async (productId) => makeRequest(`/marketplace/purchaseProduct`, 'POST', { productId }),

  
};

// Functions for user authentication
export const handleSignup = async (username, password, setMessage) => {
  try {
    const response = await axios.post(`${baseURL}/signup`, { username, password }, { withCredentials: true });
    setMessage(response.data.message);
  } catch (error) {
    setMessage(error.response ? error.response.data.error : error.message);
  }
};

export const handleLogin = async (username, password, setLoggedIn, setMessage) => {
  try {
    const response = await axios.post(`${baseURL}/login`, { username, password }, { withCredentials: true });
    setMessage(response.data.message);
    setLoggedIn(true);
  } catch (error) {
    setMessage(error.response ? error.response.data.error : error.message);
  }
};

export const handleLogout = async (setLoggedIn, setMessage) => {
  try {
    const response = await axios.post(`${baseURL}/logout`, null, { withCredentials: true });
    setMessage(response.data.message);
    setLoggedIn(false);
  } catch (error) {
    setMessage(error.response ? error.response.data.error : error.message);
  }
};

export const toggleView = (setLoginView, setMessage) => {
  setLoginView((prevView) => !prevView);
  setMessage('');
};

export default api;
