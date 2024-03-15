const express = require('express');
const router = express.Router();
const { generateNewAddress } = require("./generateaddress");

router.get('/generate', async (req, res) => {
  try {
    // Generate a new address and private key
    const walletInfo = await generateNewAddress();

    // Send the newly generated address, private key, and balance as a JSON response
    res.json(walletInfo);
  } catch (error) {
    console.error('Error generating new address:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

router.get('/balances/:address', async (req, res) => {
  try {
    const balance = await getWalletBalance(req.params.address);
    res.json({ balance });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/address/:address/transactions', async (req, res) => {
  try {
    const transactions = await getAddressTransactions(req.params.address);
    res.json({ transactions });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
