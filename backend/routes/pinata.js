const express = require('express');
const router = express.Router();
const pinataService = require('../services/pinataService');
const { upload, handleUpload } = require('../services/uploadService');

// Test Pinata connection
router.get('/test', async (req, res) => {
    try {
        const isConnected = await pinataService.testConnection();
        res.json({ 
            success: true, 
            connected: isConnected,
            message: isConnected ? 'Pinata connected' : 'Pinata not configured'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Upload herb metadata to IPFS
router.post('/upload-metadata', async (req, res) => {
    try {
        const { herbData } = req.body;
        
        if (!herbData) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing herbData' 
            });
        }

        const ipfsHash = await pinataService.uploadHerbMetadata(herbData);
        
        res.json({
            success: true,
            ipfsHash: ipfsHash,
            gatewayURL: pinataService.getIPFSGatewayURL(ipfsHash)
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Upload image to IPFS
router.post('/upload-image', upload.single('image'), handleUpload(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No image provided' 
            });
        }

        const ipfsHash = await pinataService.uploadImageToIPFS(
            req.file.buffer,
            req.file.originalname
        );
        
        res.json({
            success: true,
            ipfsHash: ipfsHash,
            gatewayURL: pinataService.getIPFSGatewayURL(ipfsHash)
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}));

// Full herb batch upload (metadata + optional image)
router.post('/upload-batch', async (req, res) => {
    try {
        const { 
            herbName,
            batchCode,
            originLocation,
            harvestDate,
            description,
            imageBase64,
            collector,
            collectionTimestamp
        } = req.body;

        // Validate required fields
        if (!herbName || !batchCode || !originLocation || !harvestDate) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }

        let imageHash = null;
        
        // Upload image if provided
        if (imageBase64) {
            imageHash = await pinataService.uploadImageToIPFS(imageBase64, `${batchCode}.jpg`);
        }

        // Prepare herb data
        const herbData = {
            herbName,
            batchCode,
            originLocation,
            harvestDate,
            description,
            imageHash,
            imageURI: imageHash ? `ipfs://${imageHash}` : null,
            collector: collector || '',
            collectionTimestamp: collectionTimestamp || Math.floor(Date.now() / 1000),
            qualityGrade: 'B', // Default grade
            isVerified: false,
            isProcessed: false
        };

        // Upload metadata to IPFS
        const metadataHash = await pinataService.uploadHerbMetadata(herbData);

        res.json({
            success: true,
            metadataHash,
            imageHash,
            metadataGatewayURL: pinataService.getIPFSGatewayURL(metadataHash),
            imageGatewayURL: imageHash ? pinataService.getIPFSGatewayURL(imageHash) : null
        });
    } catch (error) {
        console.error('Upload batch error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Unpin content from IPFS
router.delete('/unpin/:ipfsHash', async (req, res) => {
    try {
        const { ipfsHash } = req.params;
        
        await pinataService.unpinFromIPFS(ipfsHash);
        
        res.json({
            success: true,
            message: `Successfully unpinned ${ipfsHash}`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get gateway URL for IPFS hash
router.get('/gateway/:ipfsHash', (req, res) => {
    const { ipfsHash } = req.params;
    const gatewayURL = pinataService.getIPFSGatewayURL(ipfsHash);
    
    res.json({
        success: true,
        ipfsHash,
        gatewayURL
    });
});

module.exports = router;
