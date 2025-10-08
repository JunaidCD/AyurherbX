import React, { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

const WalletButton = ({ showToast }) => {
  const {
    account,
    isConnected,
    isConnecting,
    balance,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isOnSepolia,
    switchToSepolia,
    clearError
  } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      showToast?.('Wallet connected successfully!', 'success');
    } catch (error) {
      showToast?.(`Failed to connect wallet: ${error.message}`, 'error');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDropdown(false);
    showToast?.('Wallet disconnected', 'info');
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToSepolia();
      showToast?.('Switched to Sepolia testnet', 'success');
    } catch (error) {
      showToast?.(`Failed to switch network: ${error.message}`, 'error');
    }
  };

  const copyAddress = async () => {
    if (account) {
      setCopying(true);
      try {
        await navigator.clipboard.writeText(account);
        showToast?.('Address copied to clipboard', 'success');
      } catch (error) {
        showToast?.('Failed to copy address', 'error');
      }
      setTimeout(() => setCopying(false), 1000);
    }
  };

  const openEtherscan = () => {
    if (account) {
      window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl text-white font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-xl hover:shadow-emerald-500/30"
        >
          {isConnecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-6 h-6" />
              Connect Wallet
            </>
          )}
        </button>
        
        {error && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
            <button
              onClick={clearError}
              className="mt-2 text-xs text-red-200 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Network Warning */}
      {!isOnSepolia() && (
        <div className="absolute -top-12 left-0 right-0 mb-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Wrong network
            <button
              onClick={handleSwitchNetwork}
              className="ml-auto text-yellow-200 hover:text-white transition-colors underline"
            >
              Switch to Sepolia
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-2 border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              {isOnSepolia() && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900">
                  <CheckCircle className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">{formatAddress(account)}</div>
              <div className="text-xs text-gray-400">{parseFloat(balance).toFixed(4)} SEP</div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown Content */}
            <div className="absolute top-full right-0 mt-2 w-80 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-2 border-white/20 rounded-2xl shadow-2xl z-20 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Wallet Connected</div>
                    <div className="text-gray-400 text-sm">
                      {isOnSepolia() ? 'Sepolia Testnet' : 'Wrong Network'}
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Address</div>
                    <div className="flex items-center gap-2">
                      <code className="text-white text-sm font-mono bg-white/10 px-2 py-1 rounded">
                        {formatAddress(account)}
                      </code>
                      <button
                        onClick={copyAddress}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Copy address"
                      >
                        {copying ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                        )}
                      </button>
                      <button
                        onClick={openEtherscan}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="View on Etherscan"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-xs mb-1">Balance</div>
                    <div className="text-white font-bold">
                      {parseFloat(balance).toFixed(6)} SEP
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                {!isOnSepolia() && (
                  <button
                    onClick={handleSwitchNetwork}
                    className="w-full px-4 py-3 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-xl text-yellow-300 font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Switch to Sepolia
                  </button>
                )}
                
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl text-red-300 font-medium transition-all duration-300"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletButton;
