// Dashboard Stats Component - Modern UI
import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, TrendingUp, Leaf, Users, Shield, Award, BarChart3 } from 'lucide-react';

// Animated counter hook
const useAnimatedCounter = (end, duration = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

const StatCard = ({ icon: Icon, label, value, trend, color, gradientFrom, gradientTo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const animatedValue = useAnimatedCounter(value || 0, 1500);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 cursor-pointer
        ${isHovered ? 'transform -translate-y-1 shadow-2xl' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-10`} />
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {animatedValue}
              </p>
              {typeof value === 'number' && value > 100 && (
                <span className="text-xs text-gray-400 font-medium">+</span>
              )}
            </div>
            {trend !== undefined && (
              <div className={`flex items-center mt-2 text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
                )}
                {trend > 0 ? '+' : ''}{trend}% from last month
              </div>
            )}
          </div>
          
          {/* Icon container with gradient */}
          <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Decorative shine effect */}
        <div className={`absolute -top-10 -right-10 w-20 h-20 bg-white opacity-20 rounded-full transition-transform duration-500 ${isHovered ? 'scale-150' : ''}`} />
      </div>
    </div>
  );
};

export const DashboardStats = ({ stats }) => {
  const statCards = [
    { 
      icon: Package, 
      label: 'Total Products', 
      value: stats?.total || 12, 
      trend: 12, 
      gradientFrom: 'from-emerald-500', 
      gradientTo: 'to-teal-600'
    },
    { 
      icon: Shield, 
      label: 'Total Certifications', 
      value: stats?.verified || 8, 
      trend: 8, 
      gradientFrom: 'from-blue-500', 
      gradientTo: 'to-indigo-600'
    },
    { 
      icon: Users, 
      label: 'Active Farmers', 
      value: stats?.processing || 156, 
      trend: 5, 
      gradientFrom: 'from-amber-500', 
      gradientTo: 'to-orange-600'
    },
    { 
      icon: Award, 
      label: 'Verified Batches', 
      value: stats?.pending || 324, 
      trend: 15, 
      gradientFrom: 'from-purple-500', 
      gradientTo: 'to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardStats;
