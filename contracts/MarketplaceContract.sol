// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ProofOfWork.sol"; // Update the import statement

contract Marketplace is ERC20, ProofOfWork {
    address public owner;
    mapping(address => uint256) public balances;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        bool exists;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductPurchased(address indexed buyer, uint256 productId, uint256 price);

    constructor() ERC20("MarketplaceToken", "MPT") {
        owner = msg.sender;
        _mint(owner, 1000000 * 10**decimals()); // Mint initial tokens
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function addFunds() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawFunds(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient funds");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function purchaseProduct(uint256 productId) public {
        Product storage product = products[productId];
        require(product.exists, "Product does not exist");
        require(balances[msg.sender] >= product.price, "Insufficient funds");
        
        balances[msg.sender] -= product.price;
        balances[owner] += product.price;
        _mint(msg.sender, product.price); // Mint ERC-20 tokens equivalent to the purchase price
        emit ProductPurchased(msg.sender, productId, product.price);
    }

    function addProduct(string memory name, uint256 price) public onlyOwner {
        productCount++;
        products[productCount] = Product(productCount, name, price, true);
    }

    function updateProduct(uint256 productId, string memory newName, uint256 newPrice) public onlyOwner {
        require(products[productId].exists, "Product does not exist");
        products[productId].name = newName;
        products[productId].price = newPrice;
    }

    function deleteProduct(uint256 productId) public onlyOwner {
        require(products[productId].exists, "Product does not exist");
        delete products[productId];
    }

    function listAllProducts() public view returns (Product[] memory) {
        Product[] memory productList = new Product[](productCount);
        for (uint256 i = 1; i <= productCount; i++) {
            productList[i - 1] = products[i];
        }
        return productList;
    }
}
