// API functions for Ayurherb 2.0
// Frontend-only application with mock data

import { sharedStorage } from './sharedStorage.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data - Exact farmer submission data from Image 1
let mockCollections = [
  {
    id: 'COL001',
    batchId: 'BAT 2024 001',
    collectorId: 'COL 2024',
    farmer: 'COL 2024',
    herb: 'Allovera',
    speciesName: 'Allovera',
    quantity: '5 kg',
    weight: '5 kg',
    moisture: '20%',
    gpsCoordinates: '22.6290°, 88.4412°',
    latitude: '22.6290°',
    longitude: '88.4412°',
    accuracy: '±162 meters',
    collectionTime: '9/23/2025, 10:06:50 AM',
    submissionDate: '2025-09-23',
    timestamp: '9/23/2025, 10:06:50 AM',
    status: 'Verified',
    location: '22.6290°, 88.4412°',
    qualityGrade: 'Standard (A)',
    qualityAssessment: 'Standard (A)'
  },
  {
    id: 'COL002',
    batchId: 'BAT 2024 003',
    collectorId: 'COL 2024',
    farmer: 'Rajesh Kumar',
    herb: 'Ashwagandha',
    speciesName: 'Ashwagandha',
    quantity: '500kg',
    weight: '500kg',
    moisture: '15%',
    gpsCoordinates: '10.8505°, 76.2711°',
    latitude: '10.8505°',
    longitude: '76.2711°',
    accuracy: '±50 meters',
    collectionTime: '1/15/2024, 08:30:00 AM',
    submissionDate: '2024-01-15',
    timestamp: '1/15/2024, 08:30:00 AM',
    status: 'Verified',
    location: 'Kerala, India',
    qualityGrade: 'Premium (AA)',
    qualityAssessment: 'Premium (AA)'
  },
  {
    id: 'COL003',
    batchId: 'BAT 2024 004',
    collectorId: 'COL 2024',
    farmer: 'Suresh Patel',
    herb: 'Brahmi',
    speciesName: 'Brahmi',
    quantity: '300kg',
    weight: '300kg',
    moisture: '18%',
    gpsCoordinates: '23.0225°, 72.5714°',
    latitude: '23.0225°',
    longitude: '72.5714°',
    accuracy: '±75 meters',
    collectionTime: '1/25/2024, 14:15:30 PM',
    submissionDate: '2024-01-25',
    timestamp: '1/25/2024, 14:15:30 PM',
    status: 'Synced',
    location: 'Gujarat, India',
    qualityGrade: 'Standard (A)',
    qualityAssessment: 'Standard (A)'
  },
  {
    id: 'COL004',
    batchId: 'BAT-2025-011',
    collectorId: 'COL-102',
    farmer: 'COL-102',
    herb: 'Ashwagandha',
    speciesName: 'Ashwagandha',
    quantity: '12 kg',
    weight: '12 kg',
    moisture: '9%',
    gpsCoordinates: '18.9123°, 77.5123°',
    latitude: '18.9123°',
    longitude: '77.5123°',
    accuracy: '±89 meters',
    collectionTime: '9/21/2025, 10:12:00 AM',
    submissionDate: '2025-09-21',
    timestamp: '9/21/2025, 10:12:00 AM',
    status: 'Verified',
    location: '18.9123°, 77.5123° (Protected forest)',
    qualityGrade: 'Premium (AA)',
    qualityAssessment: 'Premium (AA)'
  },
  {
    id: 'COL005',
    batchId: 'BAT-2025-012',
    collectorId: 'COL-103',
    farmer: 'Priya Sharma',
    herb: 'Turmeric',
    speciesName: 'Curcuma longa',
    quantity: '750kg',
    weight: '750kg',
    moisture: '12%',
    gpsCoordinates: '11.1271°, 78.6569°',
    latitude: '11.1271°',
    longitude: '78.6569°',
    accuracy: '±45 meters',
    collectionTime: '9/20/2025, 07:30:00 AM',
    submissionDate: '2025-09-20',
    timestamp: '9/20/2025, 07:30:00 AM',
    status: 'Verified',
    location: 'Tamil Nadu, India',
    qualityGrade: 'Premium (AA)',
    qualityAssessment: 'Premium (AA)'
  },
  {
    id: 'COL006',
    batchId: 'BAT-2025-013',
    collectorId: 'COL-104',
    farmer: 'Amit Singh',
    herb: 'Neem',
    speciesName: 'Azadirachta indica',
    quantity: '400kg',
    weight: '400kg',
    moisture: '14%',
    gpsCoordinates: '26.9124°, 75.7873°',
    latitude: '26.9124°',
    longitude: '75.7873°',
    accuracy: '±60 meters',
    collectionTime: '9/19/2025, 09:15:00 AM',
    submissionDate: '2025-09-19',
    timestamp: '9/19/2025, 09:15:00 AM',
    status: 'Verified',
    location: 'Rajasthan, India',
    qualityGrade: 'Standard (A)',
    qualityAssessment: 'Standard (A)'
  },
  {
    id: 'COL007',
    batchId: 'BAT-2025-014',
    collectorId: 'COL-105',
    farmer: 'Lakshmi Devi',
    herb: 'Tulsi',
    speciesName: 'Ocimum sanctum',
    quantity: '200kg',
    weight: '200kg',
    moisture: '16%',
    gpsCoordinates: '15.3173°, 75.7139°',
    latitude: '15.3173°',
    longitude: '75.7139°',
    accuracy: '±35 meters',
    collectionTime: '9/18/2025, 06:45:00 AM',
    submissionDate: '2025-09-18',
    timestamp: '9/18/2025, 06:45:00 AM',
    status: 'Verified',
    location: 'Karnataka, India',
    qualityGrade: 'Premium (AA)',
    qualityAssessment: 'Premium (AA)'
  },
  {
    id: 'COL008',
    batchId: 'BAT-2025-015',
    collectorId: 'COL-106',
    farmer: 'Ravi Kumar',
    herb: 'Ginger',
    speciesName: 'Zingiber officinale',
    quantity: '600kg',
    weight: '600kg',
    moisture: '18%',
    gpsCoordinates: '9.9312°, 76.2673°',
    latitude: '9.9312°',
    longitude: '76.2673°',
    accuracy: '±55 meters',
    collectionTime: '9/17/2025, 08:20:00 AM',
    submissionDate: '2025-09-17',
    timestamp: '9/17/2025, 08:20:00 AM',
    status: 'Verified',
    location: 'Kerala, India',
    qualityGrade: 'Standard (A)',
    qualityAssessment: 'Standard (A)'
  }
];

