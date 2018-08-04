'use strict';

const { createHash, randomBytes } = require('crypto');
const signing = require('./signing');


/**
 * A simple signed Transaction class for sending funds from the signer to
 * another public key.
 */
class Transaction {
  /**
   * The constructor accepts a hex private key for the sender, a hex
   * public key for the recipient, and a number amount. It will use these
   * to set a number of properties, including a Secp256k1 signature.
   *
   * Properties:
   *   - source: the public key derived from the provided private key
   *   - recipient: the provided public key for the recipient
   *   - amount: the provided amount
   *   - signature: a unique signature generated from a combination of the
   *     other properties, signed with the provided private key
   */
  constructor(privateKey, recipient, amount) {
    this.privateKey = privateKey;
    this.recipient = recipient;
    this.amount = amount;
    this.source = signing.getPublicKey(this.privateKey);
    this.signature = signing.sign(this.privateKey, this.source + this.recipient + this.amount);
  }
}

/**
 * A Block class for storing an array of transactions and the hash of a
 * previous block. Includes a method to calculate and set its own hash.
 */
class Block {
  /**
   * Accepts an array of transactions and the hash of a previous block. It
   * saves these and uses them to calculate a hash.
   *
   * Properties:
   *   - transactions: the passed in transactions
   *   - previousHash: the passed in hash
   *   - nonce: just set this to some hard-coded number for now, it will be
   *     used later when we make blocks mineable with our own PoW algorithm
   *   - hash: a unique hash string generated from the other properties
   */
  constructor(transactions, previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = null;
    this.hash = null;
  }

  /**
   * Accepts a nonce, and generates a unique hash for the block. Updates the
   * hash and nonce properties of the block accordingly.
   *
   * Hint:
   *   The format of the hash is up to you. Remember that it needs to be
   *   unique and deterministic, and must become invalid if any of the block's
   *   properties change.
   */
  calculateHash(nonce) {
    this.nonce = nonce;

    let transactions = createHash('sha256').update(String(this.transactions)).digest('hex');
    let previousHash = createHash('sha256').update(String(this.previousHash)).digest('hex');
    nonce = createHash('sha256').update(String(nonce)).digest('hex');
    this.hash = nonce + transactions + previousHash;

    return this.hash;
  }
}

const signer = signing.createPrivateKey();
const recipient = signing.getPublicKey(signing.createPrivateKey());
const amount = Math.ceil(Math.random() * 100);

const transactions = [ new Transaction(signer, recipient, amount) ];
const previousHash = randomBytes(64).toString('hex');

var block = new Block(transactions, previousHash);
console.log('nonce 0', block.calculateHash(0))
console.log('nonce 1', block.calculateHash(1))
console.log('nonce 2', block.calculateHash(2))

/**
 * A Blockchain class for storing an array of blocks, each of which is linked
 * to the previous block by their hashes. Includes methods for adding blocks,
 * fetching the head block, and checking the balances of public keys.
 */
class Blockchain {
  /**
   * Generates a new blockchain with a single "genesis" block. This is the
   * only block which may have no previous hash. It should have an empty
   * transactions array, and `null` for the previous hash.
   *
   * Properties:
   *   - blocks: an array of blocks, starting with one genesis block
   */
  constructor() {
    this.genesis = new Block([], null);
    this.blocks = [this.genesis];
  }

  /**
   * Simply returns the last block added to the chain.
   */
  getHeadBlock() {
    // return head
    return this.blocks[0];
  }

  /**
   * Accepts an array of transactions, creating a new block with them and
   * adding it to the chain.
   */
  addBlock(transactions) {
    // Your code here

  }

  /**
   * Accepts a public key, calculating its "balance" based on the amounts
   * transferred in all transactions stored in the chain.
   *
   * Note:
   *   There is currently no way to create new funds on the chain, so some
   *   keys will have a negative balance. That's okay, we'll address it when
   *   we make the blockchain mineable later.
   */
  getBalance(publicKey) {
    // Your code here

  }
}

module.exports = {
  Transaction,
  Block,
  Blockchain
};
