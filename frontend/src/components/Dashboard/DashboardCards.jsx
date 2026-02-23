// Dashboard Cards Component - Modern UI
import React, { useState } from 'react';
import { Package, Factory, TestTube, Shield, ShoppingCart, Users, ArrowRight, Sparkles } from 'lucide-react';

const QuickActionCard = ({ icon: Icon, title, description, onClick, color, gradientFrom, gradientTo }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl shadow-md cursor-pointer 
        transition-all duration-300 hover:shadow-2xl ${isHovered ? 'transform -translate-y-1' : ''}`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
        <div className="flex items-center space-x-5">
          {/* Icon container */}
          <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">{title}</h4>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          
          {/* Arrow indicator */}
          <div className={`p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
            <ArrowRight className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </div>
        </div>
        
        {/* Decorative line */}
        <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} group-hover:w-full transition-all duration-500 rounded-b-2xl`} />
      </div>
    </div>
  );
};

export const QuickActions = ({ role, navigate }) => {
  const actions = {
    Collector: [
      { icon: Package, title: 'New Collection', description: 'Submit new herb batch', path: '/collections', gradientFrom: 'from-emerald-500', gradientTo: 'to-teal-600' },
      { icon: Users, title: 'My Batches', description: 'View submitted batches', path: '/batches', gradientFrom: 'from-blue-500', gradientTo: 'to-cyan-600' }
    ],
    Processor: [
      { icon: Factory, title: 'Process Batch', description: 'Add processing steps', path: '/processing', gradientFrom: 'from-amber-500', gradientTo: 'to-orange-600' },
      { icon: Package, title: 'View Batches', description: 'Manage processing', path: '/batches', gradientFrom: 'from-purple-500', gradientTo: 'to-indigo-600' }
    ],
    'Lab Tester': [
      { icon: TestTube, title: 'Lab Tests', description: 'Conduct quality tests', path: '/lab', gradientFrom: 'from-rose-500', gradientTo: 'to-pink-600' },
      { icon: Shield, title: 'Verify Results', description: 'Review test results', path: '/reports', gradientFrom: 'from-teal-500', gradientTo: 'to-cyan-600' }
    ],
    Admin: [
      { icon: Shield, title: 'Verify Collections', description: 'Approve submissions', path: '/admin', gradientFrom: 'from-red-500', gradientTo: 'to-rose-600' },
      { icon: Users, title: 'Manage Users', description: 'User administration', path: '/settings', gradientFrom: 'from-slate-500', gradientTo: 'to-zinc-600' }
    ],
    Customer: [
      { icon: ShoppingCart, title: 'Browse Products', description: 'View available herbs', path: '/products', gradientFrom: 'from-pink-500', gradientTo: 'to-rose-600' },
      { icon: Package, title: 'My Orders', description: 'Order history', path: '/cart', gradientFrom: 'from-orange-500', gradientTo: 'to-amber-600' }
    ]
  };

  const roleActions = actions[role] || actions.Collector;

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roleActions.map((action, index) => (
          <QuickActionCard key={index} {...action} onClick={() => navigate(action.path)} />
        ))}
      </div>
    </div>
  );
};

export const RoleBadge = ({ role }) => {
  const badges = {
    Collector: { gradientFrom: 'from-emerald-500', gradientTo: 'to-teal-600', icon: Users },
    Processor: { gradientFrom: 'from-amber-500', gradientTo: 'to-orange-600', icon: Factory },
    'Lab Tester': { gradientFrom: 'from-rose-500', gradientTo: 'to-pink-600', icon: TestTube },
    Admin: { gradientFrom: 'from-red-500', gradientTo: 'to-rose-600', icon: Shield },
    Customer: { gradientFrom: 'from-blue-500', gradientTo: 'to-indigo-600', icon: ShoppingCart }
  };
  
  const { gradientFrom, gradientTo, icon: Icon } = badges[role] || badges.Collector;
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-lg`}>
      <Icon className="w-4 h-4" />
      {role}
    </div>
  );
};

export default { QuickActions, RoleBadge };
