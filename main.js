// Imports the crypto-js module.
const SHA256 = require('crypto-js/sha256');

class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block
{
    // timestamp: Tells when the block was created.
    // transactions: Data associated with the block i.e. details of a transaction (buyer and receiver)
    // previousHash: The hash of the block before the current block.
    constructor(timestamp, transactions, previousHash = '')
    {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // calculateHash() calculates the current block's hash.
    calculateHash()
    {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // mineBlock(difficulty) simulates mining a block with a given difficulty.
    // @param difficulty is the given difficulty for the mining process, the higher the difficulty the longer it will take to mine. This prevents corruption via Proof-of-Work.
    mineBlock(difficulty)
    {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; // Sets the difficulty for the blockchain for increased security. (Proof-of-Work).
        this.pendingTransactions = [];
        this.miningReward = 50; // Sets the reward that will be granted for successfully mining the Block.
    }

    // createGenesisBlock() creates and returns the first block in the Blockchain.
    createGenesisBlock()
    {
        return new Block("3/29/2018", "Genesis Block", "0");
    }

    // getLatestBlock() returns the most recent Block in the Blockchain.
    getLatestBlock()
    {
        return this.chain[this.chain.length - 1];
    }

    // minePendingTransactions(miningRewardAddress) will receive a mining reward address "miningRewardAddress" and will send the reward to it if mining is successful for the current block.
    // @param miningRewardAddress is the address that will receive the reward if the current block is mined successfully.
    minePendingTransactions(miningRewardAddress)
    {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined.');
        this.chain.push(block);

        this.pendingTransactions = 
        [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    // createTransaction(transaction) will receive a transaction 'transaction' and add it to the pending transactions area.
    // @param transaction is the transaction that will be added to an area.
    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    // getBalanceOfAddress(address) will receive an address that will have its balance checked.
    // @param address is the address that will be checked.
    getBalanceOfAddress(address)
    {
        let balance = 0;

        for(const block of this.chain) // Loop over all blocks in the Blockchain.
        {
            for(const trans of block.transactions) // Loop over the transactions in the block.
            {
                if(trans.fromAddress === address) // Check if the from address is the same as the given address.
                {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) // Check if the to address is the same as the given address.
                {
                    balance += trans.amount;
                }
            }
        }
        
        return balance; // Return the balance.
    }
    
    // checkValidity() iterates through the entire Blockchain starting after the Genesis Block and screens each block for its validity.
    // It will return false if it fails to meet the security conditions, and true if it passes the screening.
    checkValidity()
    {
        // Start at blocks after the genesis block.
        for(let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            // 1. Check if the hash of the current block is valid.
            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            // 2. Check if the block's hash points to the previous block's hash.
            if(currentBlock.previousBlock !== previousBlock.hash)
            {
                return false;
            }

            // If both conditions are satisfied, the block is considered valid.
            return true;
        }
    }
}

let AceCoin = new Blockchain();
AceCoin.createTransaction(new Transaction('address1', 'address2', 50));

console.log('\nMining Attempt: 1');
AceCoin.minePendingTransactions('Isaiahs-address');
console.log('\nBalance of Isaiah is', AceCoin.getBalanceOfAddress('Isaiahs-address'));

console.log('\nMining Attempt: 2');
AceCoin.minePendingTransactions('Isaiahs-address');
console.log('\nBalance of Isaiah is', AceCoin.getBalanceOfAddress('Isaiahs-address'));

console.log('\nMining Attempt: 3');
AceCoin.minePendingTransactions('Isaiahs-address');
console.log('\nBalance of Isaiah is', AceCoin.getBalanceOfAddress('Isaiahs-address'));

console.log('\nMining Attempt: 4');
AceCoin.minePendingTransactions('Isaiahs-address');
console.log('\nBalance of Isaiah is', AceCoin.getBalanceOfAddress('Isaiahs-address'));

console.log('\nMining Attempt: 5');
AceCoin.minePendingTransactions('Isaiahs-address');
console.log('\nBalance of Isaiah is', AceCoin.getBalanceOfAddress('Isaiahs-address'));

