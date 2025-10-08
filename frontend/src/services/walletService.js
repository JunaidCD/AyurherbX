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
}

export default new WalletService();
