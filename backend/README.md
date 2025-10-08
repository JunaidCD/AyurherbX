# AyurHerb Backend - Blockchain Integration

This backend provides API endpoints for interacting with the AyurHerb smart contract on the Sepolia testnet.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or similar Web3 wallet
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file with:
   - `SEPOLIA_RPC_URL`: Get from [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/)
   - `PRIVATE_KEY`: Your wallet private key (for contract deployment)
   - `ETHERSCAN_API_KEY`: For contract verification (optional)

3. **Deploy Smart Contract:**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Start Server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📋 API Endpoints

### Blockchain Endpoints

#### Get Contract Info
```http
GET /api/blockchain/contract-info
```
Returns contract address, ABI, and network information.

#### Submit Collection
```http
POST /api/blockchain/submit-collection
Content-Type: application/json

{
  "collectionData": {
    "herbName": "Ashwagandha",
    "quantity": "25kg",
    "batchId": "BAT-2024-001",
    "location": "Kerala, India",
    "notes": "High quality organic herbs"
  },
  "userAddress": "0x..."
}
```

#### Get Collection by ID
```http
GET /api/blockchain/collection/:id
```

#### Get Collections by Collector
```http
GET /api/blockchain/collector/:address
```

#### Get All Collections
```http
GET /api/blockchain/collections
```

#### Verify Collection (Admin Only)
```http
POST /api/blockchain/verify-collection/:id
```

### Collection Endpoints

#### Submit New Collection
```http
POST /api/collections
Content-Type: application/json

{
  "herbName": "Brahmi",
  "quantity": "15kg",
  "batchId": "BAT-2024-002",
  "location": "Tamil Nadu, India",
  "notes": "Fresh morning harvest",
  "collectorAddress": "0x..."
}
```

#### Get All Collections
```http
GET /api/collections
```

#### Get Collection by ID
```http
GET /api/collections/:id
```

#### Get Collections by Collector
```http
GET /api/collections/collector/:address
```

#### Verify Collection
```http
PATCH /api/collections/:id/verify
```

## 🔧 Smart Contract

The `HerbCollection` smart contract stores:
- Herb name and quantity
- Batch ID and collector address
- Location and collection notes
- Timestamp and verification status

### Contract Functions

- `submitCollection()`: Submit new collection data
- `getCollection()`: Retrieve collection by ID
- `getCollectorCollections()`: Get all collections for a collector
- `getAllCollections()`: Get all collections
- `verifyCollection()`: Mark collection as verified (admin only)

## 🌐 Network Configuration

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer**: https://sepolia.etherscan.io/

### Getting Testnet ETH
1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request testnet ETH

## 🔐 Security Features

- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS protection
- Input validation
- Error handling

## 📁 Project Structure

```
backend/
├── contracts/              # Smart contracts
│   └── HerbCollection.sol
├── scripts/               # Deployment scripts
│   └── deploy.js
├── services/              # Business logic
│   └── blockchainService.js
├── routes/                # API routes
│   ├── blockchain.js
│   └── collections.js
├── contracts-info/        # Contract deployment info
├── hardhat.config.js      # Hardhat configuration
├── server.js              # Express server
└── package.json
```

## 🧪 Testing

### Manual Testing
1. Start the server: `npm run dev`
2. Use Postman or curl to test endpoints
3. Check transaction on [Sepolia Etherscan](https://sepolia.etherscan.io/)

### Contract Testing
```bash
npx hardhat test
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `SEPOLIA_RPC_URL`: Ethereum RPC endpoint
- `PRIVATE_KEY`: Wallet private key
- `COLLECTION_CONTRACT_ADDRESS`: Deployed contract address

## 🔍 Monitoring

- Health check endpoint: `GET /health`
- Server logs with Morgan
- Error tracking and handling

## 📞 Support

For issues or questions:
1. Check the logs for error messages
2. Verify your `.env` configuration
3. Ensure you have testnet ETH
4. Check contract deployment status

## 🔗 Useful Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com/)
- [MetaMask Setup](https://metamask.io/)
