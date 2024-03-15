const Block = require('./createblock');
const Transaction = require('./Transaction');

class CreateBlockchain {
  constructor(difficulty = 4) {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = difficulty; // Assign the provided difficulty value or default to 4
    this.reward = 10;
}

  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    this.chain.push(block);
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  mineBlock(minerAddress, difficulty) {
    const rewardTransaction = new Transaction(
      null,
      minerAddress,
      this.reward,
      Date.now()
    );
    this.pendingTransactions.push(rewardTransaction);

    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash,
      minerAddress,
      difficulty
    );
    block.mineBlock();

    this.addBlock(block);
    this.pendingTransactions = [];

    return block;
  }

  getBalance(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.sender === address) {
          balance -= transaction.amount;
        }
        if (transaction.recipient === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  // Method to reset the blockchain to an empty state
  resetBlockchain() {
    // Clear the chain and pending transactions
    this.chain = [];
    this.pendingTransactions = [];
  }
}

module.exports = CreateBlockchain;
