import React, { createContext, useContext, useState, useEffect } from 'react';

const CollectionsContext = createContext();

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load collections from localStorage on mount
  useEffect(() => {
    const loadCollections = () => {
      try {
        const storedCollections = localStorage.getItem('ayurherb_collections');
        if (storedCollections) {
          const parsedCollections = JSON.parse(storedCollections);
          setCollections(parsedCollections);
        }
      } catch (error) {
        console.error('Failed to load collections:', error);
        setError('Failed to load collections');
      }
    };

    loadCollections();
  }, []);

  // Save collections to localStorage whenever collections change
  useEffect(() => {
    try {
      localStorage.setItem('ayurherb_collections', JSON.stringify(collections));
    } catch (error) {
      console.error('Failed to save collections:', error);
    }
  }, [collections]);

  const addCollection = (newCollection) => {
    const collection = {
      id: `COL-${Date.now()}`,
      ...newCollection,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      timestamp: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      isVerified: false
    };

    setCollections(prev => [collection, ...prev]); // Add to beginning for recent first
    return collection;
  };

  const updateCollection = (collectionId, updates) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, ...updates }
          : collection
      )
    );
  };

  const deleteCollection = (collectionId) => {
    setCollections(prev => 
      prev.filter(collection => collection.id !== collectionId)
    );
  };

  const getCollectionById = (collectionId) => {
    return collections.find(collection => collection.id === collectionId);
  };

  const getRecentCollections = (limit = 5) => {
    return collections
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const getCollectionsByStatus = (status) => {
    return collections.filter(collection => collection.status === status);
  };

  const getTodaysCollections = () => {
    const today = new Date().toISOString().split('T')[0];
    return collections.filter(collection => collection.submissionDate === today);
  };

  const getCollectionsStats = () => {
    const total = collections.length;
    const today = getTodaysCollections().length;
    const pending = getCollectionsByStatus('Pending Verification').length;
    const completed = getCollectionsByStatus('Verified').length;
    const processing = getCollectionsByStatus('Processing').length;

    return {
      total,
      today,
      pending,
      completed,
      processing
    };
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    collections,
    loading,
    error,
    
    // Actions
    addCollection,
    updateCollection,
    deleteCollection,
    clearError,
    
    // Getters
    getCollectionById,
    getRecentCollections,
    getCollectionsByStatus,
    getTodaysCollections,
    getCollectionsStats,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};
