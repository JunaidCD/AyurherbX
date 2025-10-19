import React, { useState } from 'react';
import { Shield, Search, CheckCircle, Beaker, Package, Leaf, MapPin, Calendar, Factory, XCircle, Clock, Copy, Database, Award, X, AlertCircle, Download } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import WalletButton from '../../components/WalletButton/WalletButton';
import jsPDF from 'jspdf';

const VerificationReport = ({ user, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationModal, setVerificationModal] = useState({ isOpen: false, herb: null });
  const [verificationChecks, setVerificationChecks] = useState({ quality: false, purity: false, authenticity: false });
  const [isVerifying, setIsVerifying] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, txHash: null });
  const { isConnected, submitToBlockchain, connectWallet } = useWallet();

  // Check if user is Admin
  const isAdmin = user?.role === 'Admin';

  // Generate herb ID (same logic as SeeItems page)
  const generateHerbId = (herbName) => {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    return `${herbName?.toUpperCase().slice(0, 3) || 'HRB'}-${randomNumber}`;
  };

  // Load herb data from localStorage (same as SeeItems page)
  const loadHerbData = () => {
    try {
      const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
      const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
      
      const labTestsData = localStorage.getItem('ayurherb_lab_tests');
      const labTests = labTestsData ? JSON.parse(labTestsData) : {};
      
      // Get verification data from localStorage
      const verificationsData = localStorage.getItem('ayurherb_verifications');
      const verifications = verificationsData ? JSON.parse(verificationsData) : {};
      
      const storedCollections = localStorage.getItem('ayurherb_collections');
      const collectionsData = storedCollections ? JSON.parse(storedCollections) : [];

      // Create comprehensive herb data with IDs
      const herbData = collectionsData.map(collection => {
        const batchId = collection.batchId || collection.id;
        const processing = processingSteps[batchId] || [];
        const tests = labTests[batchId] || [];
        
        // Check if verification has been completed for this batch
        const isVerified = verifications[batchId] && verifications[batchId].verified;
        
        return {
          ...collection,
          batchId,
          herbId: generateHerbId(collection.herbName),
          processingSteps: processing,
          labTests: tests,
          hasProcessing: processing.length > 0,
          hasTesting: tests.length > 0,
          isVerified: isVerified,
          verificationData: verifications[batchId] || null,
          status: tests.length > 0 ? 'tested' : processing.length > 0 ? 'processed' : 'collected'
        };
      });

      return herbData;
    } catch (error) {
      console.error('Error loading herb data:', error);
      return [];
    }
  };

  // Search herb by ID
  const searchHerbById = (herbId) => {
    const allHerbs = loadHerbData();
    const herbPrefix = herbId.split('-')[0];
    const matchingHerb = allHerbs.find(herb => 
      herb.herbName?.toUpperCase().slice(0, 3) === herbPrefix
    );
    
    if (matchingHerb) {
      matchingHerb.herbId = herbId;
      return matchingHerb;
    }
    return null;
  };

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`ID copied to clipboard: ${text}`, 'success');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`ID copied to clipboard: ${text}`, 'success');
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      showToast('Please enter a herb ID to search', 'warning');
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const herb = searchHerbById(searchQuery.trim());
      if (herb) {
        setSearchResults(herb);
        showToast(`Herb ${searchQuery} found successfully!`, 'success');
      } else {
        setSearchResults(null);
        showToast(`Herb ID ${searchQuery} not found`, 'error');
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle verification modal
  const handleVerifyClick = (herb) => {
    if (!isAdmin) {
      showToast && showToast('Access denied. Admin privileges required.', 'error');
      return;
    }
    setVerificationModal({ isOpen: true, herb });
    setVerificationChecks({ quality: false, purity: false, authenticity: false });
  };

  const handleVerificationSubmit = async () => {
    const { herb } = verificationModal;
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
        batchId: herb.batchId,
        herbName: herb.herbName,
        herbId: herb.herbId,
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
        existingVerifications[herb.batchId] = {
          ...verificationData,
          blockchain: result.blockchain,
          txHash: result.blockchain?.transactionHash,
          blockNumber: result.blockchain?.blockNumber,
          verified: true,
          verifiedAt: new Date().toISOString()
        };
        localStorage.setItem('ayurherb_verifications', JSON.stringify(existingVerifications));
        
        // Update search results with verification status
        setSearchResults(prev => ({
          ...prev,
          isVerified: true,
          verificationData: existingVerifications[herb.batchId]
        }));
        
        setVerificationModal({ isOpen: false, herb: null });
        setSuccessModal({ isOpen: true, txHash: result.blockchain?.transactionHash });
        
        showToast && showToast('Herb verification completed successfully!', 'success');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      showToast && showToast('Verification failed. Please try again.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate comprehensive PDF report
  const generatePDFReport = (herb) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;
    
    // Helper function to add text with word wrapping
    const addText = (text, x, y, maxWidth = pageWidth - 20, fontSize = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * (fontSize * 0.5));
    };
    
    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = 30) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    };
    
    try {
      // Header
      pdf.setFillColor(34, 197, 94); // Emerald color
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AyurHerb Supply Chain Report', pageWidth / 2, 25, { align: 'center' });
      
      yPosition = 50;
      pdf.setTextColor(0, 0, 0);
      
      // Herb Basic Information
      pdf.setFillColor(240, 240, 240);
      pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HERB INFORMATION', 15, yPosition + 6);
      yPosition += 15;
      
      pdf.setFont('helvetica', 'normal');
      yPosition = addText(`Herb Name: ${herb.herbName || 'N/A'}`, 15, yPosition, pageWidth - 30, 12);
      yPosition = addText(`Unique ID: ${herb.herbId || 'N/A'}`, 15, yPosition + 5, pageWidth - 30, 12);
      yPosition = addText(`Batch ID: ${herb.batchId || 'N/A'}`, 15, yPosition + 5, pageWidth - 30, 12);
      yPosition = addText(`Quantity: ${herb.quantity || 'N/A'}`, 15, yPosition + 5, pageWidth - 30, 12);
      yPosition = addText(`Location: ${herb.location || 'N/A'}`, 15, yPosition + 5, pageWidth - 30, 12);
      yPosition = addText(`Collector: ${herb.collector || herb.collectorId || 'N/A'}`, 15, yPosition + 5, pageWidth - 30, 12);
      yPosition = addText(`Status: ${herb.status ? herb.status.charAt(0).toUpperCase() + herb.status.slice(1) : 'N/A'}`, 15, yPosition + 5, pageWidth - 30, 12);
      yPosition = addText(`Collection Date: ${herb.harvestDate || herb.submissionDate || new Date().toLocaleDateString()}`, 15, yPosition + 5, pageWidth - 30, 12);
      
      // Verification Status
      if (herb.isVerified) {
        yPosition += 10;
        pdf.setFillColor(255, 193, 7); // Yellow color
        pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('✓ ADMIN VERIFIED', 15, yPosition + 6);
        yPosition += 15;
        
        if (herb.verificationData) {
          pdf.setFont('helvetica', 'normal');
          yPosition = addText(`Verified By: ${herb.verificationData.verifiedBy || 'Admin'}`, 15, yPosition, pageWidth - 30, 10);
          yPosition = addText(`Verification Date: ${new Date(herb.verificationData.verificationDate).toLocaleString()}`, 15, yPosition + 3, pageWidth - 30, 10);
          yPosition = addText(`Quality Check: ${herb.verificationData.qualityCheck ? '✓ Passed' : '✗ Not Verified'}`, 15, yPosition + 3, pageWidth - 30, 10);
          yPosition = addText(`Purity Check: ${herb.verificationData.purityCheck ? '✓ Passed' : '✗ Not Verified'}`, 15, yPosition + 3, pageWidth - 30, 10);
          yPosition = addText(`Authenticity Check: ${herb.verificationData.authenticityCheck ? '✓ Passed' : '✗ Not Verified'}`, 15, yPosition + 3, pageWidth - 30, 10);
          
          if (herb.verificationData.txHash) {
            yPosition = addText(`Blockchain TX: ${herb.verificationData.txHash}`, 15, yPosition + 3, pageWidth - 30, 8);
          }
        }
      }
      
      yPosition += 15;
      checkNewPage(50);
      
      // Processing Steps
      if (herb.processingSteps && herb.processingSteps.length > 0) {
        pdf.setFillColor(59, 130, 246); // Blue color
        pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`PROCESSING STEPS (${herb.processingSteps.length})`, 15, yPosition + 6);
        yPosition += 15;
        pdf.setTextColor(0, 0, 0);
        
        herb.processingSteps.forEach((step, index) => {
          checkNewPage(40);
          
          pdf.setFillColor(245, 245, 245);
          pdf.rect(15, yPosition, pageWidth - 30, 6, 'F');
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Step ${index + 1}: ${step.stepType || 'Unknown Step'}`, 20, yPosition + 4);
          yPosition += 10;
          
          pdf.setFont('helvetica', 'normal');
          yPosition = addText(`Date: ${step.timestamp || step.date || 'N/A'}`, 20, yPosition, pageWidth - 40, 10);
          if (step.temperature) {
            yPosition = addText(`Temperature: ${step.temperature}`, 20, yPosition + 3, pageWidth - 40, 10);
          }
          if (step.duration) {
            yPosition = addText(`Duration: ${step.duration}`, 20, yPosition + 3, pageWidth - 40, 10);
          }
          if (step.notes) {
            yPosition = addText(`Notes: ${step.notes}`, 20, yPosition + 3, pageWidth - 40, 10);
          }
          if (step.blockchain?.confirmed) {
            yPosition = addText('✓ Blockchain Verified', 20, yPosition + 3, pageWidth - 40, 10);
          }
          yPosition += 8;
        });
      }
      
      yPosition += 10;
      checkNewPage(50);
      
      // Lab Tests
      if (herb.labTests && herb.labTests.length > 0) {
        pdf.setFillColor(16, 185, 129); // Emerald color
        pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`LAB TEST RESULTS (${herb.labTests.length})`, 15, yPosition + 6);
        yPosition += 15;
        pdf.setTextColor(0, 0, 0);
        
        herb.labTests.forEach((test, index) => {
          checkNewPage(40);
          
          const statusColor = test.status?.toLowerCase() === 'passed' ? [34, 197, 94] : 
                             test.status?.toLowerCase() === 'failed' ? [239, 68, 68] : [245, 158, 11];
          
          pdf.setFillColor(...statusColor);
          pdf.rect(15, yPosition, pageWidth - 30, 6, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Test ${index + 1}: ${test.testType || 'Unknown Test'}`, 20, yPosition + 4);
          yPosition += 10;
          pdf.setTextColor(0, 0, 0);
          
          pdf.setFont('helvetica', 'normal');
          yPosition = addText(`Result: ${test.resultValue || 'N/A'} ${test.unit || ''}`, 20, yPosition, pageWidth - 40, 10);
          yPosition = addText(`Status: ${test.status || 'Pending'}`, 20, yPosition + 3, pageWidth - 40, 10);
          yPosition = addText(`Tester: ${test.tester || 'Lab Technician'}`, 20, yPosition + 3, pageWidth - 40, 10);
          yPosition = addText(`Test Date: ${test.testDate || new Date().toLocaleDateString()}`, 20, yPosition + 3, pageWidth - 40, 10);
          if (test.notes) {
            yPosition = addText(`Notes: ${test.notes}`, 20, yPosition + 3, pageWidth - 40, 10);
          }
          yPosition += 8;
        });
      }
      
      // Footer
      checkNewPage(30);
      yPosition = Math.max(yPosition + 20, pageHeight - 40);
      pdf.setFillColor(100, 100, 100);
      pdf.rect(0, yPosition, pageWidth, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Generated by AyurHerb Supply Chain System', pageWidth / 2, yPosition + 10, { align: 'center' });
      pdf.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition + 20, { align: 'center' });
      
      // Save the PDF
      const fileName = `AyurHerb_Report_${herb.herbId || herb.batchId || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      showToast && showToast('PDF report downloaded successfully!', 'success');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast && showToast('Failed to generate PDF report. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-emerald-200 to-blue-300 bg-clip-text text-transparent mb-2">
                  Verification & Report
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Comprehensive verification and reporting system for supply chain integrity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-2xl blur-lg"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Search className="w-6 h-6 text-emerald-400" />
            Herb Verification Search
          </h2>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type or paste the Unique ID of Herb"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            
            {/* Herb Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-60"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                      {searchResults.herbName || 'Unknown Herb'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500/30 border-2 border-emerald-500/50 rounded-xl shadow-lg backdrop-blur-sm">
                        <span className="text-emerald-200 text-lg font-mono font-bold tracking-wide">
                          ID: {searchResults.herbId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(searchResults.herbId)}
                          className="p-2 hover:bg-emerald-500/40 rounded-lg transition-colors duration-200 group"
                          title="Copy ID to clipboard"
                        >
                          <Copy className="w-4 h-4 text-emerald-300 group-hover:text-emerald-100" />
                        </button>
                      </div>
                      <button
                        onClick={() => generatePDFReport(searchResults)}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-110 border-2 border-blue-400/30"
                        title="Download comprehensive PDF report"
                      >
                        <Download className="w-5 h-5" />
                        <span className="text-base font-extrabold">Download Report</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-300">
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium">{searchResults.quantity || 'N/A'}</span>
                    </span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="font-medium">{searchResults.location || 'N/A'}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="flex flex-col gap-2 items-end">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    searchResults.status === 'tested' 
                      ? 'bg-emerald-500/20 border border-emerald-500/30' 
                      : searchResults.status === 'processed'
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'bg-orange-500/20 border border-orange-500/30'
                  }`}>
                    {searchResults.status === 'tested' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : searchResults.status === 'processed' ? (
                      <Factory className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Package className="w-4 h-4 text-orange-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      searchResults.status === 'tested' ? 'text-emerald-300' : 
                      searchResults.status === 'processed' ? 'text-blue-300' : 'text-orange-300'
                    }`}>
                      {searchResults.status === 'tested' ? 'Tested' : 
                       searchResults.status === 'processed' ? 'Processed' : 'Collected'}
                    </span>
                  </div>
                  
                  {/* Admin Verification Status */}
                  {searchResults.isVerified && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-medium">Admin Verified</span>
                    </div>
                  )}
                  
                  {/* Admin Verification Button */}
                  {isAdmin && (
                    searchResults.isVerified ? (
                      <div className="px-6 py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white font-bold rounded-xl cursor-default opacity-90 border-2 border-yellow-400/30 shadow-lg">
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5" />
                          <span className="text-base font-extrabold">Verified</span>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleVerifyClick(searchResults)}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/40 transform hover:scale-110 border-2 border-yellow-400/30"
                      >
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5" />
                          <span className="text-base font-extrabold">Verify</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Batch ID</p>
                <p className="text-emerald-400 font-bold text-sm">{searchResults.batchId}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Collector</p>
                <p className="text-white font-bold text-sm">{searchResults.collector || searchResults.collectorId || 'Unknown'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Processing Steps</p>
                <p className="text-blue-400 font-bold text-sm">{searchResults.processingSteps?.length || 0} Steps</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Lab Tests</p>
                <p className="text-green-400 font-bold text-sm">{searchResults.labTests?.length || 0} Tests</p>
              </div>
            </div>

            {/* Processing Steps Summary */}
            {searchResults.processingSteps && searchResults.processingSteps.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Factory className="w-5 h-5 text-blue-400" />
                  Processing Steps ({searchResults.processingSteps.length})
                </h4>
                <div className="space-y-4">
                  {searchResults.processingSteps.map((step, stepIndex) => (
                    <div key={stepIndex} className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-60"></div>
                      <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/5 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
                        
                        {/* Processing Step Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Factory className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-white">{step.stepType}</h5>
                              <p className="text-blue-300 text-sm">
                                {new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                              <Shield className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-300 text-sm font-medium">On-Chain</span>
                            </div>
                          </div>
                        </div>

                        {/* Processing Step Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Step Type</p>
                            <p className="text-blue-400 font-bold text-sm">{step.stepType}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Temperature</p>
                            <p className="text-orange-400 font-bold text-sm">
                              {step.temperature ? `${step.temperature}°C` : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Duration</p>
                            <p className="text-purple-400 font-bold text-sm">
                              {step.duration || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Date</p>
                            <p className="text-white font-bold text-sm">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Notes Section */}
                        {step.notes && (
                          <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Notes</p>
                            <p className="text-gray-300 text-sm">{step.notes}</p>
                          </div>
                        )}

                        {/* Blockchain Transaction Info */}
                        {step.blockchainTx && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                            <Database className="w-3 h-3" />
                            <span>TX: {step.blockchainTx.slice(0, 10)}...{step.blockchainTx.slice(-6)}</span>
                            {step.blockNumber && (
                              <>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span>Block: {step.blockNumber}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lab Tests Summary */}
            {searchResults.labTests && searchResults.labTests.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-green-400" />
                  Lab Tests ({searchResults.labTests.length})
                </h4>
                <div className="space-y-4">
                  {searchResults.labTests.map((test, testIndex) => (
                    <div key={testIndex} className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur opacity-60"></div>
                      <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4">
                        
                        {/* Test Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <Beaker className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-white">{test.testType}</h5>
                              <p className="text-emerald-300 text-sm">by {test.tester || 'Lab Technician'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                              test.status?.toLowerCase() === 'passed' 
                                ? 'bg-emerald-500/20 border border-emerald-500/30' 
                                : test.status?.toLowerCase() === 'failed'
                                ? 'bg-red-500/20 border border-red-500/30'
                                : 'bg-yellow-500/20 border border-yellow-500/30'
                            }`}>
                              {test.status?.toLowerCase() === 'passed' ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : test.status?.toLowerCase() === 'failed' ? (
                                <XCircle className="w-4 h-4 text-red-400" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-400" />
                              )}
                              <span className={`text-sm font-medium ${
                                test.status?.toLowerCase() === 'passed' ? 'text-emerald-300' : 
                                test.status?.toLowerCase() === 'failed' ? 'text-red-300' : 'text-yellow-300'
                              }`}>
                                {test.status || 'Pending'}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Test Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Result Value</p>
                            <p className="text-emerald-400 font-bold text-sm">
                              {test.resultValue} {test.unit || ''}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Status</p>
                            <p className={`font-bold text-sm ${
                              test.status?.toLowerCase() === 'passed' ? 'text-emerald-400' : 
                              test.status?.toLowerCase() === 'failed' ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                              {test.status || 'Pending'}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Blockchain</p>
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-emerald-400" />
                              <p className="text-emerald-400 font-bold text-xs">Verified</p>
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Test Date</p>
                            <p className="text-white font-bold text-sm">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Notes Section */}
                        {test.notes && (
                          <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Notes</p>
                            <p className="text-gray-300 text-sm">{test.notes}</p>
                          </div>
                        )}

                        {/* Blockchain Transaction Info */}
                        {test.blockchainTx && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                            <Database className="w-3 h-3" />
                            <span>TX: {test.blockchainTx.slice(0, 10)}...{test.blockchainTx.slice(-6)}</span>
                            {test.blockNumber && (
                              <>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span>Block: {test.blockNumber}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchResults && !isSearching && (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Search for Herb Verification</h3>
            <p className="text-gray-400 text-lg">Enter a herb ID above to view verification details</p>
          </div>
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
                      {verificationModal.herb?.herbName || 'Unknown Herb'} - {verificationModal.herb?.herbId}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setVerificationModal({ isOpen: false, herb: null })}
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
                  onClick={() => setVerificationModal({ isOpen: false, herb: null })}
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

export default VerificationReport;
