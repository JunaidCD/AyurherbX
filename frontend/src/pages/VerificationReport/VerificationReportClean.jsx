import React, { useState } from 'react';
import { Shield, FileCheck, Database, Award, Search, CheckCircle, Beaker, Package, Leaf, MapPin, Calendar, Factory, XCircle, Clock, Copy } from 'lucide-react';

const VerificationReport = ({ user, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

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
      
      const storedCollections = localStorage.getItem('ayurherb_collections');
      const collectionsData = storedCollections ? JSON.parse(storedCollections) : [];

      // Create comprehensive herb data with IDs
      const herbData = collectionsData.map(collection => {
        const batchId = collection.batchId || collection.id;
        const processing = processingSteps[batchId] || [];
        const tests = labTests[batchId] || [];
        
        return {
          ...collection,
          batchId,
          herbId: generateHerbId(collection.herbName),
          processingSteps: processing,
          labTests: tests,
          hasProcessing: processing.length > 0,
          hasTesting: tests.length > 0,
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
    </div>
  );
};

export default VerificationReport;
