const express = require('express');
const router = express.Router();
const Block = require('./createblock');
const Transaction = require('./Transaction');
const Blockchain = require('./createblockchain'); // Import the Blockchain class
const crypto = require('crypto');

// Function to generate a block template with proof-of-work parameters
function generateBlockTemplate(transactions, difficulty) {
  const blockTemplate = {
    transactions: transactions,
    difficulty: difficulty,
    nonce: 0, // Initial nonce value
  };
  return blockTemplate;
}

function proofOfWork(blockTemplate, difficulty) {
  let nonce = 0;
  let hash = '';

  // Construct a string to hash by concatenating block data and nonce
  const data = JSON.stringify(blockTemplate);

  // Define the prefix that the hash must have based on the difficulty
  const prefix = '0'.repeat(difficulty);

  // Loop until a valid hash is found
  while (hash.substring(0, difficulty) !== prefix) {
    // Update nonce and recalculate the hash
    nonce++;
    hash = crypto.createHash('sha256').update(data + nonce).digest('hex');
  }

  return { nonce, hash };
}

// Function to get a mining job with proof-of-work parameters
async function getMiningJob(minerAddress, difficulty) {
  try {
    // Logic to get a mining job for the specified miner address
    const blockTemplate = generateBlockTemplate(Blockchain.pendingTransactions, difficulty);
    return { blockTemplate, minerAddress };
  } catch (error) {
    console.error('Error getting mining job:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
}

// Function to validate and submit a mined block with proof-of-work
async function validateAndSubmitBlock(minedBlockData) {
  // Validate the block by checking the proof-of-work difficulty
  const isValidBlock = validateProofOfWork(minedBlockData);

  // If the block is valid, add it to the blockchain
  if (isValidBlock) {
    await Blockchain.addBlock(minedBlockData);
  }

  return isValidBlock;
}

// Function to validate the proof-of-work difficulty
function validateProofOfWork(minedBlockData) {
  const { difficulty, proofOfWork } = minedBlockData;

  // Check if the proof-of-work meets the required difficulty level
  const requiredPrefix = '0'.repeat(difficulty);
  const isValidProofOfWork = proofOfWork.startsWith(requiredPrefix);

  return isValidProofOfWork;
}

// Mining endpoint to get a mining job
router.get('/get-mining-job/:address/:difficulty', async (req, res) => {
  try {
    const minerAddress = req.params.address;
    const difficulty = parseInt(req.params.difficulty);

    // Logic to get a mining job for the specified miner address and difficulty
    const miningJob = await getMiningJob(minerAddress, difficulty);
    res.json({ miningJob });
  } catch (error) {
    console.error('Error getting mining job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to submit a mined block
router.post('/submit-mined-block', async (req, res) => {
  try {
    // Extract the mined block data from the request body
    const minedBlockData = req.body;

    // Logic to validate and submit the mined block to the blockchain
    const success = await validateAndSubmitBlock(minedBlockData);

    // Respond with a JSON object indicating the success or failure of the submission
    if (success) {
      res.json({ success: true, message: 'Mined block submitted successfully' });
    } else {
      res.json({ success: false, message: 'Failed to submit mined block' });
    }
  } catch (error) {
    // Handle any errors that may occur during block submission
    console.error('Error submitting mined block:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to initiate mining process
router.post('/mine', async (req, res) => {
  try {
    const minerAddress = req.body.minerAddress;
    const difficulty = parseInt(req.body.difficulty);

    // Get a mining job for the specified miner address and difficulty
    const miningJob = await getMiningJob(minerAddress, difficulty);

    // Perform proof of work
    const { blockTemplate } = miningJob;
    const { nonce, hash } = proofOfWork(blockTemplate, difficulty);

    // Add proof of work data to the block template
    blockTemplate.nonce = nonce;
    blockTemplate.hash = hash;

    // Validate and submit the mined block
    const success = await validateAndSubmitBlock(blockTemplate);

    if (success) {
      res.json({ success: true, message: 'Block mined and submitted successfully' });
    } else {
      res.json({ success: false, message: 'Failed to mine and submit block' });
    }
  } catch (error) {
    console.error('Error during mining process:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