// Function to convert verified collections to processing batches
const convertCollectionToBatch = (collection) => {
  return {
    id: collection.batchId || `AH${collection.id.replace('COL', '')}`,
    batchId: collection.batchId,
    collectorId: collection.collectorId,
    herb: collection.herb,
    speciesName: collection.speciesName,
    farmer: collection.farmer,
    location: collection.location,
    gpsCoordinates: collection.gpsCoordinates,
    latitude: collection.latitude,
    longitude: collection.longitude,
    accuracy: collection.accuracy,
    harvestDate: collection.submissionDate,
    collectionTime: collection.collectionTime,
    timestamp: collection.timestamp,
    quantity: collection.quantity,
    weight: collection.weight,
    moisture: collection.moisture,
    qualityGrade: collection.qualityGrade,
    qualityAssessment: collection.qualityAssessment,
    status: 'Processing',
    qualityScore: collection.qualityGrade === 'Premium (AA)' ? 98 : 92,
    processingSteps: [
      { step: 'Collection Verified', date: collection.submissionDate, status: 'Completed' },
      { step: 'Quality Check', date: new Date().toISOString().split('T')[0], status: 'In Progress' }
    ],
    labResults: {
      moisture: collection.moisture,
      pesticide: 'Pending Test',
      dna: 'Pending Test',
      ayushCompliance: false
    },
    collectionId: collection.id // Link back to original collection
  };
};

// Get current processing batches (verified collections converted to batches)
const getProcessingBatches = () => {
  return mockCollections
    .filter(collection => collection.status === 'Verified')
    .map(convertCollectionToBatch);
};

const mockStats = {
  totalCollections: 1547,
  verifiedBatches: 1089,
  activeFarmers: 234,
  qualityScore: 94.2,
  recalledBatches: 23,
  pendingTests: 135,
  processingEfficiency: 94,
  qualityCompliance: 98,
  supplyChainSpeed: 87,
  farmerSatisfaction: 92,
  environmentalImpact: {
    carbonFootprint: 2.4,
    waterUsage: 1250,
    sustainabilityScore: 87
  }
};

