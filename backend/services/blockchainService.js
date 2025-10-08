const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.init();
  }

  async init() {
    try {
      // Initialize provider
      this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
      
      // Initialize signer (for contract deployment and admin functions)
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      }

      // Load contract info
      await this.loadContract();
      
      console.log('✅ Blockchain service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error.message);
    }
  }

  async loadContract() {
    try {
      const contractInfoPath = path.join(__dirname, '..', 'contracts-info', 'HerbCollection.json');
      
      if (fs.existsSync(contractInfoPath)) {
        const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, 'utf8'));
        
        if (this.signer) {
          this.contract = new ethers.Contract(
            contractInfo.address,
            JSON.parse(contractInfo.abi),
            this.signer
          );
        }
        
        console.log('✅ Contract loaded:', contractInfo.address);
      } else {
        console.log('⚠️  Contract info not found. Deploy the contract first.');
      }
    } catch (error) {
      console.error('❌ Failed to load contract:', error.message);
    }
  }

  // Get contract instance for read operations (no signer needed)
  getReadOnlyContract() {
    try {
      const contractInfoPath = path.join(__dirname, '..', 'contracts-info', 'HerbCollection.json');
      
      if (fs.existsSync(contractInfoPath)) {
        const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, 'utf8'));
        
        return new ethers.Contract(
          contractInfo.address,
          JSON.parse(contractInfo.abi),
          this.provider
        );
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get read-only contract:', error.message);
      return null;
    }
  }

  // Submit collection to blockchain
  async submitCollection(collectionData, userAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      // Create a contract instance with user's address as signer
      // Note: In a real app, the user would sign this transaction from the frontend
      const userProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
      
      // For demo purposes, we'll use the admin signer
      // In production, the user would sign this transaction
      const tx = await this.contract.submitCollection(
        collectionData.herbName,
        collectionData.quantity,
        collectionData.batchId,
        collectionData.location,
        collectionData.notes || ""
      );

      const receipt = await tx.wait();
      
      // Extract collection ID from the event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'CollectionSubmitted';
        } catch {
          return false;
        }
      });

      let collectionId = null;
      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        collectionId = parsed.args.collectionId.toString();
      }

      return {
        success: true,
        transactionHash: tx.hash,
        collectionId,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to submit collection:', error.message);
      throw error;
    }
  }

  // Get collection by ID
  async getCollection(collectionId) {
    try {
      const contract = this.getReadOnlyContract();
      if (!contract) {
        throw new Error('Contract not available');
      }

      const collection = await contract.getCollection(collectionId);
      
      return {
        id: collection.id.toString(),
        herbName: collection.herbName,
        quantity: collection.quantity,
        batchId: collection.batchId,
        collector: collection.collector,
        location: collection.location,
        notes: collection.notes,
        timestamp: new Date(Number(collection.timestamp) * 1000).toISOString(),
        isVerified: collection.isVerified
      };
    } catch (error) {
      console.error('❌ Failed to get collection:', error.message);
      throw error;
    }
  }

  // Get all collections for a collector
  async getCollectorCollections(collectorAddress) {
    try {
      const contract = this.getReadOnlyContract();
      if (!contract) {
        throw new Error('Contract not available');
      }

      const collectionIds = await contract.getCollectorCollections(collectorAddress);
      const collections = [];

      for (const id of collectionIds) {
        try {
          const collection = await this.getCollection(id.toString());
          collections.push(collection);
        } catch (error) {
          console.error(`Failed to get collection ${id}:`, error.message);
        }
      }

      return collections;
    } catch (error) {
      console.error('❌ Failed to get collector collections:', error.message);
      throw error;
    }
  }

  // Get all collections
  async getAllCollections() {
    try {
      const contract = this.getReadOnlyContract();
      if (!contract) {
        throw new Error('Contract not available');
      }

      const collections = await contract.getAllCollections();
      
      return collections.map(collection => ({
        id: collection.id.toString(),
        herbName: collection.herbName,
        quantity: collection.quantity,
        batchId: collection.batchId,
        collector: collection.collector,
        location: collection.location,
        notes: collection.notes,
        timestamp: new Date(Number(collection.timestamp) * 1000).toISOString(),
        isVerified: collection.isVerified
      }));
    } catch (error) {
      console.error('❌ Failed to get all collections:', error.message);
      throw error;
    }
  }

  // Verify collection (admin only)
  async verifyCollection(collectionId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.verifyCollection(collectionId);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to verify collection:', error.message);
      throw error;
    }
  }

  // Get contract address
  getContractAddress() {
    try {
      const contractInfoPath = path.join(__dirname, '..', 'contracts-info', 'HerbCollection.json');
      
      if (fs.existsSync(contractInfoPath)) {
        const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, 'utf8'));
        return contractInfo.address;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get contract address:', error.message);
      return null;
    }
  }

  // Get contract ABI
  getContractABI() {
    try {
      const contractInfoPath = path.join(__dirname, '..', 'contracts-info', 'HerbCollection.json');
      
      if (fs.existsSync(contractInfoPath)) {
        const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, 'utf8'));
        return JSON.parse(contractInfo.abi);
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get contract ABI:', error.message);
      return null;
    }
  }
}

module.exports = new BlockchainService();
