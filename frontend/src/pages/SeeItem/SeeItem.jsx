import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TestTube, AlertCircle, Eye, Sparkles, Download, Calendar, BarChart3, CheckCircle, Clock, Leaf, Shield, Database, Thermometer, Settings, Factory, Award, X } from 'lucide-react';
import { useCollections } from '../../contexts/CollectionsContext';
import { useWallet } from '../../contexts/WalletContext';
import WalletButton from '../../components/WalletButton/WalletButton';

const SeeItem = ({ user, showToast }) => {
  const [processedBatches, setProcessedBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationModal, setVerificationModal] = useState({ isOpen: false, batch: null });
  const [verificationChecks, setVerificationChecks] = useState({ quality: false, purity: false, authenticity: false });
  const [isVerifying, setIsVerifying] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, txHash: null });
  const { collections } = useCollections();
  const { isConnected, submitToBlockchain, connectWallet } = useWallet();
  const navigate = useNavigate();

  // Check if user is Admin
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    loadProcessedBatches();
  }, [collections]);

  const loadProcessedBatches = () => {
    try {
      // Get processing steps from localStorage
      const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
      const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
      
      // Get lab test results from localStorage
      const labTestsData = localStorage.getItem('ayurherb_lab_tests');
      const labTests = labTestsData ? JSON.parse(labTestsData) : {};
      
      // Get verification data from localStorage
      const verificationsData = localStorage.getItem('ayurherb_verifications');
      const verifications = verificationsData ? JSON.parse(verificationsData) : {};
      
      // Get collections from context or localStorage as fallback
      let collectionsData = collections;
      if (!collectionsData || collectionsData.length === 0) {
        const storedCollections = localStorage.getItem('ayurherb_collections');
        collectionsData = storedCollections ? JSON.parse(storedCollections) : [];
      }
      
      // Combine processing steps with collection data
      const processedData = [];
      
      Object.keys(processingSteps).forEach(batchId => {
        const steps = processingSteps[batchId];
        if (steps.length > 0) {
          // Find matching collection
          const collection = collectionsData.find(c => 
            c.batchId === batchId || c.id === batchId
          );
          
          // Check if lab test has been completed for this batch
          const hasLabTest = labTests[batchId] && labTests[batchId].length > 0;
          
          // Check if verification has been completed for this batch
          const isVerified = verifications[batchId] && verifications[batchId].verified;
          
          // Only add if we have valid collection data
          if (collection && collection.herbName) {
            processedData.push({
              batchId,
              collection,
              processingSteps: steps,
              totalSteps: steps.length,
              lastProcessed: steps[steps.length - 1]?.timestamp || steps[steps.length - 1]?.date,
              onChainVerified: steps.some(step => step.blockchain?.confirmed),
              hasLabTest: hasLabTest,
              labTests: labTests[batchId] || [],
              isVerified: isVerified,
              verificationData: verifications[batchId] || null
            });
          }
        }
      });
      
      setProcessedBatches(processedData);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading processed batches:', error);
      setLoading(false);
    }
  };

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'Drying': return Thermometer;
      case 'Grinding': return Settings;
      case 'Storage': return Package;
      case 'Quality Check': return CheckCircle;
      case 'Packaging': return Package;
      case 'Cleaning': return Shield;
      default: return Factory;
    }
  };

  // CSV Export Function for BAT 2024 001
  // Handle Add Lab Test navigation
  const handleAddLabTest = (batch) => {
    // Store the selected batch data in localStorage for LabTest to access
    const batchForTesting = {
      id: batch.batchId,
      batchId: batch.batchId,
      farmer: batch.collection?.collector || batch.collection?.collectorId || 'Unknown',
      herb: batch.collection?.herbName || 'Unknown Herb',
      quantity: batch.collection?.quantity || 'N/A',
      location: batch.collection?.location || 'N/A',
      harvestDate: batch.collection?.harvestDate || batch.collection?.submissionDate || 'N/A',
      status: 'Ready for Testing',
      processingSteps: batch.processingSteps,
      totalSteps: batch.totalSteps,
      onChainVerified: batch.onChainVerified
    };
    
    localStorage.setItem('selectedBatchForTesting', JSON.stringify(batchForTesting));
    
    // Navigate to lab test page
    navigate('/lab-test');
  };

  // Handle verification modal
  const handleVerifyClick = (batch) => {
    if (!isAdmin) {
      showToast && showToast('Access denied. Admin privileges required.', 'error');
      return;
    }
    setVerificationModal({ isOpen: true, batch });
    setVerificationChecks({ quality: false, purity: false, authenticity: false });
  };

  const handleVerificationSubmit = async () => {
    const { batch } = verificationModal;
    const allChecked = Object.values(verificationChecks).every(check => check);
    
    if (!allChecked) {
      showToast && showToast('Please complete all verification checks before proceeding.', 'warning');
      return;
    }

    if (!isConnected) {
      showToast && showToast('Please connect your wallet to verify on blockchain.', 'warning');
      try {
        await connectWallet();
      } catch (error) {
        showToast && showToast('Failed to connect wallet. Please try again.', 'error');
        return;
      }
    }

    setIsVerifying(true);
    
    try {
      const verificationData = {
        batchId: batch.batchId,
        herbName: batch.collection?.herbName,
        verificationChecks,
        verifiedBy: user?.name || user?.email || 'Admin',
        verificationDate: new Date().toISOString(),
        adminAddress: user?.walletAddress || 'Admin',
        verificationStatus: 'VERIFIED',
        qualityCheck: verificationChecks.quality,
        purityCheck: verificationChecks.purity,
        authenticityCheck: verificationChecks.authenticity
      };

      const result = await submitToBlockchain(verificationData);
      
      if (result.success) {
        // Store verification in localStorage
        const existingVerifications = JSON.parse(localStorage.getItem('ayurherb_verifications') || '{}');
        existingVerifications[batch.batchId] = {
          ...verificationData,
          blockchain: result.blockchain,
          txHash: result.blockchain?.transactionHash,
          blockNumber: result.blockchain?.blockNumber,
          verified: true,
          verifiedAt: new Date().toISOString()
        };
        localStorage.setItem('ayurherb_verifications', JSON.stringify(existingVerifications));
        
        setVerificationModal({ isOpen: false, batch: null });
        setSuccessModal({ isOpen: true, txHash: result.blockchain?.transactionHash });
        
        // Refresh the data
        loadProcessedBatches();
        
        showToast && showToast('Herb verification completed successfully!', 'success');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      showToast && showToast('Verification failed. Please try again.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadBatchCSV = () => {
    const batchData = {
      batchId: 'BAT 2024 001',
      testType: 'Pesticide Screening',
      result: '2ppm',
      status: 'Passed',
      technician: 'Junaid',
      herbType: 'Allovera',
      date: '9/25/2025',
      farmerId: 'FARM001',
      farmerName: 'Rajesh Kumar',
      originLocation: 'Kerala, India',
      harvestDate: '2024-01-15',
      quantity: '5.0 kg',
      qualityGrade: 'Premium',
      blockchainTx: '0x8bf3c3a9914b126481ece5ed7c4215febd9e1414083ed8ea359453f7308dc0ee',
      blockNumber: '15',
      gasUsed: '1583987',
      network: 'Hyperledger Besu',
      contractAddress: '0x4f6B416f62f3B88E3179Afa5f8611CdEb4C22eF3'
    };

    // Prepare CSV data
    const csvData = [
      ['Field', 'Value'],
      ['Batch ID', batchData.batchId],
      ['Test Type', batchData.testType],
      ['Test Result', batchData.result],
      ['Test Status', batchData.status],
      ['Technician', batchData.technician],
      ['Herb Type', batchData.herbType],
      ['Test Date', batchData.date],
      ['Farmer ID', batchData.farmerId],
      ['Farmer Name', batchData.farmerName],
      ['Origin Location', batchData.originLocation],
      ['Harvest Date', batchData.harvestDate],
      ['Quantity', batchData.quantity],
      ['Quality Grade', batchData.qualityGrade],
      ['Blockchain Network', batchData.network],
      ['Transaction Hash', batchData.blockchainTx],
      ['Block Number', batchData.blockNumber],
      ['Gas Used', batchData.gasUsed],
      ['Contract Address', batchData.contractAddress],
      ['Export Date', new Date().toLocaleString()],
      ['Export Time', new Date().toISOString()]
    ];

    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${batchData.batchId}_complete_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent mb-2">
                See Item
              </h1>
              <p className="text-xl text-gray-300 font-light">
                View tested items and lab results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-gray-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-12">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-gray-300">Loading tested items...</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Processed Items Ready for Testing</h2>
            <p className="text-gray-400">Items that have completed processing and are ready for lab testing</p>
          </div>

          {/* Processed Batches */}
          {processedBatches.length > 0 ? (
            <div className="space-y-6">
              {processedBatches.map((batch, index) => {
                const collection = batch.collection;
                return (
                  <div key={batch.batchId} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300">
                      
                      {/* Batch Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                          <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                              <Leaf className="w-10 h-10 text-white" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent mb-1">
                                {collection?.herbName || 'Unknown Herb'}
                              </h3>
                              <p className="text-lg text-purple-300 font-medium">Premium Quality Herb</p>
                            </div>
                            <div className="flex items-center gap-6 text-gray-300">
                              <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                                <Package className="w-4 h-4 text-purple-400" />
                                <span className="font-semibold">{collection?.quantity || 'N/A'}</span>
                              </span>
                              <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                <span className="font-semibold">{collection?.location || 'N/A'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex flex-wrap gap-2 justify-end">
                            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-xl backdrop-blur-sm">
                              <Shield className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-300 text-sm font-bold">
                                {batch.totalSteps} Step{batch.totalSteps !== 1 ? 's' : ''}
                              </span>
                            </div>
                            {batch.onChainVerified && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-xl backdrop-blur-sm">
                                <Database className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-300 text-sm font-bold">On-Chain</span>
                              </div>
                            )}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${
                              batch.hasLabTest 
                                ? 'bg-green-500/20 border border-green-500/40' 
                                : 'bg-emerald-500/20 border border-emerald-500/40'
                            }`}>
                              {batch.hasLabTest ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="text-green-300 text-sm font-bold">Test Completed</span>
                                </>
                              ) : (
                                <>
                                  <TestTube className="w-4 h-4 text-emerald-400" />
                                  <span className="text-emerald-300 text-sm font-bold">Ready for Testing</span>
                                </>
                              )}
                            </div>
                            {batch.isVerified && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-xl backdrop-blur-sm">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-300 text-sm font-bold">Admin Verified</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-3">
                            {/* Lab Test Button - Dynamic based on test status */}
                            {batch.hasLabTest ? (
                              <div className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold rounded-xl cursor-default opacity-90">
                                <div className="relative flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5" />
                                  <span>Test Done</span>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleAddLabTest(batch)}
                                className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-2">
                                  <TestTube className="w-5 h-5" />
                                  <span>Add Lab Test</span>
                                </div>
                              </button>
                            )}
                            
                            {/* Admin Verification Button */}
                            {isAdmin && (
                              batch.isVerified ? (
                                <div className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white font-bold rounded-xl cursor-default opacity-90">
                                  <div className="relative flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    <span>Verified</span>
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleVerifyClick(batch)}
                                  className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <div className="relative flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    <span>Verify</span>
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Collection Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="group relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-purple-500/40 transition-all duration-300">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Batch ID</p>
                            <p className="text-purple-400 font-black text-lg">{batch.batchId}</p>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-emerald-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-blue-500/40 transition-all duration-300">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Collector</p>
                            <p className="text-blue-400 font-black text-lg">{collection?.collector || collection?.collectorId || 'Junaid'}</p>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-emerald-500/40 transition-all duration-300">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Last Processed</p>
                            <p className="text-emerald-400 font-black text-lg">{batch.lastProcessed || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-teal-500/40 transition-all duration-300">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Status</p>
                            <p className="text-teal-400 font-black text-lg">Ready for Lab</p>
                          </div>
                        </div>
                      </div>

                      {/* Processing Steps */}
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
                          <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                            <h4 className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl blur opacity-60"></div>
                                <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                                  <Factory className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              Completed Processing Steps
                            </h4>
                            <p className="text-purple-300 font-medium">All processing stages completed and verified</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {batch.processingSteps.map((step, stepIndex) => {
                            const StepIcon = getStepIcon(step.stepType);
                            return (
                              <div key={stepIndex} className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-white/12 to-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-purple-500/50 transition-all duration-300 shadow-xl transform group-hover:scale-105">
                                  <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                      <div className="relative group">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                                        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-all duration-300">
                                          <StepIcon className="w-7 h-7 text-white" />
                                        </div>
                                      </div>
                                      <div>
                                        <h5 className="text-xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-1">{step.stepType}</h5>
                                        <p className="text-purple-300 text-sm font-semibold">{step.timestamp || step.date}</p>
                                      </div>
                                    </div>
                                    {step.blockchain?.confirmed && (
                                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/40 rounded-xl backdrop-blur-sm">
                                        <Shield className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-400 text-xs font-bold">On-Chain</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {step.temperature && (
                                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl backdrop-blur-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                          <Thermometer className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-orange-300 text-xs font-bold uppercase tracking-wide">Temperature</p>
                                          <p className="text-white font-bold">{step.temperature}</p>
                                        </div>
                                      </div>
                                    )}
                                    {step.duration && (
                                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl backdrop-blur-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                          <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-blue-300 text-xs font-bold uppercase tracking-wide">Duration</p>
                                          <p className="text-white font-bold">{step.duration}</p>
                                        </div>
                                      </div>
                                    )}
                                    {step.notes && (
                                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/30 rounded-xl backdrop-blur-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center mt-0.5">
                                          <AlertCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-300 text-xs font-bold uppercase tracking-wide mb-1">Notes</p>
                                          <p className="text-white font-medium leading-relaxed">{step.notes}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-600/20 border-2 border-purple-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                    <TestTube className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  No Processed Items Available
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Processed items from the processor will appear here ready for lab testing.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Verification Modal */}
      {verificationModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-2xl w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-amber-500/30 to-orange-500/30 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-8">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-2xl blur-lg opacity-60"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                      Admin Verification
                    </h3>
                    <p className="text-yellow-300 font-medium">
                      {verificationModal.batch?.collection?.herbName || 'Unknown Herb'} - {verificationModal.batch?.batchId}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setVerificationModal({ isOpen: false, batch: null })}
                  className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </div>

              {/* Verification Checks */}
              <div className="space-y-6 mb-8">
                <h4 className="text-xl font-bold text-white mb-4">Complete all verification checks:</h4>
                
                {/* Quality Check */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/40 transition-all duration-300">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={verificationChecks.quality}
                          onChange={(e) => setVerificationChecks(prev => ({ ...prev, quality: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          verificationChecks.quality 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-400 hover:border-green-400'
                        }`}>
                          {verificationChecks.quality && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-white mb-1">Quality Verification</h5>
                        <p className="text-gray-300 text-sm">Confirm that the herb meets quality standards and specifications</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Purity Check */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-500/40 transition-all duration-300">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={verificationChecks.purity}
                          onChange={(e) => setVerificationChecks(prev => ({ ...prev, purity: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          verificationChecks.purity 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400 hover:border-blue-400'
                        }`}>
                          {verificationChecks.purity && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-white mb-1">Purity Verification</h5>
                        <p className="text-gray-300 text-sm">Verify that the herb is free from contaminants and adulterants</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Authenticity Check */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-500/40 transition-all duration-300">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={verificationChecks.authenticity}
                          onChange={(e) => setVerificationChecks(prev => ({ ...prev, authenticity: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          verificationChecks.authenticity 
                            ? 'bg-purple-500 border-purple-500' 
                            : 'border-gray-400 hover:border-purple-400'
                        }`}>
                          {verificationChecks.authenticity && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-white mb-1">Authenticity Verification</h5>
                        <p className="text-gray-300 text-sm">Confirm the herb's identity and origin authenticity</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Wallet Connection Status */}
              {!isConnected && (
                <div className="mb-6 p-4 bg-orange-500/20 border border-orange-500/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-orange-300 font-medium">Wallet Connection Required</p>
                      <p className="text-orange-200 text-sm">Connect your wallet to verify on Sepolia blockchain</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <WalletButton />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setVerificationModal({ isOpen: false, batch: null })}
                  className="flex-1 px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 border border-gray-500/50 rounded-xl text-white font-medium transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleVerificationSubmit}
                  disabled={isVerifying || !Object.values(verificationChecks).every(check => check)}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    isVerifying || !Object.values(verificationChecks).every(check => check)
                      ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105'
                  }`}>
                  {isVerifying ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <Shield className="w-5 h-5" />
                      <span>Verify on Blockchain</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-lg w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 text-center">
              
              {/* Success Icon */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Success Message */}
              <h3 className="text-3xl font-black bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent mb-4">
                Verification Confirmed!
              </h3>
              <p className="text-green-300 font-medium mb-6">
                The herb has been successfully verified and recorded on the Sepolia blockchain.
              </p>

              {/* Transaction Details */}
              {successModal.txHash && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl">
                  <p className="text-green-300 text-sm font-medium mb-2">Transaction Hash:</p>
                  <p className="text-white text-xs font-mono break-all">{successModal.txHash}</p>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${successModal.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-500/30 hover:bg-green-500/40 border border-green-500/50 rounded-lg text-green-300 text-sm font-medium transition-all duration-300"
                  >
                    <Database className="w-4 h-4" />
                    View on Etherscan
                  </a>
                </div>
              )}

              {/* Close Button */}
              <button 
                onClick={() => setSuccessModal({ isOpen: false, txHash: null })}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25 transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeItem;
