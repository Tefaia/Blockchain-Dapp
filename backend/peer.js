const express = require('express');
const router = express.Router();
const connectedPeers = require('./p2p');
const CreateBlockchain = require('./createblockchain');
const CreateBlock = require('./createblock');

console.log('Initial connected peers:', connectedPeers);
router.post('/peers/connect', async (req, res) => {
    try {
        const { peerAddress } = req.body;
        connectedPeers.push(peerAddress);
        console.log(`Connected to peer: ${peerAddress}`);
        res.json({ message: 'Connected to peer successfully' });
    } catch (error) {
        console.error('Error connecting to a new peer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/peers/notify-new-block', async (req, res) => {
    try {
        const { newBlock } = req.body;
        console.log('New block received from peer:', newBlock);
        res.json({ message: 'New block notified to peers successfully' });
    } catch (error) {
        console.error('Error notifying peers about a new block:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
