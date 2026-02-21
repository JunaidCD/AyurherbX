// Dashboard Cards Component
import React from 'react';
import { Package, Factory, TestTube, Shield, ShoppingCart, Users } from 'lucide-react';

const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${color}`}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

export const QuickActions = ({ role, navigate }) => {
  const actions = {
    Collector: [
      { icon: Package, title: 'New Collection', description: 'Submit new herb batch', path: '/collections', color: 'border-green-500' },
      { icon: Users, title: 'My Batches', description: 'View submitted batches', path: '/batches', color: 'border-blue-500' }
    ],
    Processor: [
      { icon: Factory, title: 'Process Batch', description: 'Add processing steps', path: '/processing', color: 'border-yellow-500' },
      { icon: Package, title: 'View Batches', description: 'Manage processing', path: '/batches', color: 'border-purple-500' }
    ],
    'Lab Tester': [
      { icon: TestTube, title: 'Lab Tests', description: 'Conduct quality tests', path: '/lab', color: 'border-indigo-500' },
      { icon: Shield, title: 'Verify Results', description: 'Review test results', path: '/reports', color: 'border-teal-500' }
    ],
    Admin: [
      { icon: Shield, title: 'Verify Collections', description: 'Approve submissions', path: '/admin', color: 'border-red-500' },
      { icon: Users, title: 'Manage Users', description: 'User administration', path: '/settings', color: 'border-gray-500' }
    ],
    Customer: [
      { icon: ShoppingCart, title: 'Browse Products', description: 'View available herbs', path: '/products', color: 'border-pink-500' },
      { icon: Package, title: 'My Orders', description: 'Order history', path: '/cart', color: 'border-orange-500' }
    ]
  };

  const roleActions = actions[role] || actions.Collector;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roleActions.map((action, index) => (
        <QuickActionCard key={index} {...action} onClick={() => navigate(action.path)} />
      ))}
    </div>
  );
};

export const RoleBadge = ({ role }) => {
  const badges = {
    Collector: { color: 'bg-green-100 text-green-800', icon: Users },
    Processor: { color: 'bg-yellow-100 text-yellow-800', icon: Factory },
    'Lab Tester': { color: 'bg-indigo-100 text-indigo-800', icon: TestTube },
    Admin: { color: 'bg-red-100 text-red-800', icon: Shield },
    Customer: { color: 'bg-blue-100 text-blue-800', icon: ShoppingCart }
  };
  
  const { color, icon: Icon } = badges[role] || badges.Collector;
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {role}
    </span>
  );
};

export default { QuickActions, RoleBadge };
