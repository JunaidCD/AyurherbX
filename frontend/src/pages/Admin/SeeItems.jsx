import React, { useState, useEffect } from 'react';
import { useCollections } from '../../contexts/CollectionsContext';
import { 
  Package, 
  Leaf, 
  MapPin, 
  Calendar, 
  User, 
  Shield, 
  Database, 
  Beaker, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Factory, 
  Thermometer, 
  FileText, 
  Eye, 
  Search,
  TrendingUp,
  BarChart3,
  Copy
} from 'lucide-react';

const SeeItems = ({ showToast }) => {
  const { collections } = useCollections();
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCollections: 0,
    processedBatches: 0,
    testedBatches: 0,
    pendingProcessing: 0,
    pendingTesting: 0
  });

  // Generate random ID for herb
  const generateHerbId = (herbName) => {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
    return `${herbName?.toUpperCase().slice(0, 3) || 'HRB'}-${randomNumber}`;
  };

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`ID copied to clipboard: ${text}`, 'success');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`ID copied to clipboard: ${text}`, 'success');
    }
  };

  // Load comprehensive data from all sources
  const loadAllData = () => {
    try {
      // Get all data from localStorage and context
      const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
      const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
      
      const labTestsData = localStorage.getItem('ayurherb_lab_tests');
      const labTests = labTestsData ? JSON.parse(labTestsData) : {};
      
      let collectionsData = collections;
      if (!collectionsData || collectionsData.length === 0) {
        const storedCollections = localStorage.getItem('ayurherb_collections');
        collectionsData = storedCollections ? JSON.parse(storedCollections) : [];
      }

      // Combine all data
      const comprehensiveData = collectionsData.map(collection => {
        const batchId = collection.batchId || collection.id;
        const processing = processingSteps[batchId] || [];
        const tests = labTests[batchId] || [];
        
        return {
          ...collection,
          batchId,
          herbId: generateHerbId(collection.herbName), // Generate ID once and store it
          processingSteps: processing,
          labTests: tests,
          hasProcessing: processing.length > 0,
          hasTesting: tests.length > 0,
          status: tests.length > 0 ? 'tested' : processing.length > 0 ? 'processed' : 'collected',
          lastActivity: tests.length > 0 
            ? tests[tests.length - 1].testDate 
            : processing.length > 0 
              ? processing[processing.length - 1].timestamp || processing[processing.length - 1].date
              : collection.submissionDate || collection.date
        };
      });

      // Calculate real statistics from the data
      const totalCollections = comprehensiveData.length;
      const processedBatches = comprehensiveData.filter(item => item.hasProcessing).length;
      const testedBatches = comprehensiveData.filter(item => item.hasTesting).length;
      const pendingProcessing = comprehensiveData.filter(item => !item.hasProcessing).length;
      const pendingTesting = comprehensiveData.filter(item => item.hasProcessing && !item.hasTesting).length;

      setStats({
        totalCollections,
        processedBatches,
        testedBatches,
        pendingProcessing,
        pendingTesting
      });

      // Set the comprehensive data to display all items
      setAllData(comprehensiveData);
      setFilteredData(comprehensiveData);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading comprehensive data:', error);
      showToast('Error loading data', 'error');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [collections]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = allData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.herbName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.collector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [allData, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'tested':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Tested</span>
          </div>
        );
      case 'processed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Factory className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Processed</span>
          </div>
        );
      case 'collected':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
            <Package className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Collected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm font-medium">Unknown</span>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="relative text-6xl font-black tracking-tight">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50">
                See Items
              </span>
              <span className="relative bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                See Items
              </span>
              <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </h1>
            <p className="text-xl text-gray-300 font-light mt-4">
              Comprehensive view of all collections, processing, and testing data
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Collections */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-500/10 backdrop-blur-xl border-2 border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  {stats.totalCollections}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Total Collections</h3>
              <p className="text-emerald-300/80 text-sm">All submitted batches</p>
            </div>
          </div>

          {/* Processed Batches */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/10 backdrop-blur-xl border-2 border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Factory className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {stats.processedBatches}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Processed</h3>
              <p className="text-blue-300/80 text-sm">With processing steps</p>
            </div>
          </div>

          {/* Tested Batches */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                  {stats.testedBatches}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Tested</h3>
              <p className="text-green-300/80 text-sm">Lab tests completed</p>
            </div>
          </div>

          {/* Pending Processing */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/10 backdrop-blur-xl border-2 border-orange-500/30 rounded-2xl p-6 hover:border-orange-400/50 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                  {stats.pendingProcessing}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Pending Processing</h3>
              <p className="text-orange-300/80 text-sm">Awaiting processing</p>
            </div>
          </div>

          {/* Pending Testing */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-yellow-500/20 to-orange-500/10 backdrop-blur-xl border-2 border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  {stats.pendingTesting}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Pending Testing</h3>
              <p className="text-yellow-300/80 text-sm">Ready for lab tests</p>
            </div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by herb name, batch ID, location, or collector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 focus:bg-white/15 transition-all duration-300"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-60"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                    All Items ({filteredData.length})
                  </h2>
                  <p className="text-gray-400 mt-1">Complete overview of all collections and their status</p>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            {filteredData.length > 0 ? (
              <div className="space-y-6">
                {filteredData.map((item, index) => (
                  <div key={item.batchId || index} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-emerald-500/40 transition-all duration-300">
                      
                      {/* Item Header */}
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
                                {item.herbName || 'Unknown Herb'}
                              </h3>
                              <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500/30 border-2 border-emerald-500/50 rounded-xl shadow-lg backdrop-blur-sm">
                                <span className="text-emerald-200 text-lg font-mono font-bold tracking-wide">
                                  ID: {item.herbId}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(item.herbId)}
                                  className="p-2 hover:bg-emerald-500/40 rounded-lg transition-colors duration-200 group"
                                  title="Copy ID to clipboard"
                                >
                                  <Copy className="w-4 h-4 text-emerald-300 group-hover:text-emerald-100" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                              <span className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-emerald-400" />
                                <span className="font-medium">{item.quantity || 'N/A'}</span>
                              </span>
                              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                              <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="font-medium">{item.location || 'N/A'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          {getStatusBadge(item.status)}
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{item.lastActivity || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Batch ID</p>
                          <p className="text-emerald-400 font-bold text-sm">{item.batchId}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Collector</p>
                          <p className="text-white font-bold text-sm">{item.collector || item.collectorId || 'Unknown'}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Processing Steps</p>
                          <p className="text-blue-400 font-bold text-sm">{item.processingSteps.length} Steps</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Lab Tests</p>
                          <p className="text-green-400 font-bold text-sm">{item.labTests.length} Tests</p>
                        </div>
                      </div>

                      {/* Processing Steps Summary */}
                      {item.processingSteps.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Factory className="w-5 h-5 text-blue-400" />
                            Processing Steps ({item.processingSteps.length})
                          </h4>
                          <div className="space-y-4">
                            {item.processingSteps.map((step, stepIndex) => (
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
                      {item.labTests.length > 0 && (
                        <div>
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Beaker className="w-5 h-5 text-green-400" />
                            Lab Tests ({item.labTests.length})
                          </h4>
                          <div className="space-y-4">
                            {item.labTests.map((test, testIndex) => (
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
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <Search className="w-12 h-12 text-emerald-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    No Items Found
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {searchTerm 
                      ? 'Try adjusting your search criteria.' 
                      : 'No collections have been submitted yet.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeeItems;
