const { ethers } = require('ethers');
const Document = require('../models/Document');
const { sha256 } = require('crypto-hashing');

class Notary {
  constructor() {
    this.provider = new ethers.providers.AlchemyProvider(
      'goerli', 
      process.env.ALCHEMY_KEY
    );
    this.wallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      [
        'function notarize(string memory docHash, uint256 timestamp) public',
        'event Notarized(address indexed notary, string docHash)'
      ],
      this.wallet
    );
  }

  async createHash(content) {
    return sha256(Buffer.from(content));
  }

  async notarizeDocument(docId) {
    const doc = await Document.findById(docId);
    const docHash = await this.createHash(doc.content);
    
    const tx = await this.contract.notarize(
      docHash, 
      Math.floor(Date.now() / 1000),
      { gasLimit: 500000 }
    );
    
    await tx.wait(2); // 2 confirmations
    doc.notarized = true;
    doc.txHash = tx.hash;
    await doc.save();
    
    return {
      hash: docHash,
      txHash: tx.hash,
      blockExplorer: `https://goerli.etherscan.io/tx/${tx.hash}`
    };
  }
}

module.exports = new Notary();