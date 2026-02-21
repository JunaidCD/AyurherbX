// Reports Components
import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, Printer } from 'lucide-react';

export const ReportFilters = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState('all');
  const [reportType, setReportType] = useState('all');
  const [status, setStatus] = useState('all');

  const handleApply = () => {
    onFilterChange({ dateRange, reportType, status });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 mr-2 text-gray-500" />
        <h3 className="text-lg font-semibold">Report Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="collection">Collection</option>
            <option value="processing">Processing</option>
            <option value="quality">Quality Test</option>
            <option value="sales">Sales</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      
      <button 
        onClick={handleApply}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Apply Filters
      </button>
    </div>
  );
};

export const ReportCard = ({ report, onDownload, onView }) => (
  <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-start">
        <FileText className="w-8 h-8 text-blue-500 mr-3" />
        <div>
          <h4 className="font-semibold">{report.title}</h4>
          <p className="text-sm text-gray-500">{report.type} - {report.date}</p>
          <p className="text-sm mt-1">{report.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onView(report.id)} className="text-blue-600 hover:text-blue-800 text-sm">View</button>
        <button onClick={() => onDownload(report.id)} className="text-gray-600 hover:text-gray-800 text-sm flex items-center">
          <Download className="w-4 h-4 mr-1" /> Download
        </button>
      </div>
    </div>
  </div>
);

export const ReportActions = ({ onExport, onPrint, onShare }) => (
  <div className="flex space-x-2">
    <button onClick={onExport} className="flex items-center bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700">
      <Download className="w-4 h-4 mr-2" /> Export
    </button>
    <button onClick={onPrint} className="flex items-center bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700">
      <Printer className="w-4 h-4 mr-2" /> Print
    </button>
    <button onClick={onShare} className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
      Share
    </button>
  </div>
);

export default { ReportFilters, ReportCard, ReportActions };
