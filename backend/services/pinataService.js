/**
 * Pinata Service for IPFS Storage
 * 
 * This service handles uploading herb metadata to IPFS via Pinata.
 * The IPFS hash is then stored on-chain in the HerbNFT contract.
 */

const axios = require('axios');
require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

const PINATA_BASE_URL = 'https://api.pinata.cloud';

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param {Object} metadata - JSON object to upload
 * @returns {Promise<string>} - IPFS hash (CID)
 */
async function uploadToIPFS(metadata) {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error('Pinata API credentials not configured');
    }

    try {
        const formData = new FormData();
        const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        formData.append('file', blob, 'metadata.json');

        const response = await axios.post(
            `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
            formData,
            {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                    'Content-Type': 'multipart/form-data'
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        return response.data.IpfsHash;
    } catch (error) {
        console.error('Pinata upload error:', error.response?.data || error.message);
        throw new Error('Failed to upload to IPFS');
    }
}

/**
 * Upload herb batch metadata to IPFS
 * @param {Object} herbData - Herb batch data
 * @returns {Promise<string>} - IPFS hash (CID)
 */
async function uploadHerbMetadata(herbData) {
    const metadata = {
        name: `${herbData.herbName} - Batch ${herbData.batchCode}`,
        description: herbData.description || `Premium quality ${herbData.herbName} from ${herbData.originLocation}`,
        image: herbData.imageURI || `ipfs://${herbData.imageHash}`,
        attributes: [
            {
                trait_type: 'Herb Type',
                value: herbData.herbName
            },
            {
                trait_type: 'Origin',
                value: herbData.originLocation
            },
            {
                trait_type: 'Harvest Date',
                value: herbData.harvestDate
            },
            {
                trait_type: 'Quality Grade',
                value: herbData.qualityGrade || 'B'
            },
            {
                trait_type: 'Batch Code',
                value: herbData.batchCode
            },
            {
                trait_type: 'Collector',
                value: herbData.collector
            },
            {
                display_type: 'date',
                trait_type: 'Collection Timestamp',
                value: herbData.collectionTimestamp || Math.floor(Date.now() / 1000)
            }
        ],
        external_url: herbData.externalURL || '',
        background_color: '1a472a' // Forest green for herbs
    };

    // Add environmental data if available
    if (herbData.environmentalData) {
        metadata.attributes.push({
            trait_type: 'Temperature',
            value: herbData.environmentalData.temperature,
            display_type: 'number'
        });
        metadata.attributes.push({
            trait_type: 'Humidity',
            value: herbData.environmentalData.humidity,
            display_type: 'number'
        });
        metadata.attributes.push({
            trait_type: 'Air Quality Index',
            value: herbData.environmentalData.airQualityIndex,
            display_type: 'number'
        });
    }

    // Add processing info if available
    if (herbData.isProcessed) {
        metadata.attributes.push({
            trait_type: 'Processing Status',
            value: 'Processed'
        });
    }

    // Add verification info if available
    if (herbData.isVerified) {
        metadata.attributes.push({
            trait_type: 'Verified',
            value: 'Yes'
        });
    }

    return uploadToIPFS(metadata);
}

/**
 * Upload image to IPFS via Pinata
 * @param {Buffer|string} imageData - Image buffer or base64
 * @param {string} fileName - Name of the file
 * @returns {Promise<string>} - IPFS hash (CID)
 */
async function uploadImageToIPFS(imageData, fileName = 'image.jpg') {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error('Pinata API credentials not configured');
    }

    try {
        const formData = new FormData();
        
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            // Handle base64 image
            const base64Data = imageData.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            formData.append('file', blob, fileName);
        } else if (Buffer.isBuffer(imageData)) {
            const blob = new Blob([imageData], { type: 'image/jpeg' });
            formData.append('file', blob, fileName);
        } else {
            throw new Error('Invalid image data format');
        }

        const response = await axios.post(
            `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
            formData,
            {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                    'Content-Type': 'multipart/form-data'
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        return response.data.IpfsHash;
    } catch (error) {
        console.error('Pinata image upload error:', error.response?.data || error.message);
        throw new Error('Failed to upload image to IPFS');
    }
}

/**
 * Get IPFS gateway URL from hash
 * @param {string} ipfsHash - IPFS CID
 * @returns {string} - Gateway URL
 */
function getIPFSGatewayURL(ipfsHash) {
    const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
    return `${gateway}${ipfsHash}`;
}

/**
 * Unpin content from IPFS (remove from Pinata)
 * @param {string} ipfsHash - IPFS CID to unpin
 */
async function unpinFromIPFS(ipfsHash) {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error('Pinata API credentials not configured');
    }

    try {
        await axios.delete(
            `${PINATA_BASE_URL}/pinning/unpin/${ipfsHash}`,
            {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY
                }
            }
        );
        return true;
    } catch (error) {
        console.error('Pinata unpin error:', error.response?.data || error.message);
        throw new Error('Failed to unpin from IPFS');
    }
}

/**
 * Test Pinata connection
 * @returns {Promise<boolean>}
 */
async function testConnection() {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        return false;
    }

    try {
        const response = await axios.get(
            `${PINATA_BASE_URL}/data/userPinnedDataTotal`,
            {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY
                }
            }
        );
        return response.status === 200;
    } catch (error) {
        console.error('Pinata connection test failed:', error.message);
        return false;
    }
}

module.exports = {
    uploadToIPFS,
    uploadHerbMetadata,
    uploadImageToIPFS,
    getIPFSGatewayURL,
    unpinFromIPFS,
    testConnection
};
