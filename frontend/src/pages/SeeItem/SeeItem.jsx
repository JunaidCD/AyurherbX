import React, { useState, useEffect } from 'react';
import { Package, TestTube, AlertCircle, Eye, Sparkles, Download, Calendar, BarChart3, CheckCircle, Clock } from 'lucide-react';

const SeeItem = () => {
  const [testedItems, setTestedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Check for tested items from lab tests
    const checkForTestedItems = () => {
      const labTests = JSON.parse(localStorage.getItem('ayurherb_lab_tests') || '[]');
      setTestedItems(labTests);
    };

    checkForTestedItems();

    // Listen for storage changes to update when new lab tests are added
    const handleStorageChange = (e) => {
      if (e.key === 'ayurherb_lab_tests') {
        checkForTestedItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // CSV Export Function for BAT 2024 001
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
              No Test Results Available
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Test results and lab reports will appear here once items have been processed through the laboratory.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeItem;
