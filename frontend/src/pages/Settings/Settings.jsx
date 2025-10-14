import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Database, Lock, Globe,
  Smartphone, Mail, Key, Eye, EyeOff, Palette, Monitor, Moon, Sun,
  Languages, RefreshCw, Download, Upload, Trash2, Save, Check,
  AlertTriangle, Info, Zap, Activity, Sparkles, Wallet, BarChart3,
  Clock, Cpu, HardDrive, Wifi, Camera, Fingerprint, CreditCard,
  Link, Share2, Layers, Grid3X3, Sliders, Filter, Search, Star,
  TrendingUp, Award, Target, Gamepad2, Headphones, Volume2
} from 'lucide-react';
import Card from '../../components/UI/Card';

const Settings = ({ user, showToast }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    darkMode: true,
    autoSync: true,
    language: 'English',
    twoFactor: false,
    biometric: false,
    autoBackup: true,
    analytics: true,
    performance: 'balanced',
    theme: 'dark',
    soundEffects: true,
    hapticFeedback: true
  });

  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleTabChange = (tabId) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsAnimating(false);
    }, 150);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Personal information and account details',
      badge: null
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      color: 'from-emerald-500 to-primary-500',
      description: 'Manage alerts and communication preferences',
      badge: '3'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield, 
      color: 'from-yellow-500 to-orange-500',
      description: 'Password, authentication and privacy settings',
      badge: null
    },
    { 
      id: 'blockchain', 
      label: 'Blockchain', 
      icon: Wallet, 
      color: 'from-purple-500 to-pink-500',
      description: 'Wallet connections and blockchain preferences',
      badge: 'New'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      color: 'from-indigo-500 to-purple-500',
      description: 'Data insights and performance metrics',
      badge: null
    },
    { 
      id: 'system', 
      label: 'System', 
      icon: Database, 
      color: 'from-slate-500 to-gray-500',
      description: 'Application preferences and data management',
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header with Search and Stats */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-purple-500/30 to-emerald-500/30 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 via-purple-500 to-emerald-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 via-purple-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                    <SettingsIcon className={`w-10 h-10 text-white ${isAnimating ? 'animate-spin' : ''}`} />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-3">
                    Advanced Settings
                  </h1>
                  <p className="text-xl text-gray-300 font-light mb-4">
                    Complete control over your AyurHerb experience
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-300 text-sm font-medium">Auto-sync Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm font-medium">Secure Connection</span>
                    </div>
                    <div className="text-gray-400 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last sync: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200 group">
                    <RefreshCw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200 group">
                    <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Save className="w-5 h-5" />
                    Save All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation with Cards */}
        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative group p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-br ${tab.color} border-white/30 shadow-2xl scale-105`
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Badge */}
                  {tab.badge && (
                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-bounce">
                      {tab.badge}
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-white/20' 
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <Icon className={`w-6 h-6 transition-all duration-300 ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} />
                  </div>
                  
                  {/* Content */}
                  <div className="text-left">
                    <h3 className={`font-semibold mb-2 transition-all duration-300 ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {tab.label}
                    </h3>
                    <p className={`text-sm transition-all duration-300 ${
                      activeTab === tab.id ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-400'
                    }`}>
                      {tab.description}
                    </p>
                  </div>
                  
                  {/* Active Indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tab Content with Enhanced Animation */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-3xl blur-xl"></div>
          <div className={`relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 ${isAnimating ? 'scale-[0.99] opacity-90' : 'scale-100 opacity-100'}`}>
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    <p className="text-gray-400">Manage your personal details and account information</p>
                  </div>
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Picture */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                        {(user?.name || 'U').charAt(0)}
                      </div>
                      <button className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-200">
                        <Upload className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">Click to upload new profile picture</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'Junaid'}
                      className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        defaultValue={user?.email || 'junaid@ayurherb.com'}
                        className="w-full py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Role</label>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                      <Shield className="w-5 h-5 text-primary-400" />
                      <span className="text-white font-medium">{user?.role || 'Administrator'}</span>
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full ml-auto">Active</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-primary-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
                  <p className="text-gray-400">Control how and when you receive notifications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Email Notifications */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Email Notifications
                  </h3>
                  
                  {[
                    { label: 'System Updates', desc: 'Important system announcements', enabled: true },
                    { label: 'Security Alerts', desc: 'Login attempts and security issues', enabled: true },
                    { label: 'Weekly Reports', desc: 'Weekly summary of activities', enabled: false },
                    { label: 'Marketing', desc: 'Product updates and promotions', enabled: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Push & SMS Notifications */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    Push & SMS Alerts
                  </h3>
                  
                  {[
                    { label: 'Push Notifications', desc: 'Browser and mobile notifications', enabled: true },
                    { label: 'SMS Alerts', desc: 'Critical alerts via text message', enabled: false },
                    { label: 'Emergency Alerts', desc: 'Urgent system notifications', enabled: true },
                    { label: 'Batch Updates', desc: 'Supply chain status changes', enabled: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                  <p className="text-gray-400">Protect your account with advanced security features</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Password & Authentication */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-yellow-400" />
                    Password & Authentication
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="w-full py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-sm transition-all duration-200"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-200">
                      Change Password
                    </button>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Two-Factor Authentication</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Add an extra layer of security to your account</p>
                      <button className="w-full py-2 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 rounded-lg transition-all duration-200">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Actions */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" />
                    Security Actions
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Active Sessions</h4>
                      <p className="text-gray-400 text-sm mb-4">Manage devices that are currently logged in</p>
                      <button className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-200">
                        View All Sessions
                      </button>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Danger Zone</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Irreversible actions that affect your account</p>
                      <button className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-200">
                        Revoke All Sessions
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Login History</h4>
                      <p className="text-gray-400 text-sm mb-4">Review recent login attempts</p>
                      <button className="w-full py-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-lg transition-all duration-200">
                        View Login History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">System Preferences</h2>
                  <p className="text-gray-400">Customize your application experience and data handling</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appearance */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-400" />
                    Appearance
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Dark Mode</p>
                          <p className="text-gray-400 text-sm">Use dark theme across the application</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
                      <div className="relative">
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select className="w-full py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200">
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data & Sync */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    Data & Synchronization
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-white font-medium">Auto-sync Data</p>
                        <p className="text-gray-400 text-sm">Automatically sync data across devices</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Data Export</h4>
                      <p className="text-gray-400 text-sm mb-4">Download your data for backup or migration</p>
                      <button className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </button>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Clear Cache</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Clear application cache and temporary files</p>
                      <button className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-200">
                        Clear All Cache
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blockchain Tab */}
          {activeTab === 'blockchain' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Blockchain Settings</h2>
                  <p className="text-gray-400">Manage wallet connections and blockchain preferences</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Wallet Management */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-purple-400" />
                    Wallet Management
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">MetaMask</h4>
                          <p className="text-gray-400 text-sm">Connected • Sepolia Testnet</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm">Active</span>
                        </div>
                      </div>
                      <button className="w-full py-2 px-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded-lg transition-all duration-200">
                        Manage Connection
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Network Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Auto-switch Networks</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Gas Optimization</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-pink-400" />
                    Transaction Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-4">Gas Price Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <span className="text-white font-medium">Standard</span>
                            <p className="text-gray-400 text-sm">~30 seconds</p>
                          </div>
                          <input type="radio" name="gasPrice" defaultChecked className="text-purple-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <span className="text-white font-medium">Fast</span>
                            <p className="text-gray-400 text-sm">~15 seconds</p>
                          </div>
                          <input type="radio" name="gasPrice" className="text-purple-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <span className="text-white font-medium">Instant</span>
                            <p className="text-gray-400 text-sm">~5 seconds</p>
                          </div>
                          <input type="radio" name="gasPrice" className="text-purple-500" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Link className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-medium">Transaction History</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">View all your blockchain transactions</p>
                      <button className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-200">
                        View on Etherscan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
                  <p className="text-gray-400">Monitor your activity and performance metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Data Collection */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    Data Collection
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Usage Analytics', desc: 'Track feature usage and performance', enabled: true },
                      { label: 'Error Reporting', desc: 'Automatic crash and error reporting', enabled: true },
                      { label: 'Performance Metrics', desc: 'Monitor app performance and speed', enabled: false },
                      { label: 'User Behavior', desc: 'Analyze user interaction patterns', enabled: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reports & Insights */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Reports & Insights
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                        <span className="text-indigo-400 font-medium">Weekly Report</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Get detailed weekly activity reports</p>
                      <button className="w-full py-2 px-4 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 rounded-lg transition-all duration-200">
                        Generate Report
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Export Options</h4>
                      <div className="space-y-3">
                        <button className="w-full py-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Export CSV
                        </button>
                        <button className="w-full py-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Export PDF
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Target className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Performance Score</span>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-emerald-400 font-bold">85%</span>
                      </div>
                      <p className="text-gray-400 text-sm">Excellent performance this week!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Settings;
