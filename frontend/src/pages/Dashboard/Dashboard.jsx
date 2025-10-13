import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '../../contexts/CollectionsContext';
import { 
  Plus, 
  Package, 
  CheckCircle,
  Calendar,
  TrendingUp,
  Leaf,
  Shield,
  Database,
  Clock,
  Thermometer,
  FileText,
  MapPin,
  Settings,
  Factory,
  RefreshCw
} from 'lucide-react';

const Dashboard = ({ user, showToast }) => {
  const navigate = useNavigate();
  const { getCollectionsStats, getRecentCollections, collections } = useCollections();

  // Check user role for different dashboard types
  const userRole = user?.role;
  const isProcessor = userRole === 'Processor';
  const isLabTester = userRole === 'Lab Tester';
  const isAdmin = userRole === 'Admin';
  const isCustomer = userRole === 'Customer';
  const isCollector = userRole === 'Collector';

  // Debug log to verify role detection
  console.log('Dashboard - User role:', userRole, 'isProcessor:', isProcessor, 'isLabTester:', isLabTester, 'isAdmin:', isAdmin, 'isCustomer:', isCustomer);

  // Get real-time data from collections context
  const stats = getCollectionsStats();
  const recentCollections = getRecentCollections(5);

  // Static dummy data for Total Collections and Completed Reports
  const staticTotalCollections = 144;
  const staticCompletedReports = 65;

  const handleNewCollection = () => {
    navigate('/collections');
    showToast('Redirecting to New Collection form...', 'info');
  };

  // Processor Dashboard - Comprehensive Processing Data View
  if (isProcessor) {
    const [processedBatches, setProcessedBatches] = useState([]);
    const [processingStats, setProcessingStats] = useState({
      totalSubmitted: 247, // Static random number
      todaySubmitted: 0,
      pending: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load processing data
    const loadProcessingData = () => {
      try {
        // Get processing steps from localStorage
        const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
        const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
        
        // Use collections data from context
        const today = new Date().toISOString().split('T')[0];
        
        // Get collections from context or localStorage as fallback
        let collectionsData = collections;
        
        // If no collections from context, try localStorage
        if (!collectionsData || collectionsData.length === 0) {
          const storedCollections = localStorage.getItem('ayurherb_collections');
          collectionsData = storedCollections ? JSON.parse(storedCollections) : [];
        }
        
        // Debug logging
        console.log('Collections data:', collectionsData);
        console.log('Collections length:', collectionsData.length);
        
        // Calculate today's processed batches submitted by processors (not raw collections by collectors)
        const todayProcessedBatches = Object.keys(processingSteps).filter(batchId => {
          const steps = processingSteps[batchId];
          if (steps.length === 0) return false;
          
          // Check if any processing step was completed today
          return steps.some(step => {
            const stepDate = step.timestamp || step.date || '';
            console.log('Checking processing step:', step.step, 'Date:', stepDate, 'Today:', today);
            
            // Check multiple date formats
            if (stepDate.startsWith(today)) {
              return true;
            }
            
            // Check if it's today's date in different formats
            const stepDateObj = new Date(stepDate);
            const todayDateObj = new Date(today);
            
            return stepDateObj.toDateString() === todayDateObj.toDateString();
          });
        }).length;
        
        console.log('Today processed batches count:', todayProcessedBatches);
        
        // Calculate pending batches (collections without processing steps)
        const processedBatchIds = Object.keys(processingSteps).filter(batchId => 
          processingSteps[batchId].length > 0
        );
        
        const pendingBatches = collectionsData.filter(collection => {
          const batchId = collection.batchId || collection.id;
          return !processedBatchIds.includes(batchId);
        });
        
        // Combine processing steps with collection data for processed batches
        const processedData = [];
        
        Object.keys(processingSteps).forEach(batchId => {
          const steps = processingSteps[batchId];
          if (steps.length > 0) {
            // Find matching collection
            const collection = collectionsData.find(c => 
              c.batchId === batchId || c.id === batchId
            );
            
            // Only add to processed data if we have valid collection data
            if (collection && collection.herbName) {
              processedData.push({
                batchId,
                collection,
                processingSteps: steps,
                totalSteps: steps.length,
                lastProcessed: steps[steps.length - 1]?.timestamp || steps[steps.length - 1]?.date,
                onChainVerified: steps.some(step => step.blockchain?.confirmed)
              });
            }
          }
        });
        
        setProcessedBatches(processedData);
        setProcessingStats({
          totalSubmitted: 247, // Static random number
          todaySubmitted: todayProcessedBatches, // Real-time count of today's processed batches by processors
          pending: pendingBatches.length
        });
        
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error loading processing data:', error);
        showToast('Error loading processing data', 'error');
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadProcessingData();
    }, [collections]); // Re-run when collections data changes

    const handleRefresh = () => {
      loadProcessingData();
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="relative text-6xl font-black tracking-tight">
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50">
                  Processing Dashboard
                </span>
                <span className="relative bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                  Processing Dashboard
                </span>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </h1>
              <p className="text-xl text-gray-300 font-light mt-4">
                Monitor all processing steps and blockchain transactions
              </p>
            </div>
          </div>

          {/* Processing Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Submitted */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-8 hover:border-emerald-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-1">
                      {processingStats.totalSubmitted}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>All Time</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">Total Submitted</h3>
                  <p className="text-emerald-300/80 text-sm font-medium">All collections submitted</p>
                </div>
              </div>
            </div>

            {/* Today Submitted */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/10 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-1">
                      {processingStats.todaySubmitted}
                    </div>
                    <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>Today</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Today Processed</h3>
                  <p className="text-blue-300/80 text-sm font-medium">Batches processed today</p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-orange-500/20 via-red-500/15 to-pink-500/10 backdrop-blur-xl border-2 border-orange-500/30 rounded-3xl p-8 hover:border-orange-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent mb-1">
                      {processingStats.pending}
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 text-sm font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>Awaiting</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Pending</h3>
                  <p className="text-orange-300/80 text-sm font-medium">Batches awaiting processing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Processed Batches List */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Factory className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                      Processed Batches
                    </h2>
                    <p className="text-gray-400 mt-1">All batches with completed processing steps</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-300 text-sm font-medium">Live Data</span>
                </div>
              </div>

              {/* Processed Batches Grid */}
              {!isLoading && processedBatches.length > 0 ? (
                <div className="space-y-6">
                  {processedBatches.map((batch, index) => {
                    const collection = batch.collection;
                    return (
                      <div key={batch.batchId} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-emerald-500/40 transition-all duration-300">
                          
                          {/* Batch Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-5">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-60"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl">
                                  <Leaf className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                  {collection?.herbName || 'Unknown Herb'}
                                </h3>
                                <div className="flex items-center gap-4 text-gray-300">
                                  <span className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-emerald-400" />
                                    <span className="font-medium">{collection?.quantity || 'N/A'}</span>
                                  </span>
                                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                  <span className="font-medium">{collection?.location || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-300 text-sm font-semibold">
                                  {batch.totalSteps} Step{batch.totalSteps !== 1 ? 's' : ''}
                                </span>
                              </div>
                              {batch.onChainVerified && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                  <Database className="w-4 h-4 text-blue-400" />
                                  <span className="text-blue-300 text-sm font-semibold">On-Chain</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Collection Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Batch ID</p>
                              <p className="text-emerald-400 font-bold text-sm">{batch.batchId}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Collector</p>
                              <p className="text-white font-bold text-sm">{collection?.collector || collection?.collectorId || 'Junaid'}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Last Processed</p>
                              <p className="text-white font-bold text-sm">{batch.lastProcessed || 'N/A'}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Status</p>
                              <p className="text-emerald-400 font-bold text-sm">Processed</p>
                            </div>
                          </div>

                          {/* Processing Steps */}
                          <div className="space-y-4">
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                              <Factory className="w-5 h-5 text-emerald-400" />
                              Processing Steps:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {batch.processingSteps.map((step, stepIndex) => {
                                const StepIcon = getStepIcon(step.stepType);
                                return (
                                  <div key={stepIndex} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-emerald-500/30 transition-all duration-300 shadow-lg">
                                    <div className="flex items-start gap-4 mb-4">
                                      <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-60"></div>
                                        <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                                          <StepIcon className="w-6 h-6 text-white" />
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="text-white font-bold text-lg mb-1">{step.stepType}</h5>
                                        <p className="text-gray-300 text-sm font-medium">{step.timestamp || step.date}</p>
                                      </div>
                                      {step.blockchain?.confirmed && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                          <Shield className="w-3 h-3 text-blue-400" />
                                          <span className="text-blue-400 text-xs font-semibold">On-Chain</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                      {step.temperature && (
                                        <div className="flex items-center gap-2 text-orange-300">
                                          <Thermometer className="w-4 h-4" />
                                          <span className="text-sm font-medium">Temperature: {step.temperature}</span>
                                        </div>
                                      )}
                                      {step.duration && (
                                        <div className="flex items-center gap-2 text-blue-300">
                                          <Clock className="w-4 h-4" />
                                          <span className="text-sm font-medium">Duration: {step.duration}</span>
                                        </div>
                                      )}
                                      {step.notes && (
                                        <div className="flex items-start gap-2 text-gray-300 mt-3">
                                          <FileText className="w-4 h-4 mt-0.5" />
                                          <span className="text-sm leading-relaxed">Notes: {step.notes}</span>
                                        </div>
                                      )}
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
              ) : isLoading ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="relative inline-block">
                      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Loading Processing Data...
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Please wait while we load your processing information.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="relative inline-block">
                      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <Factory className="w-12 h-12 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      No Processing Data Yet
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Start processing herb batches to see comprehensive data here. All processing steps will be displayed with blockchain verification.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Lab Tester Dashboard - Comprehensive Lab Test Data
  if (isLabTester) {
    const [completedTests, setCompletedTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load comprehensive lab test data
    const loadLabTestData = () => {
      try {
        // Get all data from localStorage
        const labTestsData = localStorage.getItem('ayurherb_lab_tests');
        const labTests = labTestsData ? JSON.parse(labTestsData) : {};
        
        const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
        const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
        
        let collectionsData = collections;
        if (!collectionsData || collectionsData.length === 0) {
          const storedCollections = localStorage.getItem('ayurherb_collections');
          collectionsData = storedCollections ? JSON.parse(storedCollections) : [];
        }

        // Combine all data for comprehensive view
        const comprehensiveData = [];
        
        Object.keys(labTests).forEach(batchId => {
          const tests = labTests[batchId];
          if (tests.length > 0) {
            // Find matching collection and processing data
            const collection = collectionsData.find(c => 
              c.batchId === batchId || c.id === batchId
            );
            const processing = processingSteps[batchId] || [];
            
            if (collection && collection.herbName) {
              comprehensiveData.push({
                batchId,
                collection,
                processingSteps: processing,
                labTests: tests,
                totalProcessingSteps: processing.length,
                totalLabTests: tests.length,
                lastTested: tests[tests.length - 1]?.testDate,
                testStatus: tests[tests.length - 1]?.status
              });
            }
          }
        });
        
        setCompletedTests(comprehensiveData);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error loading lab test data:', error);
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadLabTestData();
    }, [collections]);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="relative text-6xl font-black tracking-tight">
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50">
                  Lab Test Dashboard
                </span>
                <span className="relative bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                  Lab Test Dashboard
                </span>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </h1>
              <p className="text-xl text-gray-300 font-light mt-4">
                Complete herb journey from collection to lab testing
              </p>
            </div>
          </div>

          {/* Comprehensive Test Results */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                      Completed Lab Tests
                    </h2>
                    <p className="text-gray-400 mt-1">Complete herb journey with collection, processing & test data</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-300 text-sm font-medium">Live Data</span>
                </div>
              </div>

              {/* Comprehensive Test Cards */}
              {!isLoading && completedTests.length > 0 ? (
                <div className="space-y-8">
                  {completedTests.map((testData, index) => {
                    const collection = testData.collection;
                    const latestTest = testData.labTests[testData.labTests.length - 1];
                    return (
                      <div key={testData.batchId} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:border-emerald-500/40 transition-all duration-300">
                          
                          {/* Herb Header */}
                          <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-6">
                              <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-60"></div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                  <Leaf className="w-10 h-10 text-white" />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <h3 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-blue-300 bg-clip-text text-transparent mb-1">
                                    {collection?.herbName || 'Unknown Herb'}
                                  </h3>
                                  <p className="text-lg text-emerald-300 font-medium">Premium Quality Herb</p>
                                </div>
                                <div className="flex items-center gap-6 text-gray-300">
                                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                                    <Package className="w-4 h-4 text-emerald-400" />
                                    <span className="font-semibold">{collection?.quantity || 'N/A'}</span>
                                  </span>
                                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <span className="font-semibold">{collection?.location || 'N/A'}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex flex-wrap gap-2 justify-end">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl backdrop-blur-sm">
                                  <Shield className="w-4 h-4 text-emerald-400" />
                                  <span className="text-emerald-300 text-sm font-bold">
                                    {testData.totalProcessingSteps} Processing Steps
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-xl backdrop-blur-sm">
                                  <CheckCircle className="w-4 h-4 text-blue-400" />
                                  <span className="text-blue-300 text-sm font-bold">
                                    {testData.totalLabTests} Lab Test{testData.totalLabTests !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${
                                  latestTest?.status === 'Passed' 
                                    ? 'bg-green-500/20 border border-green-500/40' 
                                    : 'bg-red-500/20 border border-red-500/40'
                                }`}>
                                  <CheckCircle className={`w-4 h-4 ${
                                    latestTest?.status === 'Passed' ? 'text-green-400' : 'text-red-400'
                                  }`} />
                                  <span className={`text-sm font-bold ${
                                    latestTest?.status === 'Passed' ? 'text-green-300' : 'text-red-300'
                                  }`}>
                                    Test {latestTest?.status || 'Unknown'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Basic Information Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="group relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                              <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-emerald-500/40 transition-all duration-300">
                                <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Batch ID</p>
                                <p className="text-emerald-400 font-black text-lg">{testData.batchId}</p>
                              </div>
                            </div>
                            <div className="group relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                              <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-blue-500/40 transition-all duration-300">
                                <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Collector</p>
                                <p className="text-blue-400 font-black text-lg">{collection?.collector || collection?.collectorId || 'Junaid'}</p>
                              </div>
                            </div>
                            <div className="group relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                              <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-purple-500/40 transition-all duration-300">
                                <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Weight</p>
                                <p className="text-purple-400 font-black text-lg">{collection?.quantity || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="group relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 to-red-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                              <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-pink-500/40 transition-all duration-300">
                                <p className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2">Test Date</p>
                                <p className="text-pink-400 font-black text-lg">{new Date(latestTest?.testDate).toLocaleDateString() || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Processing & Test Data */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Processing Steps */}
                            <div className="space-y-6">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
                                <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                                  <h4 className="text-2xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                                    <div className="relative">
                                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-60"></div>
                                      <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Factory className="w-6 h-6 text-white" />
                                      </div>
                                    </div>
                                    Processing Data
                                  </h4>
                                  <p className="text-blue-300 font-medium">Steps completed by processor</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                {testData.processingSteps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="bg-gradient-to-br from-white/12 to-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <Factory className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <h5 className="text-white font-bold">{step.stepType}</h5>
                                        <p className="text-gray-300 text-sm">{step.timestamp || step.date}</p>
                                      </div>
                                    </div>
                                    {step.temperature && (
                                      <p className="text-orange-300 text-sm"><Thermometer className="w-3 h-3 inline mr-1" />Temperature: {step.temperature}</p>
                                    )}
                                    {step.duration && (
                                      <p className="text-blue-300 text-sm"><Clock className="w-3 h-3 inline mr-1" />Duration: {step.duration}</p>
                                    )}
                                    {step.notes && (
                                      <p className="text-gray-300 text-sm mt-2"><FileText className="w-3 h-3 inline mr-1" />Notes: {step.notes}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Lab Test Results */}
                            <div className="space-y-6">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                                <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                                  <h4 className="text-2xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                                    <div className="relative">
                                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-60"></div>
                                      <div className="relative w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                      </div>
                                    </div>
                                    Lab Test Results
                                  </h4>
                                  <p className="text-emerald-300 font-medium">Quality tests performed by tester</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                {testData.labTests.map((test, testIndex) => (
                                  <div key={testIndex} className="bg-gradient-to-br from-white/12 to-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                          <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                          <h5 className="text-white font-bold">{test.testType}</h5>
                                          <p className="text-gray-300 text-sm">Tester: {test.tester}</p>
                                        </div>
                                      </div>
                                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        test.status === 'Passed' 
                                          ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                      }`}>
                                        {test.status}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-emerald-300 text-sm font-semibold">Result: {test.resultValue} {test.unit}</p>
                                      <p className="text-blue-300 text-sm">Date: {new Date(test.testDate).toLocaleDateString()}</p>
                                      {test.notes && (
                                        <p className="text-gray-300 text-sm">Notes: {test.notes}</p>
                                      )}
                                      {test.blockchainTx && (
                                        <p className="text-purple-300 text-xs">Blockchain: {test.blockchainTx.substring(0, 20)}...</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : isLoading ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="relative inline-block">
                      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Loading Lab Test Data...
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Please wait while we load comprehensive test information.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="relative inline-block">
                      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      No Lab Tests Completed Yet
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Complete lab tests will appear here with full herb journey data including collection, processing, and test results.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Admin Dashboard - Simple Empty State
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="relative text-6xl font-black tracking-tight">
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50">
                  Dashboard
                </span>
                <span className="relative bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent animate-pulse">
                  Dashboard
                </span>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </h1>
            </div>
          </div>

          {/* Simple Empty State */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <Package className="w-12 h-12 text-emerald-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    New content For Admin Dashboard will appear here
                  </h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Customer Dashboard - Simple Empty State
  if (isCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="relative text-6xl font-black tracking-tight">
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50">
                  Dashboard
                </span>
                <span className="relative bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent animate-pulse">
                  Dashboard
                </span>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </h1>
            </div>
          </div>

          {/* Simple Empty State */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <Package className="w-12 h-12 text-emerald-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    New content For Customer Dashboard will appear here
                  </h3>
                </div>
              </div>
            </div>
          </div>

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
            {/* Dashboard Title Only */}
            <h1 className="relative text-6xl font-black tracking-tight">
              {/* Background glow effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50">
                Dashboard
              </span>
              {/* Main text with gradient */}
              <span className="relative bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent animate-pulse">
                Dashboard
              </span>
              {/* Animated underline */}
              <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </h1>
          </div>
          
          <button
            onClick={handleNewCollection}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
          >
            <Plus className="w-5 h-5" />
            New Collection
          </button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Total Collections Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-8 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-1">
                    {staticTotalCollections}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.5%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">Total Collections</h3>
                <p className="text-emerald-300/80 text-sm font-medium">All time reports</p>
                <div className="w-full h-2 bg-emerald-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" style={{width: '85%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Collections Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/10 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-1">
                    {stats.todayCollections}
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>+8.2%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Today's Collections</h3>
                <p className="text-blue-300/80 text-sm font-medium">Reports submitted today</p>
                <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Reports Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/10 backdrop-blur-xl border-2 border-green-500/30 rounded-3xl p-8 hover:border-green-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-1">
                    {staticCompletedReports}
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Completed Reports</h3>
                <p className="text-green-300/80 text-sm font-medium">Successfully verified</p>
                <div className="w-full h-2 bg-green-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" style={{width: '95%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Collections - Enhanced Empty State */}
        <div className="relative">
          {/* Animated background gradient */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
          
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-60 animate-pulse"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                    Recent Collections
                  </h2>
                  <p className="text-gray-400 mt-1">Your latest submissions will appear here</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 text-sm font-medium">Ready for Collections</span>
              </div>
            </div>

            {/* Collections List or Empty State */}
            {recentCollections.length > 0 ? (
              <div className="space-y-4">
                {recentCollections.map((collection, index) => (
                  <div key={collection.id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-emerald-500/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-60 animate-pulse"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl">
                              <Leaf className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">{collection.herbName}</h3>
                            <div className="flex items-center gap-4 text-gray-300">
                              <span className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-emerald-400" />
                                <span className="font-medium">{collection.quantity}</span>
                              </span>
                              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                              <span className="font-medium">{collection.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            <span>Submitted</span>
                          </div>
                          <p className="text-gray-400 text-sm mt-2 font-medium">{collection.timestamp}</p>
                        </div>
                      </div>
                      
                      {/* Collection Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Collector ID</p>
                          <p className="text-white font-bold text-sm">{collection.collectorId || 'Not specified'}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Batch ID</p>
                          <p className="text-emerald-400 font-bold text-sm">{collection.batchId || 'Not specified'}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Collector</p>
                          <p className="text-white font-bold text-sm">{collection.collector || user?.name || 'Junaid'}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-1">Status</p>
                          <p className="text-green-400 font-bold text-sm">Verified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  {/* Floating elements animation */}
                  <div className="absolute top-0 left-1/4 w-3 h-3 bg-emerald-400/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="absolute top-4 right-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute -top-2 left-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                
                {/* Main icon with glow effect */}
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                    <Package className="w-12 h-12 text-emerald-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  New collections will appear here
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Start by creating your first collection report. All your submissions will be displayed in this beautiful dashboard.
                </p>
                
                {/* Action hint with arrow animation */}
                <div className="flex items-center justify-center gap-3 mt-8 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <span className="text-sm font-medium">Click "New Collection" to get started</span>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="flex justify-center gap-8 mt-12 opacity-30">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-full"></div>
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"></div>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full"></div>
              </div>
            </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
