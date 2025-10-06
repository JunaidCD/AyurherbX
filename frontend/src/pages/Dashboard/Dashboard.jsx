import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  CheckCircle,
  Calendar,
  TrendingUp,
  Leaf
} from 'lucide-react';

const Dashboard = ({ user, showToast }) => {
  const navigate = useNavigate();

  // Check user role for different dashboard types
  const userRole = user?.role;
  const isProcessor = userRole === 'Processor';
  const isLabTester = userRole === 'Lab Tester';
  const isAdmin = userRole === 'Admin';
  const isCustomer = userRole === 'Customer';
  const isCollector = userRole === 'Collector';

  // Debug log to verify role detection
  console.log('Dashboard - User role:', userRole, 'isProcessor:', isProcessor, 'isLabTester:', isLabTester, 'isAdmin:', isAdmin);

  // Dummy data for dashboard
  const stats = {
    totalCollections: 1547,
    todayCollections: 12,
    pendingReports: 8,
    completedReports: 148
  };

  const handleNewCollection = () => {
    navigate('/collections');
    showToast('Redirecting to New Collection form...', 'info');
  };

  // Processor Dashboard - Simple Empty State
  if (isProcessor) {
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
                    New Item will appear here
                  </h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Lab Tester Dashboard - Simple Empty State
  if (isLabTester) {
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
                    New content For Dashboard will appear here
                  </h3>
                </div>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    {stats.totalCollections}
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

          {/* Pending Reports Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-red-500/10 backdrop-blur-xl border-2 border-yellow-500/30 rounded-3xl p-8 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent mb-1">
                    {stats.pendingReports}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <span>Processing</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">Pending Reports</h3>
                <p className="text-yellow-300/80 text-sm font-medium">Awaiting verification</p>
                <div className="w-full h-2 bg-yellow-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse" style={{width: '40%'}}></div>
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
                    {stats.completedReports}
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

            {/* Enhanced Empty State */}
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
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
