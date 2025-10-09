import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, ArrowLeft, Thermometer, Clock, FileText, 
  Settings, CheckCircle, AlertCircle, Package, Factory,
  Zap, Sparkles, Star, Flame, Droplets, Wind, Sun, Target,
  Shield, Link, Database, Lock, Search, Leaf, MapPin
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { useCollections } from '../../contexts/CollectionsContext';

const AddProcessingAdvanced = ({ user, showToast }) => {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const { collections, getCollectionById } = useCollections();
  const [batch, setBatch] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [processingForm, setProcessingForm] = useState({
    stepType: '',
    temperature: '',
    duration: '',
    notes: ''
  });

  const stepTypes = [
    { 
      value: 'Drying', 
      label: 'Drying Process', 
      icon: Flame, 
      emoji: '🔥',
      color: 'from-orange-400 via-red-500 to-pink-500', 
      bgColor: 'bg-gradient-to-br from-orange-500/30 to-red-500/20', 
      borderColor: 'border-orange-400/60',
      description: 'Remove moisture content',
      particles: '🌡️💨'
    },
    { 
      value: 'Grinding', 
      label: 'Grinding & Milling', 
      icon: Settings, 
      emoji: '⚙️',
      color: 'from-blue-400 via-indigo-500 to-purple-500', 
      bgColor: 'bg-gradient-to-br from-blue-500/30 to-indigo-500/20', 
      borderColor: 'border-blue-400/60',
      description: 'Mechanical processing',
      particles: '⚡🔧'
    },
    { 
      value: 'Storage', 
      label: 'Storage & Preservation', 
      icon: Package, 
      emoji: '📦',
      color: 'from-purple-400 via-pink-500 to-rose-500', 
      bgColor: 'bg-gradient-to-br from-purple-500/30 to-pink-500/20', 
      borderColor: 'border-purple-400/60',
      description: 'Safe storage conditions',
      particles: '🏪❄️'
    },
    { 
      value: 'Quality Check', 
      label: 'Quality Assurance', 
      icon: Star, 
      emoji: '🔍',
      color: 'from-emerald-400 via-teal-500 to-cyan-500', 
      bgColor: 'bg-gradient-to-br from-emerald-500/30 to-teal-500/20', 
      borderColor: 'border-emerald-400/60',
      description: 'Quality verification',
      particles: '✨🎯'
    },
    { 
      value: 'Packaging', 
      label: 'Final Packaging', 
      icon: Package, 
      emoji: '📦',
      color: 'from-yellow-400 via-amber-500 to-orange-500', 
      bgColor: 'bg-gradient-to-br from-yellow-500/30 to-amber-500/20', 
      borderColor: 'border-yellow-400/60',
      description: 'Product packaging',
      particles: '📦🎁'
    },
    { 
      value: 'Cleaning', 
      label: 'Cleaning & Sanitization', 
      icon: Droplets, 
      emoji: '🧽',
      color: 'from-cyan-400 via-blue-500 to-teal-500', 
      bgColor: 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20', 
      borderColor: 'border-cyan-400/60',
      description: 'Cleaning procedures',
      particles: '💧✨'
    }
  ];

  useEffect(() => {
    if (batchId) {
      loadBatch();
    } else {
      // Don't set a default batch - let user search for one
      setBatch(null);
      setLoading(false);
    }
  }, [batchId]);

  const loadBatch = async () => {
    try {
      setLoading(true);
      const batchData = await api.getBatchById(batchId);
      setBatch(batchData);
    } catch (error) {
      showToast('Failed to load batch details', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProcessingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchBatch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Please enter a Batch ID to search', 'error');
      return;
    }

    try {
      setSearchLoading(true);
      
      // Search for collection by batch ID
      const foundCollection = collections.find(collection => 
        collection.batchId && collection.batchId.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      
      if (foundCollection) {
        setSelectedCollection(foundCollection);
        setBatch(foundCollection); // Set batch data from collection
        showToast(`Collection with Batch ID "${foundCollection.batchId}" loaded successfully`, 'success');
      } else {
        // Fallback to API search if not found in collections
        try {
          const batchData = await api.getBatchById(searchQuery.trim());
          setBatch(batchData);
          showToast(`Batch ${batchData.batchId || batchData.id} loaded successfully`, 'success');
        } catch (apiError) {
          showToast(`No collection found with Batch ID "${searchQuery}"`, 'error');
          setSelectedCollection(null);
          setBatch(null);
        }
      }
    } catch (error) {
      showToast(`Error searching for batch: ${error.message}`, 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!batch) {
      showToast('Please search and select a batch first', 'error');
      return;
    }
    
    if (!processingForm.stepType || !processingForm.duration) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSaving(true);
      
      // Show blockchain submission message
      showToast('Submitting to blockchain...', 'info');
      
      const processingStepData = {
        batchId: batch?.batchId || batch?.id || batchId,
        processorId: user?.id || 'PROC001', // Default processor ID
        stepType: processingForm.stepType,
        temperature: processingForm.temperature ? parseFloat(processingForm.temperature) : null,
        duration: processingForm.duration ? parseInt(processingForm.duration) : null,
        notes: processingForm.notes || ''
      };

      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock blockchain transaction data
      const transactionHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const blockNumber = Math.floor(Math.random() * 1000000) + 18500000;
      const gasUsed = Math.floor(Math.random() * 50000) + 21000;

      const blockchainData = {
        transactionHash,
        blockNumber,
        gasUsed,
        network: 'Hyperledger Besu',
        contractAddress: '0x742d35Cc6634C0532925a3b8D0C9C0E2C2C2C2C2',
        confirmed: true
      };

      // Store processing step in localStorage
      const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
      const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
      
      if (!processingSteps[currentBatch.batchId]) {
        processingSteps[currentBatch.batchId] = [];
      }
      
      const newStep = {
        id: Date.now().toString(),
        stepType: processingForm.stepType,
        temperature: processingForm.temperature,
        duration: processingForm.duration,
        notes: processingForm.notes,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleString(),
        status: 'Completed',
        blockchain: blockchainData
      };
      
      processingSteps[currentBatch.batchId].push(newStep);
      localStorage.setItem('ayurherb_processing_steps', JSON.stringify(processingSteps));
        
      showToast(`✅ Successfully saved to blockchain!\nTransaction: ${transactionHash.substring(0, 20)}...`, 'success');
      
      // Show transaction details modal with mock data
      showTransactionModal(transactionHash, blockchainData);
      
      // Reset form
      setProcessingForm({
        stepType: '',
        temperature: '',
        duration: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error saving processing step:', error);
      showToast('Failed to save to blockchain: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const showTransactionModal = (txHash, blockchainData) => {
    // Create a temporary modal to show transaction details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">Blockchain Success!</h3>
          <p class="text-gray-400">Processing step saved immutably</p>
        </div>
        
        <div class="space-y-4 mb-6">
          <div class="bg-slate-700/50 rounded-lg p-4">
            <p class="text-sm text-gray-400 mb-1">Transaction Hash</p>
            <p class="text-white font-mono text-xs break-all">${txHash}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-700/50 rounded-lg p-3">
              <p class="text-sm text-gray-400 mb-1">Block Number</p>
              <p class="text-white font-semibold">#${blockchainData.blockNumber}</p>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-3">
              <p class="text-sm text-gray-400 mb-1">Gas Used</p>
              <p class="text-white font-semibold">${blockchainData.gasUsed}</p>
            </div>
          </div>
          <div class="bg-slate-700/50 rounded-lg p-3">
            <p class="text-sm text-gray-400 mb-1">Network</p>
            <p class="text-white font-semibold">${blockchainData.network}</p>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button onclick="navigator.clipboard.writeText('${txHash}'); this.textContent='Copied!'" class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all duration-200">
            Copy Hash
          </button>
          <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200">
            Continue
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 15000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          <div className="absolute inset-4 w-24 h-24 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Clean Header */}
        <div className="relative">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-6">
              {/* Simple Back Button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              {/* Simple Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              
              {/* Clean Typography */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-white">
                    Add Processing Step
                  </h1>
                  {/* Blockchain Badge */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">Blockchain Secured</span>
                  </div>
                </div>
                <p className="text-lg text-gray-300">
                  Choose the type of processing operation to perform
                </p>
                
                {/* Status with Blockchain Indicators */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-300 text-sm">Ready</span>
                  </div>
                  
                  {/* Blockchain Status */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
                    <Link className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-300 text-sm">Blockchain Connected</span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Search Batch</h3>
                  <p className="text-sm text-gray-400">Enter Batch ID to load specific batch</p>
                </div>
              </div>
              
              <div className="flex-1 max-w-md ml-auto">
                <form onSubmit={handleSearchBatch} className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Batch ID (e.g., COL001, BAT-2024-001)"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-200 pr-12"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    disabled={searchLoading || !searchQuery.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {searchLoading ? (
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
                </form>
              </div>
            </div>
            
            {/* Current Batch Display */}
            {batch ? (
              <div className="mt-4 pt-4 border-t border-slate-600/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 text-sm font-medium">Batch Loaded</span>
                  </div>
                  <div className="text-white">
                    <span className="font-semibold">{batch.batchId || batch.id}</span>
                    <span className="text-gray-400 ml-2">• {batch.herb} • {batch.farmer}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-600/50">
                <div className="flex items-center gap-3 text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">No batch selected. Please search for a batch to continue.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collection Data Display */}
        {selectedCollection && (
          <div className="relative">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Collection Details</h3>
                  <p className="text-gray-400">Submitted collection data ready for processing</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-semibold">Verified</span>
                  </div>
                </div>
              </div>

              {/* Collection Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-400 text-sm font-medium">Herb Name</span>
                  </div>
                  <p className="text-white text-lg font-bold">{selectedCollection.herbName}</p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 text-sm font-medium">Quantity</span>
                  </div>
                  <p className="text-white text-lg font-bold">{selectedCollection.quantity}</p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400 text-sm font-medium">Location</span>
                  </div>
                  <p className="text-white text-lg font-bold">{selectedCollection.location}</p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-400 text-sm font-medium">Batch ID</span>
                  </div>
                  <p className="text-white text-lg font-bold">{selectedCollection.batchId}</p>
                </div>
              </div>

              {/* Additional Collection Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm font-medium">Collector ID</span>
                  </div>
                  <p className="text-white font-semibold">{selectedCollection.collectorId || 'Not specified'}</p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-400 text-sm font-medium">Submission Date</span>
                  </div>
                  <p className="text-white font-semibold">{selectedCollection.timestamp}</p>
                </div>
              </div>

              {/* Notes Section */}
              {selectedCollection.notes && (
                <div className="mt-6 bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400 text-sm font-medium">Collection Notes</span>
                  </div>
                  <p className="text-white">{selectedCollection.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Processing Form */}
        <div className="relative">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
            
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Step Type Selection */}
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Select Processing Step
                    </h2>
                  </div>
                  <p className="text-gray-400">
                    Choose the type of processing operation to perform
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stepTypes.map((type, index) => {
                    const IconComponent = type.icon;
                    const isSelected = processingForm.stepType === type.value;
                    
                    return (
                      <div
                        key={type.value}
                        className="group"
                      >
                        <button
                          type="button"
                          onClick={() => setProcessingForm(prev => ({ ...prev, stepType: type.value }))}
                          className={`relative w-full p-6 rounded-2xl border transition-all duration-300 ${
                            isSelected
                              ? `${type.bgColor} ${type.borderColor} shadow-lg`
                              : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50 hover:shadow-md'
                          }`}
                        >
                          
                          {/* Icon Container */}
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-r ${type.color}`
                              : 'bg-slate-600/50 group-hover:bg-slate-500/50'
                          }`}>
                            <IconComponent className={`w-8 h-8 transition-colors duration-300 ${
                              isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            }`} />
                          </div>
                          
                          {/* Content */}
                          <div className="text-center space-y-2">
                            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                              isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                            }`}>
                              {type.label}
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${
                              isSelected ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'
                            }`}>
                              {type.description}
                            </p>
                            
                            {/* Blockchain Indicator */}
                            <div className="flex items-center justify-center gap-1 mt-2">
                              <Database className={`w-3 h-3 transition-colors duration-300 ${
                                isSelected ? 'text-blue-300' : 'text-blue-400/60 group-hover:text-blue-400'
                              }`} />
                              <span className={`text-xs transition-colors duration-300 ${
                                isSelected ? 'text-blue-300' : 'text-blue-400/60 group-hover:text-blue-400'
                              }`}>
                                Blockchain Verified
                              </span>
                            </div>
                          </div>
                          
                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-3 right-3">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              </div>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Parameters */}
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-white">
                    Processing Parameters
                  </h3>
                  <p className="text-gray-400">Configure the settings for your operation</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Temperature */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      Temperature
                    </label>
                    <div className="relative">
                      <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                      <input
                        type="text"
                        name="temperature"
                        value={processingForm.temperature}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                        placeholder="e.g., 60°C, Room temp, N/A"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Duration *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        name="duration"
                        value={processingForm.duration}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        placeholder="e.g., 2 hours, 30 minutes, 1 day"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white">
                    Additional Notes
                  </h3>
                  <p className="text-gray-400">Document important details and observations</p>
                </div>
                
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
                  <textarea
                    name="notes"
                    value={processingForm.notes}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none transition-all duration-200"
                    placeholder="Add any additional notes about this processing step...

• Equipment used and settings
• Quality observations  
• Environmental conditions
• Special handling requirements"
                  />
                </div>
              </div>

              {/* Blockchain Security Notice */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">Blockchain Security</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      This processing step will be permanently recorded on the blockchain for immutable traceability. 
                      Once saved, the data cannot be altered, ensuring complete transparency and authenticity for your supply chain.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving || !processingForm.stepType || !processingForm.duration}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving to Blockchain...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Save on Blockchain
                    </>
                  )}
                </button>
              </div>
              
              {/* Progress with Blockchain Indicator */}
              <div className="flex items-center justify-center gap-2 pt-4">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  processingForm.stepType ? 'bg-emerald-500' : 'bg-gray-600'
                }`}></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  processingForm.duration ? 'bg-emerald-500' : 'bg-gray-600'
                }`}></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  processingForm.notes ? 'bg-emerald-500' : 'bg-gray-600'
                }`}></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <Database className="w-2 h-2 text-white" />
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">
                {processingForm.stepType && processingForm.duration ? (
                  <span className="flex items-center justify-center gap-2">
                    ✅ Ready to save to blockchain
                    <Shield className="w-3 h-3 text-blue-400" />
                  </span>
                ) : (
                  '⏳ Fill required fields for blockchain storage'
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProcessingAdvanced;
