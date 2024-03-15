const express = require('express');
const router = express.Router();
const CreateBlockchain = require('./createblockchain');
const CreateBlock = require('./createblock');
const Transaction = require('./Transaction');
const MinerRouter = require('./miner');
const GenerateAddressRouter = require('./generateaddress');

const blockchain = new CreateBlockchain();

// Function to add a block to the blockchain
function addBlockToBlockchain(data) {
  const newBlock = new CreateBlock(
    blockchain.chain.length,
    Date.now(),
    data,
    blockchain.getLatestBlock().hash
  );
  newBlock.mineBlock(blockchain.difficulty);
  blockchain.addBlock(newBlock);
}

// Endpoint to get general information about the blockchain
router.get('/', (req, res) => {
  const generalInfo = {
    blocksCount: blockchain.chain.length,
    difficulty: blockchain.difficulty,
    reward: blockchain.reward,
  };
  res.json(generalInfo);
});

// Endpoint to get detailed information about the blockchain
router.get('/info', (req, res) => {
  res.json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions,
  });
});

// Endpoint to get debugging information for the blockchain
router.get('/debug', (req, res) => {
  res.json({
    isValid: blockchain.isValid(),
  });
});

// Endpoint to reset the blockchain to its initial state
router.get('/debug/reset-chain', (req, res) => {
  blockchain.resetBlockchain();
  res.json({ message: 'Blockchain reset to initial state' });
});
// GET /debug/mine/:address/:difficulty
router.get('/debug/mine/:address/:difficulty', async (req, res) => {
  try {
    // Extract address and difficulty from request parameters
    const minerAddress = req.params.address;
    const difficulty = parseInt(req.params.difficulty);

    // Logic to handle mining debug requests
    const miningJob = await getMiningJob(minerAddress, difficulty);
    const minedBlockData = await mineBlock(miningJob.blockTemplate);
    const success = await validateAndSubmitBlock(minedBlockData);

    // Send a response based on the success of block submission
    if (success) {
      res.status(200).send('Mined block submitted successfully.');
    } else {
      res.status(500).send('Failed to submit mined block.');
    }
  } catch (error) {
    // Handle errors
    console.error('Error handling mining debug request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// POST /transactions
router.post('/transactions', (req, res) => {
  const { sender, recipient, amount } = req.body;
  const newTransaction = new Transaction(sender, recipient, amount);
  blockchain.addTransaction(newTransaction);
  res.json({ message: 'Transaction added successfully', transaction: newTransaction });
});

// GET /transactions/pending
router.get('/transactions/pending', (req, res) => {
  // Retrieve the list of pending transactions
  const pendingTransactions = blockchain.pendingTransactions;
  res.json(pendingTransactions);
});

// GET /transactions/confirmed
router.get('/transactions/confirmed', (req, res) => {
  // Retrieve the list of confirmed transactions
  const confirmedTransactions = blockchain.getAllTransactions();
  res.json(confirmedTransactions);
});

// GET /transactions/:tranHash
router.get('/transactions/:tranHash', (req, res) => {
  const tranHash = req.params.tranHash;
  const transaction = blockchain.getTransactionByHash(tranHash);
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

module.exports = router;
