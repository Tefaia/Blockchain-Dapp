const express = require('express');
const router = express.Router();
const CreateBlockchain = require('./createblockchain');
const CreateBlock = require('./createblock');
const Transaction = require('./Transaction');

const blockchain = new CreateBlockchain();

function addBlockToBlockchain(data, minerAddress, difficulty) {
  const newBlock = new CreateBlock(
    blockchain.chain.length,
    Date.now(),
    data,
    blockchain.getLatestBlock().hash,
    minerAddress,
    difficulty
  );
  newBlock.mineBlock();
  blockchain.addBlock(newBlock);
}

router.get('/', (req, res) => {
  const blocks = blockchain.chain.map(block => {
    return {
      index: block.index,
      data: block.transactions,
      timestamp: block.timestamp,
    };
  });
  res.json(blocks);
});

router.get('/:index', (req, res) => {
  const index = parseInt(req.params.index);

  // Check if the requested index is valid
  if (index >= 1 && index <= blockchain.chain.length) {
    const block = blockchain.chain[index - 1];
    res.json({
      index: block.index,
      data: block.transactions,
      timestamp: block.timestamp,
    });
  } else {
    res.status(404).json({ error: 'Block not found' });
  }
});

// POST /blocks
router.post('/blocks', (req, res) => {
  try {
    const { data, minerAddress, difficulty } = req.body;

    if (!data || !minerAddress || !difficulty) {
      return res.status(400).json({ error: 'Invalid or missing block data' });
    }

    addBlockToBlockchain(data, minerAddress, difficulty);

    res.status(201).json({
      message: 'New block added to the blockchain',
    });
  } catch (error) {
    console.error('Error adding block:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
