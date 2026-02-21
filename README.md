# 🌿 AyurHerb - Blockchain-Powered Ayurvedic Supply Chain Management

![AyurHerb Logo](https://img.shields.io/badge/AyurHerb-2.0-green?style=for-the-badge&logo=leaf)
![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue?style=for-the-badge&logo=ethereum)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [Smart Contract](#smart-contract)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Blockchain Integration](#blockchain-integration)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

AyurHerb is a comprehensive blockchain-powered supply chain management system specifically designed for Ayurvedic herbs and medicines. The platform ensures **immutable tracking via events + NFT metadata**, traceability, and authenticity throughout the entire supply chain from collection to consumer delivery.

The system leverages Ethereum blockchain technology (Sepolia testnet) with **NFT-based herb batch tracking** (ERC721), creating immutable records with unique token IDs, metadata for origin/quality, and environmental data stamps via Chainlink oracle integration.

## ✨ Features

### 🔐 Role-Based Access Control
- **Collectors**: Submit herb collections to blockchain
- **Processors**: Add processing steps with blockchain verification
- **Lab Testers**: Conduct and record quality tests
- **Admins**: Verify collections and manage system
- **Customers**: View verified products and supply chain data

### 🌱 Collection Management
- Digital herb collection submission
- Batch ID generation and tracking
- Location and quantity recording
- Blockchain immutable storage
- Real-time data persistence

### ⚙️ Processing Tracking
- Multi-step processing workflow
- Temperature and duration logging
- Processing type categorization (Drying, Grinding, Storage, etc.)
- Blockchain transaction signing
- MetaMask integration for verification

### 🔬 Quality Assurance
- Lab testing result recording
- Quality verification system
- Admin approval workflow
- 3-checkpoint verification (Quality, Purity, Authenticity)
- Comprehensive audit trails

### 📊 Analytics Dashboard
- Real-time statistics and metrics
- Processing step monitoring
- Collection status tracking
- Revenue and sales analytics
- Inventory management

### 🔗 Blockchain Features
- Ethereum Sepolia testnet integration
- **NFT-based herb batches** (ERC721) with unique token IDs
- **Chainlink oracle stub** for temperature/humidity/AQI stamps
- Immutable tracking via events + NFT metadata
- Smart contract deployment
- MetaMask wallet connectivity
- Transaction hash verification
- Etherscan explorer links
- **Quality verification** with A/B/C grading system

## 🛠 Technology Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization
- **Ethers.js 6.8.0** - Ethereum blockchain interaction

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Express Rate Limit** - API rate limiting

### Blockchain
- **Solidity ^0.8.19** - Smart contract language
- **Hardhat** - Ethereum development environment
- **Ethers.js** - Ethereum library
- **Sepolia Testnet** - Ethereum test network
- **MetaMask** - Web3 wallet integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Nodemon** - Auto-restart development server

## 🏗 Architecture

```
AyurHerb System Architecture

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Ethereum)    │
│                 │    │                 │    │                 │
│ • User Interface│    │ • API Routes    │    │ • Smart Contract│
│ • Wallet Connect│    │ • Blockchain    │    │ • Immutable     │
│ • State Mgmt    │    │   Service       │    │   Storage       │
│ • MetaMask      │    │ • Rate Limiting │    │ • Transaction   │
│   Integration   │    │ • CORS & Security│    │   Verification  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 👥 User Roles

### 🌾 Collector
- Submit herb collections with batch details
- Connect MetaMask wallet for blockchain transactions
- View submitted collections and processing status
- Generate QR codes for batch tracking

### ⚙️ Processor
- Add processing steps to collected herbs
- Record temperature, duration, and processing type
- Sign blockchain transactions for step verification
- Monitor processing dashboard with statistics

### 🔬 Lab Tester
- Conduct quality tests on processed herbs
- Record test results and certifications
- Verify purity and authenticity
- Generate lab reports

### 👨‍💼 Admin
- Verify submitted collections
- 3-checkpoint verification system
- Manage system users and permissions
- Access comprehensive analytics dashboard

### 🛒 Customer
- View verified products and supply chain data
- Track herb journey from collection to shelf
- Access quality certificates and test results
- Verify authenticity through blockchain

## 📜 Smart Contract

The system includes two main contracts in `HerbCollection.sol`:

### HerbNFT (ERC721) - Production Ready
The `HerbNFT` contract provides NFT-based herb batch tracking:

- **NFT Minting**: Each herb batch becomes a unique NFT with token ID
- **Metadata Storage**: IPFS URI for JSON metadata (origin, quality, harvest date)
- **Quality Grading**: A/B/C grade assignment via admin verification
- **Chainlink Integration**: Oracle stub for temperature/humidity/AQI data
- **Event Emission**: Immutable tracking via events (`HerbBatchMinted`, `HerbBatchVerified`, `EnvironmentalDataUpdated`)

### Key NFT Functions:
- `mintHerbBatch()` - Mint new herb batch as NFT with metadata
- `verifyHerbBatch()` - Assign quality grade (A, B, or C)
- `updateEnvironmentalData()` - Record temperature/humidity from oracle
- `getHerbBatch()` - Retrieve full batch data with environmental info
- `getBatchByCode()` - Quick lookup by batch code

### ChainlinkOracleStub
Stub contract for oracle integration (production: replace with actual Chainlink feeds):
- `requestEnvironmentalData()` - Request data from oracle
- `fulfillRequest()` - Oracle callback with data
- `getLatestData()` - Retrieve latest environmental readings

### HerbCollection (Legacy)
Backward-compatible original contract:
- `submitCollection()` - Store new herb collection
- `verifyCollection()` - Admin verification
- `getCollection()` - Retrieve collection data

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MetaMask** browser extension
- **Sepolia testnet ETH** for transactions
- **Git** for version control
- **Code editor** (VS Code recommended)

### MetaMask Setup:
1. Install MetaMask browser extension
2. Create or import wallet
3. Add Sepolia testnet to networks
4. Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AyurherbX.git
cd AyurherbX
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create `.env` file in backend directory:
```env
# Ethereum Configuration
PRIVATE_KEY=your_wallet_private_key_here
INFURA_PROJECT_ID=your_infura_project_id
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Server Configuration
PORT=3001
NODE_ENV=development

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Deploy Smart Contract
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Project

Follow these exact commands to run the project locally:

### Step 1: Start Backend Server
```bash
cd backend
npm install
npx hardhat run scripts/deploy.js --network sepolia
npm run dev
```

The backend server will start on `http://localhost:3001`

### Step 2: Start Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The frontend application will start on `http://localhost:5173/`

### Step 3: Access the Application
Open your browser and navigate to:
```
http://localhost:5173/
```

### 🔧 Development Commands

**Backend Commands:**
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run deploy      # Deploy smart contract
```

**Frontend Commands:**
```bash
npm run dev         # Start Vite development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

**Blockchain Commands:**
```bash
npx hardhat compile                              # Compile contracts
npx hardhat run scripts/deploy.js --network sepolia  # Deploy to Sepolia
npx hardhat test                                # Run contract tests
npx hardhat node                                # Start local blockchain
```

## 📁 Project Structure

```
AyurherbX/
├── 📁 backend/
│   ├── 📁 contracts/
│   │   └── HerbCollection.sol          # Smart contract
│   ├── 📁 scripts/
│   │   └── deploy.js                   # Deployment script
│   ├── 📁 routes/
│   │   ├── collections.js              # Collection API routes
│   │   └── blockchain.js               # Blockchain API routes
│   ├── 📁 services/
│   │   └── blockchainService.js        # Blockchain interaction
│   ├── 📁 artifacts/                   # Compiled contracts
│   ├── 📁 cache/                       # Hardhat cache
│   ├── server.js                       # Express server
│   ├── hardhat.config.js               # Hardhat configuration
│   ├── package.json                    # Backend dependencies
│   └── .env                           # Environment variables
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Sidebar/               # Navigation sidebar
│   │   │   ├── Topbar/                # Top navigation
│   │   │   └── WalletButton/          # MetaMask integration
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard/             # Role-based dashboards
│   │   │   ├── Collections/           # Herb collection management
│   │   │   ├── Batches/               # Batch viewing and tracking
│   │   │   ├── AddProcessingAdvanced/ # Processing step addition
│   │   │   └── SeeItem/               # Item details and verification
│   │   ├── 📁 contexts/
│   │   │   ├── CollectionsContext.jsx # Collection state management
│   │   │   └── WalletContext.jsx      # Wallet state management
│   │   ├── 📁 services/
│   │   │   └── walletService.js       # Blockchain interaction
│   │   ├── App.jsx                    # Main application component
│   │   └── main.jsx                   # Application entry point
│   ├── 📁 public/                     # Static assets
│   ├── index.html                     # HTML template
│   ├── package.json                   # Frontend dependencies
│   ├── tailwind.config.js             # TailwindCSS configuration
│   └── vite.config.js                 # Vite configuration
│
├── README.md                          # Project documentation
└── .git/                             # Git repository
```

## 🔌 API Endpoints

### Collection Routes (`/api/collections`)
```
GET    /api/collections                    # Get all collections
POST   /api/collections                    # Create new collection
GET    /api/collections/:id                # Get specific collection
PUT    /api/collections/:id                # Update collection
DELETE /api/collections/:id                # Delete collection
GET    /api/collections/collector/:address # Get collector's collections
```

### Blockchain Routes (`/api/blockchain`)
```
POST   /api/blockchain/submit              # Submit to blockchain
GET    /api/blockchain/transaction/:hash   # Get transaction details
POST   /api/blockchain/verify              # Verify on blockchain
GET    /api/blockchain/contract-info       # Get contract information
```

## ⛓️ Blockchain Integration

### Smart Contract Deployment
The system uses production-ready smart contracts deployed on Sepolia testnet:

```solidity
// HerbNFT - ERC721 for NFT-based herb batches
contract HerbNFT is ERC721, ERC721URIStorage, Ownable {
    struct HerbBatch {
        uint256 tokenId;
        string herbName;
        string batchCode;
        address collector;
        string originLocation;
        string harvestDate;
        string qualityGrade; // A, B, C
        bool isVerified;
        EnvironmentalData environmentalData;
    }
    
    struct EnvironmentalData {
        int256 temperature;    // Kelvin (x100)
        uint256 humidity;     // 0-100%
        uint256 airQualityIndex;
        uint256 lastUpdated;
    }
}

// ChainlinkOracleStub - Oracle integration stub
contract ChainlinkOracleStub {
    function getLatestData() returns (
        int256 temperature,
        uint256 humidity,
        uint256 airQualityIndex,
        uint256 timestamp
    );
}
```

### MetaMask Integration
- Automatic network switching to Sepolia
- Transaction signing for data submission
- Wallet connection management
- Gas estimation and optimization
- Transaction status tracking

### Data Storage Strategy
- **Primary**: Ethereum blockchain (immutable via NFTs)
- **Metadata**: IPFS for JSON metadata linked via tokenURI
- **Environmental**: Chainlink oracle data on-chain
- **Secondary**: localStorage (local backup)
- **Hybrid**: Blockchain + local storage for performance

## 🔧 Environment Variables

### Backend (.env)
```env
# Required
PRIVATE_KEY=your_ethereum_private_key
INFURA_PROJECT_ID=your_infura_project_id
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Optional
PORT=3001
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Environment)
No additional environment variables required. Configuration is handled through:
- Wallet connection (MetaMask)
- Smart contract addresses (auto-detected)
- Network configuration (Sepolia testnet)

## 🤝 Contributing

We welcome contributions to AyurHerb! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed
- Ensure blockchain integration works correctly

### Code Style
- Use ESLint configuration provided
- Follow React best practices
- Use TailwindCSS for styling
- Maintain consistent file structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**1. MetaMask Connection Issues**
- Ensure MetaMask is installed and unlocked
- Switch to Sepolia testnet
- Check if you have testnet ETH

**2. Smart Contract Deployment Fails**
- Verify `.env` configuration
- Check Infura project ID and RPC URL
- Ensure private key has testnet ETH

**3. Frontend Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (v16+ required)
- Verify all dependencies are installed

**4. Backend Server Issues**
- Check port 3001 is available
- Verify environment variables
- Ensure smart contract is deployed

### Getting Help
- Create an issue on GitHub
- Check existing documentation
- Review console logs for errors
- Verify blockchain network status

## 🚀 Deployment

### Production Deployment
1. **Build Frontend**: `npm run build`
2. **Deploy Smart Contract**: Update network configuration
3. **Configure Environment**: Set production environment variables
4. **Deploy Backend**: Use PM2 or similar process manager
5. **Serve Frontend**: Use Nginx or similar web server

### Testnet Deployment
- Current deployment: Sepolia testnet
- Smart contract address: Auto-generated during deployment
- Frontend URL: `http://localhost:5173/`
- Backend API: `http://localhost:3001/`

---

## 🌟 Key Features Highlight

- ✅ **Blockchain Immutability**: All data stored permanently on Ethereum via NFTs
- ✅ **NFT-Based Tracking**: Unique token IDs per herb batch
- ✅ **Chainlink Oracle Integration**: Temperature/humidity/AQI stamps
- ✅ **Immutable Tracking via Events**: HerbBatchMinted, HerbBatchVerified, EnvironmentalDataUpdated
- ✅ **MetaMask Integration**: Seamless wallet connectivity
- ✅ **Role-Based Access**: Secure multi-user system
- ✅ **Quality Grading**: A/B/C verification system
- ✅ **Supply Chain Tracking**: End-to-end provenance via NFT metadata

---

**Built with ❤️ by the AyurHerb Team**

*Revolutionizing Ayurvedic supply chain management through blockchain technology*
