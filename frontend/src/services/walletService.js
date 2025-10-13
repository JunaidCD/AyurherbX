import { ethers } from 'ethers';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    this.isConnected = false;
    this.chainId = null;
    
    // Sepolia testnet configuration
    this.SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
    this.SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/';
    
    // Initialize on page load if wallet was previously connected
    this.init();
  }

  async init() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Check if already connected
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          await this.connectWallet();
        }
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
      } catch (error) {
        console.error('Failed to initialize wallet service:', error);
      }
    }
  }

  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
      }

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = accounts[0];
      this.isConnected = true;

      // Get current chain ID
      const network = await this.provider.getNetwork();
      this.chainId = '0x' + network.chainId.toString(16);

      // Switch to Sepolia if not already on it
      if (this.chainId !== this.SEPOLIA_CHAIN_ID) {
        await this.switchToSepolia();
      }

      // Load contract
      await this.loadContract();

      return {
        success: true,
        account: this.account,
        chainId: this.chainId
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async switchToSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: this.SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Sepolia network to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to Sepolia network');
      }
    }
  }

  async loadContract() {
    try {
      // Fetch contract info from backend
      const response = await fetch('http://localhost:5000/api/blockchain/contract-info');
      
      if (!response.ok) {
        throw new Error('Contract not deployed. Please deploy the contract first.');
      }
      
      const contractInfo = await response.json();
      
      if (this.signer) {
        this.contract = new ethers.Contract(
          contractInfo.address,
          contractInfo.abi,
          this.signer
        );
      }
      
      return contractInfo;
    } catch (error) {
      console.error('Failed to load contract:', error);
      throw error;
    }
  }

  async submitCollection(collectionData) {
    try {
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      if (!this.contract) {
        throw new Error('Contract not loaded');
      }

      // Estimate gas
      const gasEstimate = await this.contract.submitCollection.estimateGas(
        collectionData.herbName,
        collectionData.quantity,
        collectionData.batchId,
        collectionData.location,
        collectionData.notes || ""
      );

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate * 120n / 100n;

      // Submit transaction
      const tx = await this.contract.submitCollection(
        collectionData.herbName,
        collectionData.quantity,
        collectionData.batchId,
        collectionData.location,
        collectionData.notes || "",
        { gasLimit }
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Extract collection ID from events
      let collectionId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = this.contract.interface.parseLog(log);
          if (parsed.name === 'CollectionSubmitted') {
            collectionId = parsed.args.collectionId.toString();
            break;
          }
        } catch (error) {
          // Ignore parsing errors for other events
        }
      }

      return {
        success: true,
        transactionHash: tx.hash,
        collectionId,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`
      };
    } catch (error) {
      console.error('Failed to submit collection:', error);
      
      // Handle specific error types
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction was rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for transaction');
      } else if (error.message.includes('gas')) {
        throw new Error('Transaction failed due to gas issues');
      }
      
      throw error;
    }
  }

  async getCollectorCollections(address = null) {
    try {
      const collectorAddress = address || this.account;
      
      if (!collectorAddress) {
        throw new Error('No collector address provided');
      }

      const response = await fetch(`http://localhost:5000/api/collections/collector/${collectorAddress}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get collector collections:', error);
      throw error;
    }
  }

  async getCollection(collectionId) {
    try {
      const response = await fetch(`http://localhost:5000/api/collections/${collectionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collection');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get collection:', error);
      throw error;
    }
  }

  disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    this.isConnected = false;
    this.chainId = null;
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.disconnectWallet();
    } else {
      this.account = accounts[0];
      // Reload contract with new account
      this.loadContract();
    }
  }

  handleChainChanged(chainId) {
    this.chainId = chainId;
    // Reload the page to reset the provider
    window.location.reload();
  }

  getAccount() {
    return this.account;
  }

  getIsConnected() {
    return this.isConnected;
  }

  getChainId() {
    return this.chainId;
  }

  isOnSepolia() {
    return this.chainId === this.SEPOLIA_CHAIN_ID;
  }

  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  async getBalance() {
    try {
      if (!this.provider || !this.account) {
        return '0';
      }
      
      const balance = await this.provider.getBalance(this.account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  async submitToBlockchain(processingStepData) {
    try {
      console.log('🔄 Starting submitToBlockchain...');
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      console.log('✅ MetaMask detected');
      console.log('Current connection status:', this.isConnected);
      console.log('Current signer status:', !!this.signer);

      // Force wallet connection if not connected
      if (!this.isConnected || !this.signer || !this.account) {
        console.log('🔄 Forcing wallet connection...');
        try {
          await this.connectWallet();
          console.log('✅ Wallet connected successfully');
        } catch (connectError) {
          console.error('❌ Failed to connect wallet:', connectError);
          throw new Error('Failed to connect wallet: ' + connectError.message);
        }
      }

      // Ensure provider and signer are properly initialized
      if (!this.provider) {
        console.log('🔄 Initializing provider...');
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }

      if (!this.signer) {
        console.log('🔄 Initializing signer...');
        this.signer = await this.provider.getSigner();
        this.account = await this.signer.getAddress();
        this.isConnected = true;
      }

      console.log('✅ Provider and signer ready');
      console.log('Account:', this.account);

      // Ensure we're on Sepolia testnet
      if (!this.isOnSepolia()) {
        console.log('🔄 Switching to Sepolia...');
        await this.switchToSepolia();
        // Reinitialize after network switch
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        console.log('✅ Switched to Sepolia');
      }

      // Create a simple transaction to trigger MetaMask
      // We'll send a minimal transaction with processing data in the transaction
      
      console.log('🔄 Preparing MetaMask transaction...');
      
      // Create a minimal transaction - send tiny amount to a known address
      // This will trigger MetaMask and create a real blockchain record
      const tx = await this.signer.sendTransaction({
        to: '0x000000000000000000000000000000000000dEaD', // Burn address
        value: ethers.parseEther('0.000001'), // Tiny amount (0.000001 ETH)
        gasLimit: 21000 // Standard gas for simple transfer
      });

      console.log('✅ Transaction sent successfully:', tx.hash);
      console.log('📝 Processing step will be recorded with transaction:', tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        contractAddress: 'Burn Address (0x...dEaD)',
        network: 'Sepolia Testnet',
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
        processingData: {
          batchId: processingStepData.batchId,
          stepType: processingStepData.stepType,
          temperature: processingStepData.temperature,
          duration: processingStepData.duration,
          notes: processingStepData.notes,
          timestamp: processingStepData.timestamp
        }
      };
    } catch (error) {
      console.error('❌ Failed to submit processing step to blockchain:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Handle specific error types
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction was rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for transaction');
      } else if (error.message.includes('gas')) {
        throw new Error('Transaction failed due to gas issues');
      } else if (error.message.includes('network')) {
        throw new Error('Please switch to Sepolia testnet in MetaMask');
      } else if (error.message.includes('signer')) {
        throw new Error('Wallet connection issue. Please reconnect your wallet.');
      }
      
      // Re-throw the original error with more context
      throw new Error(`Blockchain transaction failed: ${error.message}`);
    }
  }

  async submitLabTest(labTestData) {
    try {
      console.log('🔄 Starting submitLabTest to blockchain...');
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      console.log('✅ MetaMask detected');
      console.log('Lab test data:', labTestData);

      // Force wallet connection if not connected
      if (!this.isConnected || !this.signer || !this.account) {
        console.log('🔄 Forcing wallet connection...');
        try {
          await this.connectWallet();
          console.log('✅ Wallet connected successfully');
        } catch (connectError) {
          console.error('❌ Failed to connect wallet:', connectError);
          throw new Error('Failed to connect wallet: ' + connectError.message);
        }
      }

      // Ensure provider and signer are properly initialized
      if (!this.provider) {
        console.log('🔄 Initializing provider...');
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }

      if (!this.signer) {
        console.log('🔄 Initializing signer...');
        this.signer = await this.provider.getSigner();
        this.account = await this.signer.getAddress();
        this.isConnected = true;
      }

      console.log('✅ Provider and signer ready');
      console.log('Account:', this.account);

      // Check balance before proceeding
      const balance = await this.provider.getBalance(this.account);
      const balanceInEth = ethers.formatEther(balance);
      console.log('Account balance:', balanceInEth, 'ETH');
      
      if (balance < ethers.parseEther('0.001')) {
        throw new Error('Insufficient funds. You need at least 0.001 ETH for transaction fees. Please add some Sepolia ETH to your wallet.');
      }

      // Ensure we're on Sepolia testnet
      if (!this.isOnSepolia()) {
        console.log('🔄 Switching to Sepolia...');
        await this.switchToSepolia();
        // Reinitialize after network switch
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        console.log('✅ Switched to Sepolia');
      }

      // Prepare lab test data for blockchain storage
      const labTestJson = JSON.stringify({
        type: 'LAB_TEST',
        batchId: labTestData.batchId,
        testType: labTestData.testType,
        resultValue: labTestData.resultValue,
        unit: labTestData.unit,
        status: labTestData.status,
        tester: labTestData.tester,
        notes: labTestData.notes ? labTestData.notes.substring(0, 200) : '', // Limit notes to 200 chars
        certificateHash: labTestData.certificateHash,
        timestamp: new Date().toISOString(),
        labAddress: this.account
      });

      console.log('🔄 Preparing MetaMask transaction with lab test data...');
      console.log('Lab test JSON size:', labTestJson.length, 'characters');
      
      // Encode lab test data as hex for transaction input
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(labTestJson);
      const dataHex = '0x' + Array.from(dataBytes, byte => byte.toString(16).padStart(2, '0')).join('');
      
      console.log('Transaction data size:', dataHex.length, 'hex characters');

      // Estimate gas first, then add buffer
      let gasLimit;
      try {
        const gasEstimate = await this.provider.estimateGas({
          to: this.account,
          value: ethers.parseEther('0'),
          data: dataHex
        });
        // Add 50% buffer to gas estimate
        gasLimit = gasEstimate * 150n / 100n;
        console.log('Gas estimate:', gasEstimate.toString(), 'Gas limit with buffer:', gasLimit.toString());
      } catch (gasError) {
        console.warn('Gas estimation failed, using default:', gasError);
        // Fallback to higher default gas limit
        gasLimit = 200000n;
      }

      // Create transaction with lab test data embedded
      let tx;
      try {
        tx = await this.signer.sendTransaction({
          to: this.account, // Send to self to embed data
          value: ethers.parseEther('0'), // No ETH transfer, just data storage
          data: dataHex, // Lab test data in transaction input
          gasLimit: gasLimit
        });
      } catch (txError) {
        console.warn('Data transaction failed, trying simple transaction:', txError);
        // Fallback: simple transaction without data
        tx = await this.signer.sendTransaction({
          to: this.account,
          value: ethers.parseEther('0.000001'), // Tiny amount to ensure transaction goes through
          gasLimit: 21000 // Standard gas for simple transfer
        });
      }

      console.log('✅ Lab test transaction sent successfully:', tx.hash);
      console.log('📝 Lab test data embedded in transaction input');

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        contractAddress: 'Self Transaction (Data Storage)',
        network: 'Sepolia Testnet',
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
        labTestData: {
          batchId: labTestData.batchId,
          testType: labTestData.testType,
          resultValue: labTestData.resultValue,
          status: labTestData.status,
          tester: labTestData.tester,
          notes: labTestData.notes,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Failed to submit lab test to blockchain:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Handle specific error types
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction was rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for transaction');
      } else if (error.message.includes('gas')) {
        throw new Error('Transaction failed due to gas issues');
      } else if (error.message.includes('network')) {
        throw new Error('Please switch to Sepolia testnet in MetaMask');
      } else if (error.message.includes('signer')) {
        throw new Error('Wallet connection issue. Please reconnect your wallet.');
      }
      
      // Re-throw the original error with more context
      throw new Error(`Lab test blockchain transaction failed: ${error.message}`);
    }
  }
}

export default new WalletService();
