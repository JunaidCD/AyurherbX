// Dashboard Tables Component - Modern UI
import React from 'react';
import { Eye, CheckCircle, Clock, ArrowRight, FileText, Leaf, TrendingUp } from 'lucide-react';

const StatusBadge = ({ isVerified }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
    isVerified 
      ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200' 
      : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200'
  }`}>
    {isVerified ? (
      <>
        <CheckCircle className="w-3.5 h-3.5" />
        Verified
      </>
    ) : (
      <>
        <Clock className="w-3.5 h-3.5" />
        Pending
      </>
    )}
  </span>
);

const ActionButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
  >
    <Eye className="w-4 h-4" />
  </button>
);

export const RecentCollectionsTable = ({ collections, onView }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    {/* Header */}
    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Recent Certifications</h3>
          <p className="text-sm text-gray-500">Latest batch certifications and verifications</p>
        </div>
      </div>
    </div>
    
    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Batch ID</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Herb Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(collections || []).slice(0, 5).map((collection, index) => (
            <tr 
              key={index} 
              className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent transition-all duration-200 group"
            >
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                  #{collection.batchId || collection.id}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-semibold text-gray-800">{collection.herbName}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{collection.quantity}</span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge isVerified={collection.isVerified} />
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-500 text-sm">
                  {new Date(collection.timestamp || Date.now()).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </td>
              <td className="px-6 py-4">
                <ActionButton onClick={() => onView(collection)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Footer */}
    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
      <button className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
        View all certifications
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const ProcessingTable = ({ batches }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    {/* Header */}
    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Processing Batches</h3>
          <p className="text-sm text-gray-500">Track ongoing processing stages</p>
        </div>
      </div>
    </div>
    
    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Batch</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stage</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(batches || []).map((batch, index) => (
            <tr 
              key={index} 
              className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-transparent transition-all duration-200"
            >
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                  #{batch.id}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-semibold text-gray-800">{batch.stage}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500" 
                      style={{ width: `${batch.progress || 0}%` }} 
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12">{batch.progress || 0}%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                  {batch.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default { RecentCollectionsTable, ProcessingTable };
