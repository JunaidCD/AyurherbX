// Lab Test Components
import React, { useState } from 'react';
import { TestTube, CheckCircle, XCircle, Upload, FileText } from 'lucide-react';

export const LabTestForm = ({ batches, onSubmit }) => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [testType, setTestType] = useState('purity');
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ batchId: selectedBatch, testType, result, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">New Lab Test</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
          <select 
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a batch</option>
            {(batches || []).map(batch => (
              <option key={batch.id} value={batch.id}>{batch.herbName} - {batch.batchId}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
          <select 
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="purity">Purity Test</option>
            <option value="potency">Potency Test</option>
            <option value="heavyMetals">Heavy Metals</option>
            <option value="pesticides">Pesticides</option>
            <option value="microbiology">Microbiology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Result</label>
          <input 
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Enter test result"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <input 
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Submit Test Result
      </button>
    </form>
  );
};

export const TestResultCard = ({ test, onVerify }) => (
  <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold">{test.testType}</h4>
        <p className="text-sm text-gray-500">Batch: {test.batchId}</p>
        <p className="text-lg font-bold mt-2">{test.result}</p>
      </div>
      <div className="flex space-x-2">
        {test.passed ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500" />
        )}
      </div>
    </div>
    <div className="mt-4 flex space-x-2">
      <button onClick={() => onVerify(test.id, true)} className="text-green-600 text-sm hover:underline">Verify</button>
      <button onClick={() => onVerify(test.id, false)} className="text-red-600 text-sm hover:underline">Reject</button>
    </div>
  </div>
);

export default { LabTestForm, TestResultCard };
