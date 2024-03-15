const { ethers } = require("hardhat");

// Function to generate a new address using Hardhat's provider
async function generateNewAddress() {
  try {
    // Generate a new Ethereum wallet address
    const wallet = ethers.Wallet.createRandom();
    const newAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // Convert private key to hex
    const privateKeyHex = ethers.utils.hexlify(privateKey);

    // Send a transaction to the new address
    const provider = ethers.getDefaultProvider();
    const balance = await provider.getBalance(newAddress);

    // Convert the balance to Ether
    const balanceInEther = ethers.utils.formatEther(balance);

    return { address: newAddress, privateKey: privateKeyHex, balance: balanceInEther };
  } catch (error) {
    console.error('Error generating new address:', error);
    throw error;
  }
}

// Export the generateNewAddress function
module.exports = { generateNewAddress };
