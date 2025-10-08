const express = require('express');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// Get contract information
router.get('/contract-info', async (req, res) => {
  try {
    const address = blockchainService.getContractAddress();
    const abi = blockchainService.getContractABI();
    
    if (!address || !abi) {
      return res.status(404).json({
        error: 'Contract not deployed',
        message: 'Please deploy the contract first'
      });
    }

    res.json({
      address,
      abi,
      network: 'sepolia',
      chainId: 11155111
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get contract info',
      message: error.message
    });
  }
});

// Submit collection to blockchain
router.post('/submit-collection', async (req, res) => {
  try {
    const { collectionData, userAddress } = req.body;
    
    if (!collectionData || !userAddress) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'collectionData and userAddress are required'
      });
    }

    // Validate collection data
    const requiredFields = ['herbName', 'quantity', 'batchId', 'location'];
    for (const field of requiredFields) {
      if (!collectionData[field]) {
        return res.status(400).json({
          error: 'Missing required field',
          message: `${field} is required`
        });
      }
    }

    const result = await blockchainService.submitCollection(collectionData, userAddress);
    
    res.json({
      success: true,
      message: 'Collection submitted to blockchain successfully',
      data: result
    });
  } catch (error) {
    console.error('Submit collection error:', error);
    res.status(500).json({
      error: 'Failed to submit collection',
      message: error.message
    });
  }
});

// Get collection by ID
router.get('/collection/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid collection ID',
        message: 'Collection ID must be a valid number'
      });
    }

    const collection = await blockchainService.getCollection(id);
    
    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      error: 'Failed to get collection',
      message: error.message
    });
  }
});

// Get collections for a specific collector
router.get('/collector/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        error: 'Missing collector address',
        message: 'Collector address is required'
      });
    }

    const collections = await blockchainService.getCollectorCollections(address);
    
    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error('Get collector collections error:', error);
    res.status(500).json({
      error: 'Failed to get collector collections',
      message: error.message
    });
  }
});

// Get all collections
router.get('/collections', async (req, res) => {
  try {
    const collections = await blockchainService.getAllCollections();
    
    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error('Get all collections error:', error);
    res.status(500).json({
      error: 'Failed to get collections',
      message: error.message
    });
  }
});

// Verify collection (admin only)
router.post('/verify-collection/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid collection ID',
        message: 'Collection ID must be a valid number'
      });
    }

    const result = await blockchainService.verifyCollection(id);
    
    res.json({
      success: true,
      message: 'Collection verified successfully',
      data: result
    });
  } catch (error) {
    console.error('Verify collection error:', error);
    res.status(500).json({
      error: 'Failed to verify collection',
      message: error.message
    });
  }
});

module.exports = router;