const mockChartData = [
  { month: 'Jan', harvest: 420, processed: 380, verified: 340 },
  { month: 'Feb', harvest: 520, processed: 480, verified: 450 },
  { month: 'Mar', harvest: 680, processed: 620, verified: 580 },
  { month: 'Apr', harvest: 780, processed: 720, verified: 680 },
  { month: 'May', harvest: 920, processed: 850, verified: 800 },
  { month: 'Jun', harvest: 1100, processed: 1020, verified: 980 }
];

// API Functions
export const api = {
  // Health check (mock)
  healthCheck: async () => {
    await delay(500);
    return {
      status: 'healthy',
      message: 'Frontend-only application running',
      timestamp: new Date().toISOString()
    };
  },

  // Authentication
  login: async (credentials) => {
    await delay(1000);
    if (credentials.username && credentials.password) {
      return {
        success: true,
        user: {
          id: '1',
          username: credentials.username,
          role: credentials.role,
          name: 'Junaid',
          email: 'junaid@ayurherb.com'
        },
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    await delay(500);
    return mockStats;
  },

  // Batches - Now using shared storage (excludes processed batches)
  getBatches: async (filters = {}) => {
    await delay(800);
    let filteredBatches = sharedStorage.getBatches(); // Get batches from verified collections in shared storage
    
    // Exclude batches that have processing steps (they should appear in processed batches page instead)
    const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
    const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
    
    filteredBatches = filteredBatches.filter(batch => {
      const batchSteps = processingSteps[batch.batchId] || [];
      // Only show batches that don't have custom processing steps
      return batchSteps.length === 0;
    });
    
    if (filters.status) {
      filteredBatches = filteredBatches.filter(batch => 
        batch.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.search) {
      filteredBatches = filteredBatches.filter(batch =>
        batch.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        batch.herb.toLowerCase().includes(filters.search.toLowerCase()) ||
        batch.farmer.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return filteredBatches;
  },

  getBatchById: async (id) => {
    await delay(500);
    const batches = sharedStorage.getBatches();
    const batch = batches.find(b => b.id === id);
    if (!batch) throw new Error('Batch not found');
    return batch;
  },

  // Processing
  addProcessingStep: async (batchId, stepData) => {
    await delay(2000); // Simulate blockchain transaction delay
    
    // Store processing step in dedicated localStorage
    const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
    const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
    
    if (!processingSteps[batchId]) {
      processingSteps[batchId] = [];
    }
    
    const newStep = {
      id: Date.now().toString(),
      step: stepData.step || stepData.stepType,
      stepType: stepData.stepType,
      temperature: stepData.temperature,
      duration: stepData.duration,
      notes: stepData.notes,
      description: stepData.description || `${stepData.stepType} process completed`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleString(),
      status: 'Completed'
    };
    
    processingSteps[batchId].push(newStep);
    localStorage.setItem('ayurherb_processing_steps', JSON.stringify(processingSteps));
    
    // Generate mock blockchain transaction data
    const transactionHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const blockNumber = Math.floor(Math.random() * 1000000) + 18500000;
    const gasUsed = Math.floor(Math.random() * 50000) + 21000;
    
    return {
      success: true,
      message: 'Processing step added to blockchain successfully',
      step: newStep,
      blockchain: {
        transactionHash,
        blockNumber,
        gasUsed,
        network: 'Hyperledger Besu',
        contractAddress: '0x742d35Cc6634C0532925a3b8D0C9C0E2C2C2C2C2',
        confirmed: true
      }
    };
  },

  // Lab Testing
  addLabResult: async (batchId, testData) => {
    await delay(1200);
    return {
      success: true,
      message: 'Lab results added successfully',
      result: {
        id: Date.now().toString(),
        batchId,
        ...testData,
        testDate: new Date().toISOString().split('T')[0],
        technician: 'Dr. Sarah Wilson'
      }
    };
  },

  // Charts and Analytics
  getHarvestData: async () => {
    await delay(600);
    return mockChartData;
  },

  getEnvironmentalReport: async () => {
    await delay(700);
    return {
      carbonFootprint: mockStats.environmentalImpact.carbonFootprint,
      waterUsage: mockStats.environmentalImpact.waterUsage,
      sustainabilityScore: mockStats.environmentalImpact.sustainabilityScore,
      monthlyData: mockChartData.map(item => ({
        month: item.month,
        carbon: Math.random() * 5,
        water: Math.random() * 2000,
        sustainability: 70 + Math.random() * 30
      }))
    };
  },

  getAyushCompliance: async () => {
    await delay(500);
    return {
      overallCompliance: 94.2,
      categories: [
        { name: 'Quality Standards', score: 96.5, status: 'Excellent' },
        { name: 'Documentation', score: 92.8, status: 'Good' },
        { name: 'Traceability', score: 98.1, status: 'Excellent' },
        { name: 'Safety Protocols', score: 89.4, status: 'Good' }
      ]
    };
  },

  // Collections (Farmer submissions) - Now using shared storage
  getCollections: async () => {
    await delay(600);
    return sharedStorage.getCollections();
  },

  // Add new collection (for farmer submissions)
  addCollection: async (collectionData) => {
    await delay(800);
    const newCollection = {
      id: `COL${Date.now().toString().slice(-3)}`,
      batchId: `BAT 2024 ${Date.now().toString().slice(-3)}`,
      collectorId: 'COL 2024',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      ...collectionData
    };
    
    const success = sharedStorage.addCollection(newCollection);
    if (!success) throw new Error('Failed to save collection');
    
    return {
      success: true,
      message: 'Collection added successfully',
      collection: newCollection
    };
  },

  // Update collection status (this will affect processor dashboard)
  updateCollectionStatus: async (collectionId, newStatus) => {
    await delay(800);
    const success = sharedStorage.updateCollectionStatus(collectionId, newStatus);
    if (!success) throw new Error('Collection not found');
    
    const collections = sharedStorage.getCollections();
    const updatedCollection = collections.find(c => c.id === collectionId);
    
    return {
      success: true,
      message: `Collection ${collectionId} status updated to ${newStatus}`,
      collection: updatedCollection
    };
  },

  // File upload simulation
  uploadFile: async (file) => {
    await delay(2000);
    return {
      success: true,
      fileUrl: `https://mock-storage.com/${file.name}`,
      fileName: file.name,
      fileSize: file.size
    };
  },

  // Get processed batches (batches with custom processing steps)
  getProcessedBatches: async () => {
    await delay(600);
    
    // Get processing steps from localStorage
    const processingStepsData = localStorage.getItem('ayurherb_processing_steps');
    const processingSteps = processingStepsData ? JSON.parse(processingStepsData) : {};
    
    console.log('Processing steps data:', processingSteps);
    
    // Get all batches
    const allBatches = sharedStorage.getBatches();
    console.log('All batches:', allBatches);
    
    // Filter batches that have custom processing steps (beyond default Collection Verified/Quality Check)
    const processedBatches = allBatches.filter(batch => {
      const batchSteps = processingSteps[batch.batchId] || [];
      console.log(`Batch ${batch.batchId} has ${batchSteps.length} processing steps:`, batchSteps);
      // Check if batch has custom processing steps (not just default ones)
      const hasCustomSteps = batchSteps.length > 0;
      return hasCustomSteps;
    }).map(batch => {
      const batchSteps = processingSteps[batch.batchId] || [];
      
      // Calculate progress based on processing steps
      const totalSteps = batchSteps.length + 2; // +2 for default steps
      const completedSteps = batchSteps.filter(step => step.status === 'Completed').length + 2;
      const progress = Math.round((completedSteps / totalSteps) * 100);
      
      return {
        ...batch,
        processingSteps: [
          { step: 'Collection Verified', date: batch.harvestDate, status: 'Completed' },
          { step: 'Quality Check', date: batch.harvestDate, status: 'Completed' },
          ...batchSteps
        ],
        progress,
        customProcessingSteps: batchSteps
      };
    });
    
    console.log('Processed batches result:', processedBatches);
    return processedBatches;
  },

  // Clear all batches/collections
  clearAllBatches: async () => {
    await delay(500);
    const success = sharedStorage.clearAllData();
    if (!success) throw new Error('Failed to clear data');
    
    return {
      success: true,
      message: 'All batches cleared successfully'
    };
  }
};

export default api;
