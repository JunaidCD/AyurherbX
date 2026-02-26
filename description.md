# AyurHerb - Project Description

## Overview

AyurHerb is a comprehensive blockchain-powered supply chain management platform designed specifically for the Ayurvedic herb and medicine industry. The platform provides end-to-end traceability and authenticity verification from farm to consumer, leveraging blockchain technology to ensure immutable records and transparent tracking of herbal products throughout their entire lifecycle.

## Project Type

**Full-Stack Web3 Application** - A decentralized supply chain management system combining traditional web technologies with blockchain infrastructure.

## Core Functionality

The platform enables multiple stakeholders in the Ayurvedic supply chain to digitally track, verify, and authenticate herb collections from the point of cultivation through to the final consumer. By utilizing blockchain technology, AyurHerb creates an immutable audit trail that prevents fraud, ensures quality compliance, and builds consumer trust in authentic Ayurvedic products.

### Key Capabilities

- **Digital Herb Collection Tracking**: Submit and track herb batches with unique NFT-based identifiers
- **Multi-Role Access Control**: Support for collectors, processors, lab testers, administrators, and consumers
- **Processing Workflow Management**: Document and verify each step of herb processing with blockchain timestamps
- **Quality Assurance**: Lab testing integration with A/B/C grading system and multi-checkpoint verification
- **Immutable Data Storage**: IPFS-based metadata storage with on-chain hash verification
- **Wallet Integration**: MetaMask-based authentication and transaction signing

## Technology Stack

### Frontend Layer
- **React 18** - Component-based UI framework
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first styling
- **Ethers.js v6** - Ethereum blockchain interaction
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Backend Layer
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **Express Rate Limit** - API rate limiting
- **Multer** - File upload handling

### Blockchain Layer
- **Solidity ^0.8.24** - Smart contract programming language
- **Hardhat** - Ethereum development environment
- **Polygon Amoy Testnet** - Layer 2 test network (recommended)
- **Ethereum Sepolia Testnet** - Layer 1 test network
- **Pinata IPFS** - Decentralized metadata storage

## Key Features

### Blockchain-Powered Traceability
Every herb batch is minted as an NFT (ERC721A) with metadata stored on IPFS. The blockchain maintains an immutable record of each batch's journey through the supply chain, including cultivation data, processing steps, quality test results, and transfer history.

### Role-Based System
The platform supports five distinct user roles with specific permissions and capabilities:
- **Collectors**: Submit new herb collections with geographic and quantity data
- **Processors**: Add processing steps including drying, grinding, and storage
- **Lab Testers**: Record quality verification results and assign grades
- **Admins**: Verify collections and manage system-wide settings
- **Consumers**: View product provenance and authenticity information

### Dual-Network Support
The system operates on two testnet networks to provide flexibility:
- **Polygon Amoy** (Chain ID: 80002) - Recommended for lower transaction costs (~88% savings)
- **Ethereum Sepolia** (Chain ID: 11155111) - Industry-standard L1 testnet

### Analytics Dashboard
Real-time statistics and metrics display collection volumes, processing status, quality distributions, and supply chain performance indicators.

## Architecture

The project follows a client-server architecture with blockchain integration:

- **Frontend**: React-based SPA communicating with backend APIs and directly with blockchain
- **Backend**: Express.js REST API handling business logic and IPFS interactions
- **Smart Contracts**: 80+ Solidity contracts covering supply chain, rewards, quality, and compliance
- **Storage**: Hybrid approach with on-chain data hashes and IPFS-based full metadata

## Deployment

- **Frontend**: Hosted on Vercel at `https://frontend-five-bay-68.vercel.app/login`
- **Backend**: Hosted on Render at `https://ayurherbx1.onrender.com/`
- **Smart Contracts**: Deployed to Polygon Amoy and Ethereum Sepolia testnets

## Target Users

AyurHerb serves the Ayurvedic industry ecosystem including herb collectors and farmers, processing facilities, quality assurance laboratories, regulatory bodies, Ayurvedic medicine manufacturers, and end consumers seeking authentic products with verified provenance.
