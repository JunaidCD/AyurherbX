import React, { createContext, useContext, useState, useEffect } from 'react';
import walletService from '../services/walletService';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize wallet state
    const initWallet = async () => {
      try {
        if (walletService.getIsConnected()) {
          setAccount(walletService.getAccount());
          setIsConnected(true);
          setChainId(walletService.getChainId());
          
          // Get balance
          const bal = await walletService.getBalance();
          setBalance(bal);
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      }
    };

    initWallet();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          updateBalance();
        }
      };

      const handleChainChanged = (newChainId) => {
        setChainId(newChainId);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const result = await walletService.connectWallet();
      
      if (result.success) {
        setAccount(result.account);
        setIsConnected(true);
        setChainId(result.chainId);
        
        // Get balance
        const bal = await walletService.getBalance();
        setBalance(bal);
        
        return result;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    walletService.disconnectWallet();
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setBalance('0');
    setError(null);
  };

  const updateBalance = async () => {
    try {
      const bal = await walletService.getBalance();
      setBalance(bal);
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const submitCollection = async (collectionData) => {
    try {
      setError(null);
      const result = await walletService.submitCollection(collectionData);
      
      // Update balance after transaction
      setTimeout(updateBalance, 2000);
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const getCollectorCollections = async (address = null) => {
    try {
      return await walletService.getCollectorCollections(address);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const getCollection = async (collectionId) => {
    try {
      return await walletService.getCollection(collectionId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const switchToSepolia = async () => {
    try {
      await walletService.switchToSepolia();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const formatAddress = (address) => {
    return walletService.formatAddress(address);
  };

  const isOnSepolia = () => {
    return walletService.isOnSepolia();
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    account,
    isConnected,
    isConnecting,
    chainId,
    balance,
    error,
    
    // Actions
    connectWallet,
    disconnectWallet,
    submitCollection,
    getCollectorCollections,
    getCollection,
    switchToSepolia,
    updateBalance,
    clearError,
    
    // Utilities
    formatAddress,
    isOnSepolia,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
