// Dashboard Tables Component
import React from 'react';
import { Eye, CheckCircle, Clock } from 'lucide-react';

export const RecentCollectionsTable = ({ collections, onView }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 border-b">
      <h3 className="text-lg font-semibold">Recent Collections</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Herb Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(collections || []).slice(0, 5).map((collection, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{collection.batchId || collection.id}</td>
              <td className="px-4 py-3 text-sm">{collection.herbName}</td>
              <td className="px-4 py-3 text-sm">{collection.quantity}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-2 py-1 text-xs rounded-full ${collection.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {collection.isVerified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">{new Date(collection.timestamp || Date.now()).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-sm">
                <button onClick={() => onView(collection)} className="text-blue-600 hover:text-blue-900">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const ProcessingTable = ({ batches }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 border-b">
      <h3 className="text-lg font-semibold">Processing Batches</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(batches || []).map((batch, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{batch.id}</td>
              <td className="px-4 py-3 text-sm">{batch.stage}</td>
              <td className="px-4 py-3 text-sm">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${batch.progress || 0}%` }} />
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{batch.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default { RecentCollectionsTable, ProcessingTable };
