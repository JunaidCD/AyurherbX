import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Microscope, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  Save,
  Eye,
  Wallet,
  Beaker,
  Plus, RefreshCw, AlertCircle, FileText, Activity, Copy, X
} from 'lucide-react';
import { api } from '../../utils/api';
import walletService from '../../services/walletService';

const LabTest = ({ user, showToast = console.log }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loadedFromNavigation, setLoadedFromNavigation] = useState(false);
  
  // Test form state
  const [newTest, setNewTest] = useState({
    testType: '',
    resultValue: '',
    status: 'Passed',
    tester: user?.name || 'Dr. Sarah Wilson',
    notes: '',
    certificate: null
  });
  const [submittingTest, setSubmittingTest] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Wallet connection state
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState(null);

  useEffect(() => {
    // Check for selected batch FIRST, then clear old data
    const selectedFromNavigation = localStorage.getItem('selectedBatchForTesting');
    const currentSelected = localStorage.getItem('currentSelectedBatch');
    
    console.log('🚀 CHECKING BATCH DATA');
    console.log('🚀 selectedFromNavigation:', selectedFromNavigation);
    console.log('🚀 currentSelected:', currentSelected);
    
    if (selectedFromNavigation) {
      console.log('🚀 LOADING FROM NAVIGATION');
      checkForSelectedBatch();
    } else if (currentSelected) {
      console.log('🚀 LOADING FROM CURRENT SELECTED');
      try {
        const batchData = JSON.parse(currentSelected);
        setSelectedBatch(batchData);
        setLoadedFromNavigation(true);
        setLoading(false);
        setBatches([]);
      } catch (error) {
        console.error('Error restoring selected batch:', error);
        // Clear bad data and load empty state
        localStorage.removeItem('currentSelectedBatch');
        setSelectedBatch(null);
        loadBatches();
      }
    } else {
      console.log('🚀 NO BATCH DATA - SHOWING NO BATCH MESSAGE');
      // Clear any old data and ensure no batch is selected
      localStorage.removeItem('currentSelectedBatch');
      setSelectedBatch(null);
      setLoadedFromNavigation(false);
      loadBatches();
    }
    loadTestResults();
  }, []);

  // Real-time validation function
  const validateForm = () => {
    const errors = {};
    
    if (!newTest.testType) {
      errors.testType = 'Test Type is required';
    }
    if (!newTest.resultValue || newTest.resultValue.trim() === '') {
      errors.resultValue = 'Result Value is required';
    }
    if (!newTest.status) {
      errors.status = 'Test Status is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update validation when form changes
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      validateForm();
    }
  }, [newTest.testType, newTest.resultValue, newTest.status]);

  // Wallet connection functions
  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletError('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      showToast('MetaMask is not installed', 'error');
      return;
    }

    setIsConnecting(true);
    setWalletError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Switch to Sepolia network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia testnet chain ID
        });
      } catch (switchError) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            }],
          });
        } else {
          throw switchError;
        }
      }

      const address = accounts[0];
      setWalletAddress(address);
      showToast(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`, 'success');
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletError(error.message);
      showToast('Failed to connect wallet', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletError(null);
    showToast('Wallet disconnected', 'info');
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Check for selected batch from navigation
  const checkForSelectedBatch = () => {
    const selectedFromNavigation = localStorage.getItem('selectedBatchForTesting');
    if (selectedFromNavigation) {
      try {
        const batchData = JSON.parse(selectedFromNavigation);
        
        
        // Store in a different localStorage key to persist the selection
        localStorage.setItem('currentSelectedBatch', JSON.stringify(batchData));
        
        setSelectedBatch(batchData);
        setLoadedFromNavigation(true);
        localStorage.removeItem('selectedBatchForTesting');
        showToast(`Batch ${batchData.batchId} loaded for testing`, 'success');
        setLoading(false);
        
        // Load empty batches array to avoid any conflicts
        setBatches([]);
      } catch (error) {
        console.error('Error parsing selected batch data:', error);
        localStorage.removeItem('selectedBatchForTesting');
      }
    }
  };

  const loadBatchesWithoutSelection = async () => {
    try {
      console.log('📦 Loading batches without changing selection...');
      // Mock batches for testing - including BAT 2024 001
      const mockBatches = [
        {
          id: 'BAT 2024 001',
          batchId: 'BAT 2024 001',
          farmer: 'COL 2024',
          herb: 'Allovera',
          quantity: '5kg',
          location: 'Bangalore, Karnataka',
          harvestDate: '2024-09-24',
          status: 'Ready for Testing'
        },
        {
          id: 'COL001',
          batchId: 'BAT-2024-001',
          farmer: 'Rajesh Kumar',
          herb: 'Ashwagandha',
          quantity: '500kg',
          location: 'Kerala, India',
          harvestDate: '2024-09-20',
          status: 'Ready for Testing'
        },
        {
          id: 'COL002',
          batchId: 'BAT-2024-002',
          farmer: 'Priya Sharma',
          herb: 'Turmeric',
          quantity: '750kg',
          location: 'Tamil Nadu, India',
          harvestDate: '2024-09-21',
          status: 'Ready for Testing'
        },
        {
          id: 'COL003',
          batchId: 'BAT-2024-003',
          farmer: 'Amit Patel',
          herb: 'Brahmi',
          quantity: '300kg',
          location: 'Gujarat, India',
          harvestDate: '2024-09-19',
          status: 'Testing Complete'
        }
      ];
      
      setBatches(mockBatches);
      console.log('📦 Batches loaded, selectedBatch should remain unchanged');
      // Don't set selected batch here - keep the one from navigation
      
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  };

  const loadBatches = async () => {
    try {
      setLoading(true);
      
      // Mock batches for testing - including BAT 2024 001
      const mockBatches = [
        {
          id: 'BAT 2024 001',
          batchId: 'BAT 2024 001',
          farmer: 'COL 2024',
          herb: 'Allovera',
          quantity: '5kg',
          location: 'Bangalore, Karnataka',
          harvestDate: '2024-09-24',
          status: 'Ready for Testing'
        },
        {
          id: 'COL001',
          batchId: 'BAT-2024-001',
          farmer: 'Rajesh Kumar',
          herb: 'Ashwagandha',
          quantity: '500kg',
          location: 'Kerala, India',
          harvestDate: '2024-09-20',
          status: 'Ready for Testing'
        },
        {
          id: 'COL002',
          batchId: 'BAT-2024-002',
          farmer: 'Priya Sharma',
          herb: 'Turmeric',
          quantity: '750kg',
          location: 'Tamil Nadu, India',
          harvestDate: '2024-09-21',
          status: 'Ready for Testing'
        },
        {
          id: 'COL003',
          batchId: 'BAT-2024-003',
          farmer: 'Amit Patel',
          herb: 'Brahmi',
          quantity: '300kg',
          location: 'Gujarat, India',
          harvestDate: '2024-09-19',
          status: 'Testing Complete'
        }
      ];
      
      setBatches(mockBatches);
      
      // Don't automatically select any batch - let user choose or come from navigation
      // setSelectedBatch will remain null, showing "No Batch Loaded" message
      
    } catch (error) {
      console.error('Error loading batches:', error);
      showToast('Failed to load batches', 'error');
    } finally {
      setLoading(false);
    }
  };


  const loadTestResults = () => {
    const mockResults = [
      {
        id: 1,
        batchId: 'COL001',
        testType: 'Moisture Content',
        result: '8.5%',
        status: 'Passed',
        testDate: '2024-09-23',
        tester: 'Dr. Sarah Wilson',
        blockchainStatus: 'On-Chain Verified ✅',
        txId: '0x1a2b3c4d5e6f7890abcdef1234567890'
      },
      {
        id: 2,
        batchId: 'COL002',
        testType: 'Pesticide Screening',
        result: 'Not Detected',
        status: 'Passed',
        testDate: '2024-09-23',
        tester: 'Dr. Sarah Wilson',
        blockchainStatus: 'On-Chain Verified ✅',
        txId: '0x2b3c4d5e6f7890abcdef1234567890ab'
      },
      {
        id: 3,
        batchId: 'COL003',
        testType: 'DNA Authentication',
        result: 'Confirmed',
        status: 'Passed',
        testDate: '2024-09-22',
        tester: 'Dr. Mike Chen',
        blockchainStatus: 'On-Chain Verified ✅',
        txId: '0x3c4d5e6f7890abcdef1234567890abcd'
      }
    ];
    setTestResults(mockResults);
  };

  // Test type configurations
  const testTypes = [
    { 
      value: 'moisture', 
      label: 'Moisture Content', 
      unit: '%', 
      icon: '💧',
      description: 'Water content analysis',
      normalRange: '5-12%'
    },
    { 
      value: 'pesticide', 
      label: 'Pesticide Screening', 
      unit: 'ppm', 
      icon: '🧪',
      description: 'Chemical residue detection',
      normalRange: '<0.01 ppm'
    },
    { 
      value: 'dna', 
      label: 'DNA Barcode', 
      unit: '', 
      icon: '🧬',
      description: 'Species authentication',
      normalRange: 'Match confirmed'
    }
  ];

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Please upload PDF or image files only', 'error');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }

      setNewTest(prev => ({ ...prev, certificate: file }));
      showToast('Certificate uploaded successfully', 'success');
    }
  };

  // Submit new test to real blockchain using walletService
  const handleSubmitTest = async () => {
    try {
      // Enhanced Validation
      if (!selectedBatch) {
        showToast('Please select a batch first', 'error');
        return;
      }
      
      // Check wallet connection first
      if (!walletAddress) {
        showToast('Please connect your wallet before submitting lab test results', 'error');
        return;
      }
      
      // Validate form and show specific errors
      if (!validateForm()) {
        const missingFields = Object.keys(validationErrors).map(key => {
          switch(key) {
            case 'testType': return 'Test Type';
            case 'resultValue': return 'Result Value';
            case 'status': return 'Test Status';
            default: return key;
          }
        });
        showToast(`Please fill in the following required fields: ${missingFields.join(', ')}`, 'error');
        return;
      }

      setSubmittingTest(true);
      setUploadProgress(0);
      
      showToast('Preparing lab test data...', 'info');

      // Get selected test type details
      const selectedTestType = testTypes.find(t => t.value === newTest.testType);
      
      // Prepare lab test data for blockchain submission
      const labTestData = {
        batchId: selectedBatch.batchId,
        testType: selectedTestType.label,
        resultValue: newTest.resultValue,
        unit: selectedTestType.unit || '',
        status: newTest.status,
        tester: newTest.tester,
        notes: newTest.notes,
        certificateHash: newTest.certificate ? `cert_${Math.random().toString(16).substr(2, 16)}` : null
      };

      setUploadProgress(20);
      showToast('Opening MetaMask for transaction signing...', 'info');

      // Submit to real blockchain using walletService
      const blockchainResult = await walletService.submitLabTest(labTestData);
      
      setUploadProgress(80);
      showToast('Transaction confirmed! Finalizing...', 'success');

      setUploadProgress(100);

      // Store transaction details for modal
      setTransactionDetails({
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        network: blockchainResult.network,
        contractAddress: blockchainResult.contractAddress,
        batchId: selectedBatch.batchId,
        testType: selectedTestType.label,
        result: newTest.resultValue,
        status: newTest.status,
        tester: newTest.tester,
        batch: selectedBatch,
        explorerUrl: blockchainResult.explorerUrl
      });

      // Show transaction modal
      setShowTransactionModal(true);

      // Add to test results for UI display
      const newTestResult = {
        id: Date.now().toString(),
        batchId: selectedBatch.batchId,
        testType: selectedTestType.label,
        result: newTest.resultValue,
        status: newTest.status,
        testDate: new Date().toLocaleDateString(),
        tester: newTest.tester,
        blockchainStatus: 'On-Chain Verified ✅',
        txId: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        notes: newTest.notes
      };

      setTestResults(prev => [...prev, newTestResult]);
      
      // Save lab test result to localStorage for SeeItem page to detect
      const labTestsData = localStorage.getItem('ayurherb_lab_tests');
      const labTests = labTestsData ? JSON.parse(labTestsData) : {};
      
      const batchId = selectedBatch.batchId || selectedBatch.id;
      if (!labTests[batchId]) {
        labTests[batchId] = [];
      }
      
      labTests[batchId].push({
        id: newTestResult.id,
        testType: selectedTestType.label,
        resultValue: newTest.resultValue,
        unit: selectedTestType.unit || '',
        status: newTest.status,
        tester: newTest.tester,
        notes: newTest.notes,
        certificateHash: labTestData.certificateHash,
        testDate: new Date().toISOString(),
        blockchainTx: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        explorerUrl: blockchainResult.explorerUrl,
        batchId: batchId
      });
      
      localStorage.setItem('ayurherb_lab_tests', JSON.stringify(labTests));
      
      // Reset form
      setNewTest({
        testType: '',
        resultValue: '',
        status: 'Passed',
        tester: user?.name || 'Dr. Sarah Wilson',
        notes: '',
        certificate: null
      });

      console.log('=== REAL BLOCKCHAIN LAB TEST SAVED ===');
      console.log('Blockchain Result:', blockchainResult);
      console.log('Lab test saved to localStorage for batch:', batchId);

    } catch (error) {
      console.error('Blockchain submission error:', error);
      
      if (error.message.includes('rejected') || error.code === 4001) {
        showToast('❌ Transaction was rejected by user', 'error');
      } else if (error.message.includes('insufficient funds') || error.code === 'INSUFFICIENT_FUNDS') {
        showToast('❌ Insufficient funds for transaction. Please add some Sepolia ETH to your wallet.', 'error');
      } else if (error.message.includes('gas') || error.message.includes('Gas')) {
        showToast('❌ Gas estimation failed. Please try again or reduce the size of your notes.', 'error');
      } else if (error.message.includes('network') || error.message.includes('chain')) {
        showToast('❌ Please switch to Sepolia testnet in MetaMask', 'error');
      } else if (error.message.includes('wallet') || error.message.includes('signer')) {
        showToast('❌ Wallet connection issue. Please reconnect your wallet.', 'error');
      } else if (error.message.includes('Internal JSON-RPC error')) {
        showToast('❌ Network error. Please check your internet connection and try again.', 'error');
      } else {
        showToast('❌ Failed to save test on blockchain: ' + error.message, 'error');
      }
    } finally {
      setSubmittingTest(false);
      setUploadProgress(0);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Passed</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">Pending</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Lab Test Center
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Quality testing with blockchain verification
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Lab Active</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connect Wallet Button */}
            <div className="flex items-center gap-4">
              {walletAddress ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-300 text-sm font-medium">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl text-red-300 hover:text-red-200 transition-all duration-200 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 hover:from-blue-500/30 hover:to-emerald-500/30 border border-blue-500/30 hover:border-emerald-500/50 rounded-xl text-white font-semibold transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Add Quality Test Form */}
      {selectedBatch ? (
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Microscope className="w-8 h-8 text-emerald-400" />
                <h2 className="text-3xl font-bold text-white">Add Quality Test</h2>
                <div className="text-gray-400">for {selectedBatch.herb || 'N/A'} ({selectedBatch.batchId || 'N/A'})</div>
              </div>
              
              {/* Batch Information Display */}
              {selectedBatch && (
                <div className="mb-8 p-6 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Batch ID</p>
                      <p className="text-emerald-300 font-bold">{selectedBatch.batchId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Herb Type</p>
                      <p className="text-blue-300 font-bold">{selectedBatch.herb || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Quantity</p>
                      <p className="text-purple-300 font-bold">{selectedBatch.quantity || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Location</p>
                      <p className="text-cyan-300 font-bold">{selectedBatch.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            
              <div className="space-y-8">
              {/* Test Type Selection */}
              <div>
                <label className="block text-lg font-medium text-gray-300 mb-4">
                  Test Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {testTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewTest(prev => ({ ...prev, testType: type.value }))}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                        newTest.testType === type.value
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{type.icon}</span>
                        <span className="text-white font-semibold text-lg">{type.label}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{type.description}</p>
                      <p className="text-blue-400 text-xs">Normal: {type.normalRange}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Value & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-3">
                    Result Value <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newTest.resultValue}
                      onChange={(e) => setNewTest(prev => ({ ...prev, resultValue: e.target.value }))}
                      placeholder="Enter result value"
                      className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-200 text-lg"
                    />
                    {newTest.testType && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        {testTypes.find(t => t.value === newTest.testType)?.unit}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-3">
                    Test Status <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setNewTest(prev => ({ ...prev, status: 'Passed' }))}
                      className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 ${
                        newTest.status === 'Passed'
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-slate-600 bg-slate-700/30 text-gray-400 hover:border-slate-500'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Pass
                    </button>
                    <button
                      onClick={() => setNewTest(prev => ({ ...prev, status: 'Failed' }))}
                      className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 ${
                        newTest.status === 'Failed'
                          ? 'border-red-500 bg-red-500/20 text-red-300'
                          : 'border-slate-600 bg-slate-700/30 text-gray-400 hover:border-slate-500'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      Fail
                    </button>
                  </div>
                </div>
              </div>

              {/* Tester */}
              <div>
                <label className="block text-lg font-medium text-gray-300 mb-3">
                  Tester
                </label>
                <input
                  type="text"
                  value={newTest.tester}
                  onChange={(e) => setNewTest(prev => ({ ...prev, tester: e.target.value }))}
                  className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-200 text-lg"
                />
              </div>

              {/* Certificate Upload */}
              <div>
                <label className="block text-lg font-medium text-gray-300 mb-3">
                  Test Certificate (PDF/Image)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="certificate-upload"
                  />
                  <label
                    htmlFor="certificate-upload"
                    className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-emerald-500 transition-all duration-200 bg-slate-700/20"
                  >
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      {newTest.certificate ? (
                        <div>
                          <p className="text-emerald-400 font-medium text-lg">{newTest.certificate.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(newTest.certificate.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-300 text-lg">Click to upload certificate</p>
                          <p className="text-gray-400 text-sm">PDF, JPG, PNG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-lg font-medium text-gray-300 mb-3">
                  Notes (Optional)
                </label>
                <textarea
                  value={newTest.notes}
                  onChange={(e) => setNewTest(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the test..."
                  rows={4}
                  className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-200 resize-none text-lg"
                />
              </div>

              {/* Progress Bar */}
              {submittingTest && (
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TestTube className="w-6 h-6 text-blue-400 animate-pulse" />
                    <span className="text-white font-medium text-lg">Processing Test & Blockchain Verification...</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{uploadProgress}% Complete</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitTest}
                disabled={submittingTest || !newTest.testType || !newTest.resultValue || !newTest.resultValue.trim() || !newTest.status || !walletAddress}
                className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submittingTest ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Save Test & Verify on Blockchain
                  </>
                )}
              </button>
              
              {/* Wallet Connection Requirement Notice */}
              {!walletAddress && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-amber-300 font-semibold">Wallet Connection Required</p>
                      <p className="text-amber-200 text-sm">Connect your wallet to submit lab test results to the blockchain</p>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-12">
              <div className="text-center">
                <TestTube className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">No Batch Loaded</h3>
                <p className="text-gray-400 text-lg mb-6">
                  Please add a batch first before starting lab tests.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <span className="text-amber-400 font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-amber-300 font-semibold">Action Required</p>
                      <p className="text-amber-200 text-sm">Navigate to "See Items" and click "Add Lab Test" on a processed batch</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionModal && transactionDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-blue-500/50 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-8">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">✅ Test Saved on Blockchain!</h3>
                    <p className="text-gray-400">Transaction confirmed on {transactionDetails.network || 'Sepolia Testnet'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Transaction Details */}
              <div className="space-y-6">
                {/* Test Information */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Test Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Batch ID:</span>
                      <span className="text-white font-medium ml-2">{transactionDetails.batchId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Test Type:</span>
                      <span className="text-white font-medium ml-2">{transactionDetails.testType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Result:</span>
                      <span className="text-white font-medium ml-2">{transactionDetails.result}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-medium ml-2 ${transactionDetails.status === 'Passed' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {transactionDetails.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Tester:</span>
                      <span className="text-white font-medium ml-2">{transactionDetails.tester}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Herb Type:</span>
                      <span className="text-white font-medium ml-2">{transactionDetails.batch?.herbType}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Details */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-emerald-300 mb-3">🔗 Blockchain Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Transaction Hash:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-300 font-mono text-sm">
                          {transactionDetails.transactionHash.substr(0, 20)}...
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(transactionDetails.transactionHash)}
                          className="p-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Block Number:</span>
                      <span className="text-white font-medium">{transactionDetails.blockNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Gas Used:</span>
                      <span className="text-white font-medium">{transactionDetails.gasUsed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-blue-400 font-medium">{transactionDetails.network}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Contract:</span>
                      <span className="text-gray-300 font-mono text-sm">
                        {transactionDetails.contractAddress.substr(0, 10)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div className="text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="text-emerald-300 font-medium">
                    🎉 Your lab test data has been permanently recorded on the blockchain!
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    This transaction provides immutable proof of your test results and cannot be altered.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(transactionDetails.transactionHash)}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Transaction Hash
                  </button>
                  {transactionDetails.explorerUrl && (
                    <button
                      onClick={() => window.open(transactionDetails.explorerUrl, '_blank')}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View on Etherscan
                    </button>
                  )}
                  <button
                    onClick={() => setShowTransactionModal(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTest;
