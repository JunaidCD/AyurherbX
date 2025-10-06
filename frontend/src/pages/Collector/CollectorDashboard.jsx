import React, { useState, useEffect } from 'react';
import { Package, Plus, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { api } from '../../utils/api';

const CollectorDashboard = ({ user, showToast }) => {
  const [stats, setStats] = useState({
    totalCollections: 0,
    todayCollections: 0,
    pendingReports: 0,
    completedReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [newCollection, setNewCollection] = useState({
    herbName: '',
    quantity: '',
    batchId: '',
    collectorId: user?.id || 'COL-001',
    location: '',
    notes: ''
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getDashboardStats();
      setStats({
        totalCollections: response.totalCollections || 156,
        todayCollections: 12,
        pendingReports: 8,
        completedReports: 148
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmitCollection = async (e) => {
    e.preventDefault();
    try {
      const collectionData = {
        ...newCollection,
        submissionDate: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleString(),
        status: 'Queued',
        gpsCoordinates: `${(Math.random() * 90).toFixed(4)}°, ${(Math.random() * 180).toFixed(4)}°`,
        qualityGrade: 'Standard (A)'
      };

      await api.addCollection(collectionData);
      showToast('Collection report submitted successfully!', 'success');
      setShowNewCollectionForm(false);
      setNewCollection({
        herbName: '',
        quantity: '',
        batchId: '',
        collectorId: user?.id || 'COL-001',
        location: '',
        notes: ''
      });
      loadStats();
    } catch (error) {
      showToast('Failed to submit collection report', 'error');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Collector Dashboard
            </h1>
            <p className="text-gray-400 text-lg mt-2">
              Welcome back, {user?.name || 'Collector'}! Manage your herb collection reports.
            </p>
          </div>
          
          <button
            onClick={() => setShowNewCollectionForm(true)}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
          >
            <Plus className="w-5 h-5" />
            New Collection Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.totalCollections}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Total Collections</h3>
            <p className="text-gray-400 text-sm">All time reports</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.todayCollections}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Today's Collections</h3>
            <p className="text-gray-400 text-sm">Reports submitted today</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.pendingReports}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Pending Reports</h3>
            <p className="text-gray-400 text-sm">Awaiting verification</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.completedReports}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Completed Reports</h3>
            <p className="text-gray-400 text-sm">Successfully verified</p>
          </div>
        </div>

      </div>

      {/* New Collection Form Modal */}
      {showNewCollectionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">New Collection Report</h2>
            
            <form onSubmit={handleSubmitCollection} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Herb Name</label>
                <select
                  value={newCollection.herbName}
                  onChange={(e) => setNewCollection({...newCollection, herbName: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">Select herb</option>
                  <option value="Ashwagandha">Ashwagandha</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Brahmi">Brahmi</option>
                  <option value="Neem">Neem</option>
                  <option value="Tulsi">Tulsi</option>
                  <option value="Ginger">Ginger</option>
                  <option value="Allovera">Allovera</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Quantity</label>
                <input
                  type="text"
                  value={newCollection.quantity}
                  onChange={(e) => setNewCollection({...newCollection, quantity: e.target.value})}
                  placeholder="e.g., 25kg"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Batch ID</label>
                <input
                  type="text"
                  value={newCollection.batchId}
                  onChange={(e) => setNewCollection({...newCollection, batchId: e.target.value})}
                  placeholder="e.g., BAT-2024-001"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Collector ID</label>
                <input
                  type="text"
                  value={newCollection.collectorId}
                  onChange={(e) => setNewCollection({...newCollection, collectorId: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={newCollection.location}
                  onChange={(e) => setNewCollection({...newCollection, location: e.target.value})}
                  placeholder="e.g., Kerala, India"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={newCollection.notes}
                  onChange={(e) => setNewCollection({...newCollection, notes: e.target.value})}
                  placeholder="Additional notes about the collection..."
                  rows="3"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCollectionForm(false)}
                  className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorDashboard;
