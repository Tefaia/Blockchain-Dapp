//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Token {
    string public name = "My Hardhat Token";
    string public symbol = "MHT";
    uint256 public totalSupply = 10000000000000;
    address public owner;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastRequestTime;
    mapping(address => uint256) public totalRequested;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event TokensSent(address indexed _from, address indexed _to, uint256 _value);

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    // Function to retrieve the balance of the faucet (owner)
    function faucetBalance() external view returns (uint256) {
        return balances[owner];
    }

   function requestTokens(address recipient, uint256 amount) external {
    // Check if the amount is valid
    require(amount > 0, "Invalid request amount");
    
    // Check if 5 minutes have passed since the last request
    require(block.timestamp >= lastRequestTime[recipient] + 5 minutes, "Please wait before requesting again");
    
    // Update last request time
    lastRequestTime[recipient] = block.timestamp;

    // Calculate total requested amount within the last 5 minutes
    uint256 newTotalRequested = totalRequested[recipient] + amount;
    require(newTotalRequested <= 500, "Exceeded maximum allowed requests in 5 minutes");

    totalRequested[recipient] = newTotalRequested;
    balances[recipient] += amount;
    balances[owner] -= amount;

    emit TokensSent(owner, recipient, amount);
}

}
