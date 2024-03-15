//marketplace.js
const express = require('express');
const { ethers } = require('hardhat');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const cors = require('cors');
router.use(bodyParser.json());
router.use(cors());
// Adjust path to point to your artifacts directory
const marketplaceContractArtifactPath = path.resolve(__dirname, '../artifacts/contracts/MarketplaceContract.sol/Marketplace.json');
const shippingStatusContractArtifactPath = path.resolve(__dirname, '../artifacts/contracts/ShippingStatusContract.sol/ShippingStatus.json');

// Connect to the Ethereum network
const provider = ethers.provider; // Use Hardhat's default provider
const signer = provider.getSigner(); // Get signer from the provider

// Read the contract artifacts and get ABIs
const marketplaceArtifact = require(marketplaceContractArtifactPath);
const shippingStatusArtifact = require(shippingStatusContractArtifactPath);

const fs = require('fs');


// Define file paths
const marketplaceContractAddressFile = path.resolve(__dirname, 'MarketplaceContractAddress.txt');
const shippingStatusContractAddressFile = path.resolve(__dirname, 'ShippingStatusContractAddress.txt');

// Read contract addresses from text files
const marketplaceContractAddress = fs.readFileSync(marketplaceContractAddressFile, 'utf-8').trim();
const shippingStatusContractAddress = fs.readFileSync(shippingStatusContractAddressFile, 'utf-8').trim();

// Use the contract addresses in your code
console.log('Marketplace Contract Address:', marketplaceContractAddress);
console.log('Shipping Status Contract Address:', shippingStatusContractAddress);

// Define contract interfaces
const marketplaceContract = new ethers.Contract(
    marketplaceContractAddress, 
    marketplaceArtifact.abi, 
    signer
);

const shippingStatusContract = new ethers.Contract(
    shippingStatusContractAddress, 
    shippingStatusArtifact.abi, 
    signer
);


// API endpoint to add funds to the contract
router.post('/addFunds', async (req, res) => {
    try {
      const { amount } = req.body;
      const transaction = await marketplaceContract.addFunds({ value: ethers.utils.parseEther(amount) });
      await transaction.wait();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  // API endpoint to withdraw funds from the contract
  router.post('/withdrawFunds', async (req, res) => {
    try {
      const { amount } = req.body;
      const transaction = await marketplaceContract.withdrawFunds(ethers.utils.parseEther(amount));
      await transaction.wait();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.post('/addProduct', async (req, res) => {
    try {
      const { name, price } = req.body;
      const transaction = await marketplaceContract.addProduct(name, ethers.utils.parseEther(price));
      await transaction.wait();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.post('/updateProduct', async (req, res) => {
    try {
      const { productId, newName, newPrice } = req.body;
      const transaction = await marketplaceContract.updateProduct(productId, newName, ethers.utils.parseEther(newPrice));
      await transaction.wait();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.post('/deleteProduct', async (req, res) => {
    try {
      const { productId } = req.body;
      const transaction = await marketplaceContract.deleteProduct(productId);
      await transaction.wait();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.get('/listAllProducts', async (req, res) => {
    try {
      const products = await marketplaceContract.listAllProducts();
      res.json({ success: true, products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // API endpoint to purchase a product
  router.post('/purchaseProduct', async (req, res) => {
    try {
      const { productId } = req.body;
      const transaction = await marketplaceContract.purchaseProduct(productId);
      await transaction.wait();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

  router.post('/createShipment', async (req, res) => {
    try {
        const { buyer, seller } = req.body;
        await createShipment(buyer, seller);
        res.json({ success: true, message: 'Shipment created successfully.' });
    } catch (error) {
        console.error('Error in createShipment route:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/updateShipmentStatus', async (req, res) => {
    try {
        const { shipmentId, status } = req.body;
        await updateShipmentStatus(shipmentId, status);
        res.json({ success: true, message: 'Shipment status updated successfully.' });
    } catch (error) {
        console.error('Error in updateShipmentStatus route:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



  module.exports = router; 

