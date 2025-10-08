import React, { useState } from 'react';
import { Database, X, Plus, Wallet, ExternalLink } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import WalletButton from '../../components/WalletButton/WalletButton';

const Collections = ({ user, showToast }) => {
  const {
    account,
    isConnected,
    submitCollection,
    isOnSepolia
  } = useWallet();

  const [formData, setFormData] = useState({
    herbName: '',
    quantity: '',
    batchId: '',
    collectorId: '',
    location: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check wallet connection
    if (!isConnected) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    // Check network
    if (!isOnSepolia()) {
      showToast('Please switch to Sepolia testnet', 'error');
      return;
    }

    // Validate form data
    if (!formData.herbName || !formData.quantity || !formData.batchId || !formData.location) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    setTransactionResult(null);

    try {
      showToast('Submitting to blockchain...', 'info');
      
      // Submit to blockchain via wallet
      const result = await submitCollection(formData);
      
      setTransactionResult(result);
      showToast('Collection submitted to blockchain successfully!', 'success');
      
      // Reset form
      setFormData({
        herbName: '',
        quantity: '',
        batchId: '',
        collectorId: '',
        location: '',
        notes: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      showToast(`Failed to submit collection: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      herbName: '',
      quantity: '',
      batchId: '',
      collectorId: '',
      location: '',
      notes: ''
    });
    showToast('Form cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      
      {/* Enhanced Header */}
      <div className="relative mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/30 to-teal-500/30 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Database className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-2">
                Collection Reports
              </h1>
              <p className="text-xl text-gray-400 font-light">Submit new herb collection data</p>
            </div>
          </div>
          {/* Wallet Button in Top Right */}
          <div className="flex items-center gap-4">
            <WalletButton showToast={showToast} />
          </div>
        </div>

        {/* Enhanced Information Section */}
        <div className="relative mb-16">
          {/* Blockchain Verified Badge */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative inline-flex items-center gap-6 px-12 py-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 rounded-full backdrop-blur-sm">
                <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                <span className="text-emerald-300 font-bold text-2xl">Blockchain Verified</span>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Process Steps */}
          <div className="max-w-7xl mx-auto">
            {/* Improved Header Section */}
            <div className="text-center mb-20">
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl animate-pulse"></div>
                <h3 className="relative text-5xl font-black bg-gradient-to-r from-white via-emerald-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  How it works
                </h3>
              </div>
              <p className="text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                Simple and secure steps to submit your herb collection data to the blockchain
              </p>
            </div>
            
            <div className="relative">
              {/* Advanced Connection System */}
              <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                {/* Background line */}
                <div className="h-2 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-full"></div>
                {/* Animated overlay line */}
                <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                {/* Connection dots */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-lg animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-lg animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                {/* Step 1 - Premium Design */}
                <div className="group relative">
                  <div className="text-center">
                    {/* Enhanced step container */}
                    <div className="relative mb-10">
                      {/* Outer glow ring */}
                      <div className="absolute -inset-6 bg-gradient-to-r from-emerald-400/30 to-emerald-600/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                      {/* Main step circle */}
                      <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 border-4 border-emerald-400/30">
                        <span className="text-white text-3xl font-black">1</span>
                      </div>
                      {/* Bottom accent line */}
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg"></div>
                      {/* Floating particles */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-all duration-500" style={{animationDelay: '0.1s'}}></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-all duration-500" style={{animationDelay: '0.3s'}}></div>
                    </div>
                    
                    {/* Enhanced content */}
                    <div className="space-y-6">
                      <h4 className="text-3xl font-bold text-white mb-6 group-hover:text-emerald-300 transition-all duration-300 group-hover:scale-105">
                        Fill Details
                      </h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-6 group-hover:w-24 transition-all duration-300"></div>
                      <p className="text-xl text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 max-w-sm mx-auto font-medium">
                        Complete the collection form with detailed herb information and specifications
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 - Premium Design */}
                <div className="group relative">
                  <div className="text-center">
                    {/* Enhanced step container */}
                    <div className="relative mb-10">
                      {/* Outer glow ring */}
                      <div className="absolute -inset-6 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                      {/* Main step circle */}
                      <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 border-4 border-blue-400/30">
                        <span className="text-white text-3xl font-black">2</span>
                      </div>
                      {/* Bottom accent line */}
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg"></div>
                      {/* Floating particles */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-all duration-500" style={{animationDelay: '0.1s'}}></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-all duration-500" style={{animationDelay: '0.3s'}}></div>
                    </div>
                    
                    {/* Enhanced content */}
                    <div className="space-y-6">
                      <h4 className="text-3xl font-bold text-white mb-6 group-hover:text-blue-300 transition-all duration-300 group-hover:scale-105">
                        Auto Location
                      </h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 group-hover:w-24 transition-all duration-300"></div>
                      <p className="text-xl text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 max-w-sm mx-auto font-medium">
                        Your precise location is automatically detected and verified for authenticity
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 - Premium Design */}
                <div className="group relative">
                  <div className="text-center">
                    {/* Enhanced step container */}
                    <div className="relative mb-10">
                      {/* Outer glow ring */}
                      <div className="absolute -inset-6 bg-gradient-to-r from-purple-400/30 to-purple-600/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                      {/* Main step circle */}
                      <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 border-4 border-purple-400/30">
                        <span className="text-white text-3xl font-black">3</span>
                      </div>
                      {/* Bottom accent line */}
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg"></div>
                      {/* Floating particles */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-all duration-500" style={{animationDelay: '0.1s'}}></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-all duration-500" style={{animationDelay: '0.3s'}}></div>
                    </div>
                    
                    {/* Enhanced content */}
                    <div className="space-y-6">
                      <h4 className="text-3xl font-bold text-white mb-6 group-hover:text-purple-300 transition-all duration-300 group-hover:scale-105">
                        Blockchain Record
                      </h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 group-hover:w-24 transition-all duration-300"></div>
                      <p className="text-xl text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 max-w-sm mx-auto font-medium">
                        Data is securely recorded on the blockchain for permanent transparency and trust
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Collection Report Form */}
      <div className="relative max-w-3xl mx-auto">
        {/* Floating background elements for form */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative">
          {/* Enhanced Glassmorphism background */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl animate-pulse"></div>
          
          <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-10 shadow-2xl">
            {/* Enhanced Form Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    New Collection Report
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Fill in the details to submit your herb collection</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Herb Name */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Herb Name
                </label>
                <input
                  type="text"
                  name="herbName"
                  value={formData.herbName}
                  onChange={handleInputChange}
                  placeholder="Enter herb name (e.g., Allovera, Brahmi, Ashwagandha)"
                  required
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/30 backdrop-blur-sm"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 25kg"
                  required
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/30 backdrop-blur-sm"
                />
              </div>

              {/* Batch ID */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Batch ID
                </label>
                <input
                  type="text"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleInputChange}
                  placeholder="e.g., BAT-2024-001"
                  required
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/30 backdrop-blur-sm"
                />
              </div>

              {/* Collector ID */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Collector ID
                </label>
                <input
                  type="text"
                  name="collectorId"
                  value={formData.collectorId}
                  onChange={handleInputChange}
                  placeholder="1"
                  required
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/30 backdrop-blur-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Kerala, India"
                  required
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/30 backdrop-blur-sm"
                />
              </div>

              {/* Notes (Optional) */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about the collection..."
                  rows={4}
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/30 backdrop-blur-sm resize-none"
                />
              </div>

              {/* Wallet Connection Status */}
              {!isConnected && (
                <div className="mb-6 p-4 bg-yellow-500/20 border-2 border-yellow-500/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-yellow-300 font-semibold">Wallet Required</div>
                      <div className="text-yellow-400 text-sm">Connect your wallet to submit collections to the blockchain</div>
                    </div>
                  </div>
                </div>
              )}

              {isConnected && !isOnSepolia() && (
                <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-red-400" />
                    <div>
                      <div className="text-red-300 font-semibold">Wrong Network</div>
                      <div className="text-red-400 text-sm">Please switch to Sepolia testnet to submit collections</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Result */}
              {transactionResult && (
                <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-500/30 rounded-2xl">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-green-300 font-semibold">Collection Submitted Successfully!</div>
                        <div className="text-green-400 text-sm">Your collection has been recorded on the blockchain</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Collection ID:</div>
                        <div className="text-white font-mono">{transactionResult.collectionId}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Transaction:</div>
                        <div className="flex items-center gap-2">
                          <code className="text-white font-mono text-xs">
                            {transactionResult.transactionHash?.slice(0, 10)}...
                          </code>
                          <button
                            onClick={() => window.open(transactionResult.explorerUrl, '_blank')}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-400 hover:text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Form Actions */}
              <div className="flex gap-6 pt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/30 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isConnected || !isOnSepolia()}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting to Blockchain...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {isConnected ? 'Submit to Blockchain' : 'Connect Wallet First'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
