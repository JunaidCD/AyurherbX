/**
 * Mock Blockchain Utility
 * Provides mock blockchain functionality without requiring MetaMask
 */

// Mock blockchain configuration
const MOCK_BLOCKCHAIN_CONFIG = {
  chainId: '0x1', // Ethereum mainnet
  chainName: 'Ayurherb Mock Chain',
  rpcUrl: 'https://mock-blockchain.ayurherb.com',
  blockExplorer: 'https://mock-explorer.ayurherb.com'
};

/**
 * Generate mock transaction hash
 */
export const generateMockTxHash = () => {
  return '0x' + Array.from({length: 64}, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

/**
 * Generate mock block data
 */
export const generateMockBlock = () => ({
  blockNumber: Math.floor(Math.random() * 1000000) + 18500000,
  blockHash: generateMockTxHash(),
  timestamp: Math.floor(Date.now() / 1000),
  gasUsed: Math.floor(Math.random() * 50000) + 21000,
  gasPrice: Math.floor(Math.random() * 20) + 10 // Gwei
});

/**
 * Mock blockchain transaction
 */
export const mockBlockchainTransaction = async (data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const txHash = generateMockTxHash();
  const block = generateMockBlock();
  
  return {
    success: true,
    transactionHash: txHash,
    blockNumber: block.blockNumber,
    blockHash: block.blockHash,
    gasUsed: block.gasUsed,
    gasPrice: block.gasPrice,
    timestamp: block.timestamp,
    confirmations: Math.floor(Math.random() * 10) + 1,
    status: 'confirmed',
    data: data
  };
};

/**
 * Check if MetaMask is available (gracefully handle absence)
 */
export const isMetaMaskAvailable = () => {
  try {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask === true;
  } catch (error) {
    console.warn('MetaMask check failed:', error.message);
    return false;
  }
};

/**
 * Safe MetaMask connection (returns mock data if not available)
 */
export const safeConnectWallet = async () => {
  if (isMetaMaskAvailable()) {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return {
        success: true,
        account: accounts[0],
        provider: 'MetaMask'
      };
    } catch (error) {
      console.warn('MetaMask connection failed:', error.message);
    }
  }
  
  // Return mock wallet data
  return {
    success: true,
    account: '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
    provider: 'Mock Wallet',
    isMock: true
  };
};

/**
 * Error handler for blockchain operations
 */
export const handleBlockchainError = (error, operation = 'blockchain operation') => {
  console.warn(`${operation} failed:`, error.message);
  
  // Return user-friendly error message
  if (error.message.includes('MetaMask')) {
    return {
      success: false,
      error: 'Wallet connection not available. Using mock blockchain for demonstration.',
      isMockMode: true
    };
  }
  
  return {
    success: false,
    error: `${operation} failed: ${error.message}`,
    isMockMode: false
  };
};

/**
 * Initialize blockchain utilities
 */
export const initBlockchain = () => {
  // Suppress MetaMask-related console errors
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('MetaMask') || 
        message.includes('inpage.js') || 
        message.includes('ethereum')) {
      // Silently ignore MetaMask-related errors
      return;
    }
    originalError.apply(console, args);
  };
  
  console.log('🔗 Ayurherb Mock Blockchain initialized');
  console.log('📝 Using localStorage for data persistence');
  
  if (isMetaMaskAvailable()) {
    console.log('🦊 MetaMask detected - real wallet integration available');
  } else {
    console.log('🔧 MetaMask not detected - using mock wallet for demonstration');
  }
};

export default {
  generateMockTxHash,
  generateMockBlock,
  mockBlockchainTransaction,
  isMetaMaskAvailable,
  safeConnectWallet,
  handleBlockchainError,
  initBlockchain,
  config: MOCK_BLOCKCHAIN_CONFIG
};
