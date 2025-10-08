const express = require('express');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// Submit a new collection
router.post('/', async (req, res) => {
  try {
    const { herbName, quantity, batchId, location, notes, collectorAddress } = req.body;
    
    // Validate required fields
    if (!herbName || !quantity || !batchId || !location || !collectorAddress) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'herbName, quantity, batchId, location, and collectorAddress are required'
      });
    }

    const collectionData = {
      herbName,
      quantity,
      batchId,
      location,
      notes: notes || ''
    };

    // Submit to blockchain
    const blockchainResult = await blockchainService.submitCollection(collectionData, collectorAddress);
    
    // Prepare response
    const response = {
      success: true,
      message: 'Collection submitted successfully',
      data: {
        collectionId: blockchainResult.collectionId,
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        collectionData: {
          ...collectionData,
          collector: collectorAddress,
          timestamp: new Date().toISOString(),
          isVerified: false
        }
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Submit collection error:', error);
    res.status(500).json({
      error: 'Failed to submit collection',
      message: error.message
    });
  }
});

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await blockchainService.getAllCollections();
    
    res.json({
      success: true,
      data: collections,
      count: collections.length
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      error: 'Failed to get collections',
      message: error.message
    });
  }
});

// Get collection by ID
router.get('/:id', async (req, res) => {
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
    
    if (error.message.includes('Collection does not exist')) {
      return res.status(404).json({
        error: 'Collection not found',
        message: `Collection with ID ${req.params.id} does not exist`
      });
    }
    
    res.status(500).json({
      error: 'Failed to get collection',
      message: error.message
    });
  }
});

// Get collections by collector address
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
      data: collections,
      count: collections.length,
      collector: address
    });
  } catch (error) {
    console.error('Get collector collections error:', error);
    res.status(500).json({
      error: 'Failed to get collector collections',
      message: error.message
    });
  }
});

// Verify a collection (admin only)
router.patch('/:id/verify', async (req, res) => {
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
      data: {
        collectionId: id,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        verifiedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Verify collection error:', error);
    
    if (error.message.includes('Collection does not exist')) {
      return res.status(404).json({
        error: 'Collection not found',
        message: `Collection with ID ${req.params.id} does not exist`
      });
    }
    
    if (error.message.includes('already verified')) {
      return res.status(400).json({
        error: 'Collection already verified',
        message: `Collection with ID ${req.params.id} is already verified`
      });
    }
    
    res.status(500).json({
      error: 'Failed to verify collection',
      message: error.message
    });
  }
});

module.exports = router;
