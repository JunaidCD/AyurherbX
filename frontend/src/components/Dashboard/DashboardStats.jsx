// Dashboard Stats Component
import React from 'react';
import { Package, CheckCircle, TrendingUp, Leaf } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
      </div>
    </div>
    {trend && (
      <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend > 0 ? '+' : ''}{trend}% from last month
      </p>
    )}
  </div>
);

export const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard icon={Package} label="Total Collections" value={stats?.total || 0} trend={12} color="border-blue-500" />
    <StatCard icon={CheckCircle} label="Verified" value={stats?.verified || 0} trend={8} color="border-green-500" />
    <StatCard icon={TrendingUp} label="Processing" value={stats?.processing || 0} color="border-yellow-500" />
    <StatCard icon={Leaf} label="Pending" value={stats?.pending || 0} color="border-red-500" />
  </div>
);

export default DashboardStats;
