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
  RefreshCw,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Users,
  Star,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity
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
                                  <div key={stepIndex} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:border-emerald-500/30 transition-all duration-300 shadow-lg">
                                    <div className="flex items-start gap-5 mb-6">
                                      <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-60"></div>
                                        <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                                          <StepIcon className="w-8 h-8 text-white" />
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="text-white font-bold text-2xl mb-2">{step.stepType}</h5>
                                        <p className="text-gray-300 text-lg font-semibold">{step.timestamp || step.date}</p>
                                      </div>
                                      {step.blockchain?.confirmed && (
                                        <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                          <Shield className="w-5 h-5 text-blue-400" />
                                          <span className="text-blue-400 text-base font-bold">On-Chain</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="space-y-4">
                                      {step.temperature && (
                                        <div className="flex items-center gap-4 text-orange-300">
                                          <Thermometer className="w-6 h-6" />
                                          <span className="text-xl font-bold">Temperature: {step.temperature}</span>
                                        </div>
                                      )}
                                      {step.duration && (
                                        <div className="flex items-center gap-4 text-blue-300">
                                          <Clock className="w-6 h-6" />
                                          <span className="text-xl font-bold">Duration: {step.duration}</span>
                                        </div>
                                      )}
                                      {step.notes && (
                                        <div className="flex items-start gap-4 text-gray-300 mt-5">
                                          <FileText className="w-6 h-6 mt-1" />
                                          <span className="text-lg leading-relaxed font-semibold">Notes: {step.notes}</span>
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
    const [labTestStats, setLabTestStats] = useState({
      totalTests: 156,
      todayTests: 0,
      pendingTests: 0
    });

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

        // Calculate statistics
        const today = new Date().toISOString().split('T')[0];
        let todayTestsCount = 0;
        let totalTestsCount = 0;
        
        // Count today's tests and total tests
        Object.keys(labTests).forEach(batchId => {
          const tests = labTests[batchId];
          totalTestsCount += tests.length;
          tests.forEach(test => {
            const testDate = new Date(test.testDate).toISOString().split('T')[0];
            if (testDate === today) {
              todayTestsCount++;
            }
          });
        });

        // Calculate pending tests (processed batches without lab tests that exist in collections)
        const testedBatchIds = Object.keys(labTests).filter(batchId => 
          labTests[batchId].length > 0
        );
        
        // Get batches that have processing steps AND exist in collections
        const validPendingBatches = collectionsData.filter(collection => {
          const batchId = collection.batchId || collection.id;
          const hasProcessingSteps = processingSteps[batchId] && processingSteps[batchId].length > 0;
          const hasLabTest = testedBatchIds.includes(batchId);
          
          // Only count if it has processing steps but no lab test
          return hasProcessingSteps && !hasLabTest && collection.herbName;
        });
        
        const pendingTests = validPendingBatches.length;

        // Debug logging
        console.log('=== LAB TEST STATISTICS DEBUG ===');
        console.log('Today:', today);
        console.log('Lab Tests Data:', labTests);
        console.log('Collections Data:', collectionsData);
        console.log('Processing Steps:', processingSteps);
        console.log('Total Tests Count:', totalTestsCount);
        console.log('Today Tests Count:', todayTestsCount);
        console.log('Tested Batch IDs:', testedBatchIds);
        console.log('Valid Pending Batches:', validPendingBatches);
        console.log('Pending Tests:', pendingTests);

        // Set statistics with real-time data
        setLabTestStats({
          totalTests: totalTestsCount + 156, // Real total + base number
          todayTests: todayTestsCount, // Real-time
          pendingTests: pendingTests // Real-time
        });

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

    // Refresh data when localStorage changes (when new tests are added)
    useEffect(() => {
      const handleStorageChange = () => {
        console.log('Storage changed, refreshing lab test data...');
        loadLabTestData();
      };

      // Listen for storage changes
      window.addEventListener('storage', handleStorageChange);
      
      // Also refresh every 5 seconds to catch localStorage changes from same tab
      const interval = setInterval(() => {
        loadLabTestData();
      }, 5000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }, []);
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

          {/* Lab Test Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Tests */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-8 hover:border-emerald-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-1">
                      {labTestStats.totalTests}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>All Time</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">Total Tests</h3>
                  <p className="text-emerald-300/80 text-sm font-medium">All lab tests completed</p>
                </div>
              </div>
            </div>

            {/* Today's Tests */}
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
                      {labTestStats.todayTests}
                    </div>
                    <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>Today</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Today's Tests</h3>
                  <p className="text-blue-300/80 text-sm font-medium">Tests completed today</p>
                </div>
              </div>
            </div>

            {/* Pending Tests */}
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
                      {labTestStats.pendingTests}
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 text-sm font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>Awaiting</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Pending Tests</h3>
                  <p className="text-orange-300/80 text-sm font-medium">Batches awaiting testing</p>
                </div>
              </div>
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
                              <div className="space-y-6">
                                {testData.processingSteps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="bg-gradient-to-br from-white/12 to-white/8 backdrop-blur-sm rounded-xl p-8 border border-white/30">
                                    <div className="flex items-center gap-5 mb-6">
                                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <Factory className="w-7 h-7 text-white" />
                                      </div>
                                      <div>
                                        <h5 className="text-white font-black text-2xl">{step.stepType}</h5>
                                        <p className="text-gray-300 text-lg font-medium">{step.timestamp || step.date}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      {step.temperature && (
                                        <p className="text-orange-300 text-xl font-bold"><Thermometer className="w-6 h-6 inline mr-3" />Temperature: {step.temperature}</p>
                                      )}
                                      {step.duration && (
                                        <p className="text-blue-300 text-xl font-bold"><Clock className="w-6 h-6 inline mr-3" />Duration: {step.duration}</p>
                                      )}
                                      {step.notes && (
                                        <p className="text-gray-300 text-lg mt-4 leading-relaxed font-medium"><FileText className="w-5 h-5 inline mr-3" />Notes: {step.notes}</p>
                                      )}
                                    </div>
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
                              <div className="space-y-6">
                                {testData.labTests.map((test, testIndex) => (
                                  <div key={testIndex} className="bg-gradient-to-br from-white/12 to-white/8 backdrop-blur-sm rounded-xl p-8 border border-white/30">
                                    <div className="flex items-center justify-between mb-6">
                                      <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                          <CheckCircle className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                          <h5 className="text-white font-black text-2xl">{test.testType}</h5>
                                          <p className="text-gray-300 text-lg font-medium">Tester: {test.tester}</p>
                                        </div>
                                      </div>
                                      <div className={`px-6 py-3 rounded-full text-lg font-black ${
                                        test.status === 'Passed' 
                                          ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                      }`}>
                                        {test.status}
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <p className="text-emerald-300 text-xl font-black">Result: {test.resultValue} {test.unit}</p>
                                      <p className="text-blue-300 text-xl font-bold">Date: {new Date(test.testDate).toLocaleDateString()}</p>
                                      {test.notes && (
                                        <p className="text-gray-300 text-lg leading-relaxed font-medium">Notes: {test.notes}</p>
                                      )}
                                      {test.blockchainTx && (
                                        <p className="text-purple-300 text-lg font-bold">Blockchain: {test.blockchainTx.substring(0, 20)}...</p>
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

  // Admin Dashboard - Comprehensive Herb Sales Analytics
  if (isAdmin) {
    // Dummy data for herb sales analytics
    const salesData = {
      totalRevenue: 125840,
      totalSales: 2847,
      monthlyGrowth: 18.5,
      activeCustomers: 1256,
      topSellingHerbs: [
        { name: 'Turmeric', sales: 456, revenue: 12800, growth: 12.5, stock: 245 },
        { name: 'Ashwagandha', sales: 389, revenue: 15600, growth: 8.3, stock: 189 },
        { name: 'Ginseng', sales: 342, revenue: 18900, growth: -2.1, stock: 67 },
        { name: 'Echinacea', sales: 298, revenue: 8950, growth: 15.7, stock: 156 },
        { name: 'Ginkgo Biloba', sales: 267, revenue: 13400, growth: 5.2, stock: 203 },
        { name: 'Holy Basil', sales: 234, revenue: 9800, growth: 22.1, stock: 178 },
        { name: 'Brahmi', sales: 198, revenue: 11200, growth: 6.8, stock: 134 },
        { name: 'Neem', sales: 176, revenue: 7650, growth: -5.3, stock: 89 }
      ],
      recentSales: [
        { id: 'ORD-2024-001', customer: 'Sarah Johnson', herb: 'Turmeric', quantity: '2.5 kg', amount: 450, date: '2024-10-15', status: 'Completed' },
        { id: 'ORD-2024-002', customer: 'Michael Chen', herb: 'Ashwagandha', quantity: '1.8 kg', amount: 720, date: '2024-10-15', status: 'Processing' },
        { id: 'ORD-2024-003', customer: 'Emma Davis', herb: 'Ginseng', quantity: '0.9 kg', amount: 890, date: '2024-10-14', status: 'Shipped' },
        { id: 'ORD-2024-004', customer: 'James Wilson', herb: 'Echinacea', quantity: '3.2 kg', amount: 320, date: '2024-10-14', status: 'Completed' },
        { id: 'ORD-2024-005', customer: 'Lisa Anderson', herb: 'Ginkgo Biloba', quantity: '1.5 kg', amount: 675, date: '2024-10-13', status: 'Completed' },
        { id: 'ORD-2024-006', customer: 'David Brown', herb: 'Holy Basil', quantity: '1.2 kg', amount: 540, date: '2024-10-13', status: 'Shipped' },
        { id: 'ORD-2024-007', customer: 'Jennifer White', herb: 'Brahmi', quantity: '0.8 kg', amount: 480, date: '2024-10-12', status: 'Completed' },
        { id: 'ORD-2024-008', customer: 'Robert Garcia', herb: 'Neem', quantity: '2.1 kg', amount: 315, date: '2024-10-12', status: 'Processing' }
      ],
      monthlyTrends: [
        { month: 'Jan', sales: 1850, revenue: 89500 },
        { month: 'Feb', sales: 2100, revenue: 95200 },
        { month: 'Mar', sales: 2350, revenue: 108700 },
        { month: 'Apr', sales: 2180, revenue: 102300 },
        { month: 'May', sales: 2650, revenue: 118900 },
        { month: 'Jun', sales: 2847, revenue: 125840 }
      ],
      inventoryStatus: [
        { herb: 'Turmeric', stock: 245, reorderLevel: 100, status: 'Good', lastRestocked: '2024-10-10' },
        { herb: 'Ashwagandha', stock: 189, reorderLevel: 150, status: 'Good', lastRestocked: '2024-10-08' },
        { herb: 'Ginseng', stock: 67, reorderLevel: 80, status: 'Low', lastRestocked: '2024-09-25' },
        { herb: 'Echinacea', stock: 156, reorderLevel: 120, status: 'Good', lastRestocked: '2024-10-05' },
        { herb: 'Ginkgo Biloba', stock: 203, reorderLevel: 100, status: 'Good', lastRestocked: '2024-10-12' },
        { herb: 'Holy Basil', stock: 178, reorderLevel: 150, status: 'Good', lastRestocked: '2024-10-07' },
        { herb: 'Brahmi', stock: 134, reorderLevel: 100, status: 'Good', lastRestocked: '2024-10-09' },
        { herb: 'Neem', stock: 89, reorderLevel: 100, status: 'Low', lastRestocked: '2024-09-28' }
      ],
      customerAnalytics: [
        { segment: 'Premium Customers', count: 156, revenue: 45600, avgOrder: 292 },
        { segment: 'Regular Customers', count: 789, revenue: 58900, avgOrder: 75 },
        { segment: 'New Customers', count: 311, revenue: 21340, avgOrder: 69 }
      ],
      recentActivities: [
        { type: 'order', message: 'New order #ORD-2024-001 from Sarah Johnson', time: '2 minutes ago', icon: 'ShoppingCart' },
        { type: 'stock', message: 'Ginseng stock running low (67 kg remaining)', time: '15 minutes ago', icon: 'Package' },
        { type: 'customer', message: 'New customer Jennifer White registered', time: '1 hour ago', icon: 'Users' },
        { type: 'payment', message: 'Payment of $890 received for order #ORD-2024-003', time: '2 hours ago', icon: 'DollarSign' },
        { type: 'inventory', message: 'Ginkgo Biloba restocked - 203 kg added', time: '3 hours ago', icon: 'Package' },
        { type: 'order', message: 'Order #ORD-2024-002 marked as processing', time: '4 hours ago', icon: 'Clock' }
      ]
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-4">
        <div className="w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="relative text-6xl font-black tracking-tight">
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50">
                  Admin Dashboard
                </span>
                <span className="relative bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </h1>
              <p className="text-xl text-gray-300 font-light mt-4">
                Comprehensive herb sales analytics and business insights
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-sm font-medium">Live Analytics</span>
            </div>
          </div>

          {/* Sales Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-6 hover:border-emerald-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+{salesData.monthlyGrowth}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">Total Revenue</h3>
                  <div className="text-2xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    ${salesData.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-emerald-300/80 text-xs font-medium">This month</p>
                </div>
              </div>
            </div>

            {/* Total Sales */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/10 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl p-6 hover:border-blue-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+12.3%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Total Sales</h3>
                  <div className="text-2xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {salesData.totalSales.toLocaleString()}
                  </div>
                  <p className="text-blue-300/80 text-xs font-medium">Orders completed</p>
                </div>
              </div>
            </div>

            {/* Active Customers */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-orange-500/20 via-red-500/15 to-pink-500/10 backdrop-blur-xl border-2 border-orange-500/30 rounded-3xl p-6 hover:border-orange-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400 text-xs font-semibold">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+8.7%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Active Customers</h3>
                  <div className="text-2xl font-black bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                    {salesData.activeCustomers.toLocaleString()}
                  </div>
                  <p className="text-orange-300/80 text-xs font-medium">This month</p>
                </div>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/10 backdrop-blur-xl border-2 border-green-500/30 rounded-3xl p-6 hover:border-green-400/50 transition-all duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Growth Rate</h3>
                  <div className="text-2xl font-black bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                    +{salesData.monthlyGrowth}%
                  </div>
                  <p className="text-green-300/80 text-xs font-medium">Monthly increase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Herbs */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Star className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                      Top Selling Herbs
                    </h2>
                    <p className="text-gray-400 mt-1">Best performing products this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">Analytics</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                {salesData.topSellingHerbs.map((herb, index) => (
                  <div key={herb.name} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-lg font-bold text-white">#{index + 1}</div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{herb.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Sales:</span>
                          <span className="text-emerald-400 font-semibold">{herb.sales}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-blue-400 font-semibold">${herb.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Growth:</span>
                          <span className={`font-semibold flex items-center gap-1 ${herb.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {herb.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(herb.growth)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Sales History */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <ShoppingCart className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                      Recent Sales History
                    </h2>
                    <p className="text-gray-400 mt-1">Latest herb sales and orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">View All</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Order ID</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Customer</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Herb</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Quantity</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.recentSales.map((sale, index) => (
                      <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-emerald-400 font-semibold">{sale.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-medium">{sale.customer}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-emerald-400" />
                            <span className="text-white">{sale.herb}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300">{sale.quantity}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-blue-400 font-semibold">${sale.amount}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300">{sale.date}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sale.status === 'Completed' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : sale.status === 'Processing'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Two Column Layout for Additional Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Inventory Status */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-60"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Package className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black bg-gradient-to-r from-white via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                        Inventory Status
                      </h2>
                      <p className="text-gray-400 mt-1">Current stock levels and alerts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                    <Activity className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">Live Stock</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {salesData.inventoryStatus.map((item, index) => (
                    <div key={item.herb} className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:border-yellow-500/40 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Leaf className="w-5 h-5 text-emerald-400" />
                            <div>
                              <h3 className="text-white font-semibold">{item.herb}</h3>
                              <p className="text-gray-400 text-sm">Restocked: {item.lastRestocked}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">{item.stock} kg</div>
                            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              item.status === 'Good' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {item.status}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.status === 'Good' ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{width: `${Math.min((item.stock / item.reorderLevel) * 100, 100)}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-60"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Activity className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
                        Recent Activities
                      </h2>
                      <p className="text-gray-400 mt-1">Latest system activities and alerts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm font-medium">Live Feed</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {salesData.recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon === 'ShoppingCart' ? ShoppingCart :
                                        activity.icon === 'Package' ? Package :
                                        activity.icon === 'Users' ? Users :
                                        activity.icon === 'DollarSign' ? DollarSign :
                                        activity.icon === 'Clock' ? Clock : Activity;
                    
                    return (
                      <div key={index} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:border-purple-500/40 transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              activity.type === 'order' ? 'bg-blue-500/20' :
                              activity.type === 'stock' ? 'bg-orange-500/20' :
                              activity.type === 'customer' ? 'bg-green-500/20' :
                              activity.type === 'payment' ? 'bg-emerald-500/20' :
                              activity.type === 'inventory' ? 'bg-yellow-500/20' : 'bg-purple-500/20'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${
                                activity.type === 'order' ? 'text-blue-400' :
                                activity.type === 'stock' ? 'text-orange-400' :
                                activity.type === 'customer' ? 'text-green-400' :
                                activity.type === 'payment' ? 'text-emerald-400' :
                                activity.type === 'inventory' ? 'text-yellow-400' : 'text-purple-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium leading-relaxed">{activity.message}</p>
                              <p className="text-gray-400 text-sm mt-1">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Analytics Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-60"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                      Customer Analytics
                    </h2>
                    <p className="text-gray-400 mt-1">Customer segments and performance metrics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300 text-sm font-medium">Segments</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {salesData.customerAnalytics.map((segment, index) => (
                  <div key={segment.segment} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-white/8 to-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                          index === 1 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                          'bg-gradient-to-br from-green-500 to-emerald-600'
                        }`}>
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{segment.segment}</h3>
                          <p className="text-gray-400 text-sm">{segment.count} customers</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Revenue:</span>
                          <span className="text-cyan-400 font-semibold">${segment.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Order:</span>
                          <span className="text-blue-400 font-semibold">${segment.avgOrder}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              index === 1 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                              'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                            style={{width: `${(segment.revenue / 58900) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
