require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const Transaction = require('./Transaction');

const router = express.Router();
router.use(express.json());

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

const faucetPrivateKey = process.env.FAUCET_PRIVATE_KEY;
const faucetWallet = new ethers.Wallet(faucetPrivateKey, provider);

async function sendEthFromFaucet(recipientAddress) {
  const amount = 1; // Fixed amount of 1 ETH
  const tx = await faucetWallet.sendTransaction({
    to: recipientAddress,
    value: ethers.utils.parseEther(amount.toString()),
  });
  await tx.wait();
  console.log(`Sent ${amount} ETH to ${recipientAddress}. Transaction hash: ${tx.hash}`);

  const transaction = new Transaction(faucetWallet.address, recipientAddress, amount);
  console.log('Transaction:', transaction.toJSON()); // Output transaction details
}

async function getFaucetBalance() {
  const balance = await provider.getBalance(faucetWallet.address);
  return ethers.utils.formatEther(balance);
}

router.get('/balance', async (req, res) => {
  try {
    const balance = await getFaucetBalance();
    res.json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sendfunds', async (req, res) => {
  const { recipientAddress } = req.body;
  try {
    await sendEthFromFaucet(recipientAddress);
    const balance = await getFaucetBalance();
    res.json({ message: `Successfully sent 1 ETH to ${recipientAddress}`, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;







