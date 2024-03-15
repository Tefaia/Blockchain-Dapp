const path = require('path');
const fs = require('fs/promises'); // Use fs.promises for asynchronous file operations
const { ethers } = require('hardhat');

async function loadContractArtifacts() {
    try {
        const marketplaceContractArtifactPath = path.resolve(__dirname, '../artifacts/contracts/MarketplaceContract.sol/Marketplace.json');
        const shippingStatusContractArtifactPath = path.resolve(__dirname, '../artifacts/contracts/ShippingStatusContract.sol/ShippingStatus.json');

        const marketplaceArtifact = require(marketplaceContractArtifactPath);
        const shippingStatusArtifact = require(shippingStatusContractArtifactPath);

        const [deployer] = await ethers.getSigners();

        const Marketplace = new ethers.ContractFactory(
            marketplaceArtifact.abi,
            marketplaceArtifact.bytecode,
            deployer
        );

        const ShippingStatus = new ethers.ContractFactory(
            shippingStatusArtifact.abi,
            shippingStatusArtifact.bytecode,
            deployer
        );

        return { Marketplace, ShippingStatus };
    } catch (error) {
        throw new Error(`Error loading contract artifacts: ${error.message}`);
    }
}

async function writeContractAddressToFile(contractName, address) {
    const filePath = path.resolve(__dirname, `${contractName}Address.json`);
    const data = JSON.stringify({ address });
    await fs.writeFile(filePath, data);
}

async function deployAndInteract() {
    try {
        const { Marketplace, ShippingStatus } = await loadContractArtifacts();

        const marketplaceContract = await Marketplace.deploy();
        const shippingStatusContract = await ShippingStatus.deploy();

        console.log("Marketplace Contract deployed at:", marketplaceContract.address);
        console.log("ShippingStatus Contract deployed at:", shippingStatusContract.address);

        // Write contract addresses to files
        await writeContractAddressToFile('Marketplace', marketplaceContract.address);
        await writeContractAddressToFile('ShippingStatus', shippingStatusContract.address);

        console.log("Contracts deployed and addresses stored in files.");
    } catch (error) {
        throw new Error(`Error deploying and interacting with contracts: ${error.message}`);
    }
}

deployAndInteract()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
