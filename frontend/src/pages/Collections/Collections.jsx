import React, { useState } from 'react';
import { Database, X, Plus } from 'lucide-react';

const Collections = ({ user, showToast }) => {
  const [formData, setFormData] = useState({
    herbName: '',
    quantity: '',
    batchId: '',
    collectorId: '',
    location: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage for demo purposes
      const collections = JSON.parse(localStorage.getItem('ayurherb_collections') || '[]');
      const newCollection = {
        id: `COL-${Date.now()}`,
        ...formData,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Queued',
        timestamp: new Date().toLocaleString()
      };
      
      collections.push(newCollection);
      localStorage.setItem('ayurherb_collections', JSON.stringify(collections));
      
      showToast('Collection report submitted successfully!', 'success');
      
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
      showToast('Failed to submit collection report', 'error');
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
    <div className="min-h-screen bg-dark-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Collection Reports</h1>
            <p className="text-gray-400">Submit new herb collection data</p>
          </div>
        </div>
      </div>

      {/* New Collection Report Form */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Glassmorphism background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">New Collection Report</h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Herb Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Herb Name
                </label>
                <select
                  name="herbName"
                  value={formData.herbName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Herb</option>
                  <option value="Allovera">Allovera</option>
                  <option value="Brahmi">Brahmi</option>
                  <option value="Ashwagandha">Ashwagandha</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Neem">Neem</option>
                  <option value="Tulsi">Tulsi</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 25kg"
                  required
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Batch ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Batch ID
                </label>
                <input
                  type="text"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleInputChange}
                  placeholder="e.g., BAT-2024-001"
                  required
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Collector ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Collector ID
                </label>
                <input
                  type="text"
                  name="collectorId"
                  value={formData.collectorId}
                  onChange={handleInputChange}
                  placeholder="1"
                  required
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Kerala, India"
                  required
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Notes (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about the collection..."
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-gray-300 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Submit Report
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
