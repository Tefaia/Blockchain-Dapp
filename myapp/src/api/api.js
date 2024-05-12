import axios from 'axios';
const baseURL = 'http://localhost:3002'; // Base URL for app API
const peerURL = 'http://localhost:3001'; // URL for peer service

const makeRequest = async (endpoint, method = 'GET', data = null, baseURL) => {
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

const api = {
  // Wallet Module
  searchUser: async (username) => makeRequest(`/wallet/search/${username}`, 'GET', null, baseURL),
  
  // Faucet Module
requestFaucetFunds: async (recipientAddress) => {
  try {
    if (!recipientAddress) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
      throw new Error('Please provide a recipient address');
    }

    // Log recipient address
    console.log('Recipient Address:', recipientAddress);

    const response = await makeRequest(`/faucet/sendtokens`, 'POST', { recipientAddress }, baseURL);
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data.error;
    } else {
      throw error.message;
    }
  }
},

 
  // Peer Module
  connectPeers: async (username) => makeRequest(`/blockchain/peers/connect/${username}`, 'GET', null, peerURL),
  notifyPeers: async () => makeRequest(`/blockchain/peers/notify-new-block`, 'GET', null, peerURL),

  // Block Module
  getAllBlocks: async () => makeRequest(`/blockchain/blocks`, 'GET', null, baseURL),
  getBlockDetails: async (index) => makeRequest(`/blockchain/blocks/${index}`, 'GET', null, baseURL),

  // Blockchain Module
  getGeneralBlockchainInfo: async () => makeRequest(`/blockchain`, 'GET', null, baseURL),
  getDetailedBlockchainInfo: async () => makeRequest(`/blockchain/info`, 'GET', null, baseURL),
  getDebugInfo: async () => makeRequest(`/blockchain/debug`, 'GET', null, baseURL),
  resetBlockchain: async () => makeRequest(`/blockchain/debug/reset-chain`, 'POST', null, baseURL),
  mineNewBlock: async (minerAddress, difficulty) => makeRequest(`/blockchain/debug/mine/${minerAddress}/${difficulty}`, 'GET', null, baseURL),

  addTransactions: async (sender, recipient, amount) => {
    try {
      const requestData = { sender, recipient, amount };
      console.log("Data being passed to transaction:", requestData);

      const response = await makeRequest(`/blockchain/transactions/add`, 'POST', requestData, baseURL);
    } catch (error) {
      throw error.response ? error.response.data.error : error.message;
    }
  },

  // Marketplace Module
  listAllProducts: async () => makeRequest(`/marketplace/listAllProducts`, 'GET', null, baseURL),
  addProduct: async (productData) => makeRequest(`/marketplace/addProduct`, 'POST', productData, baseURL),
  purchaseProduct: async (productId) => makeRequest(`/marketplace/purchaseProduct`, 'POST', { productId }, baseURL),
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
