# 🏗 AyurHerb System Architecture

## Overview

AyurHerb is a blockchain-powered supply chain management system for Ayurvedic herbs and medicines. This document provides a comprehensive architectural overview of the system.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    USERS                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Collector│  │Processor │  │Lab Tester│  │  Admin   │  │Customer  │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │             │             │             │                  │
└───────┼─────────────┼─────────────┼─────────────┼─────────────┼──────────────────┘
        │             │             │             │             │
        ▼             ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         React Application                                │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │  Dashboard  │  │Collections  │  │ Batches     │  │  SeeItem    │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │Processing   │  │  LabTest    │  │Verification │  │  Wallet     │    │    │
│  │  │             │  │             │  │   Report    │  │  Button     │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                            │
│                           ┌────────▼────────┐                                  │
│                           │  WalletContext  │                                  │
│                           │  (Ethers.js)    │                                  │
│                           └────────┬────────┘                                  │
└────────────────────────────────────┼────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND (Express.js)                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          API Server (Port 5000)                         │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │/api/collections│ │/api/blockchain│ │  /api/pinata │ │    /       │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                            │
│         ┌─────────────────────────┼─────────────────────────┐                  │
│         ▼                         ▼                         ▼                  │
│  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐           │
│  │ Blockchain  │          │  Pinata     │          │  Express    │           │
│  │  Service    │          │  Service    │          │ Middleware  │           │
│  │             │          │  (IPFS)     │          │             │           │
│  └──────┬──────┘          └──────┬──────┘          └─────────────┘           │
│         │                        │                                            │
└─────────┼────────────────────────┼──────────────────────────────────────────────┘
          │                        │
          ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BLOCKCHAIN LAYER                                      │
│                                                                                  │
│    ┌─────────────────────────────────────────────────────────────────────────┐  │
│    │                    Polygon Amoy / Ethereum Sepolia                      │  │
│    │                                                                          │  │
│    │  ┌─────────────────────┐    ┌─────────────────────┐                       │  │
│    │  │   HerbCollection  │    │   SupplyChain      │                       │  │
│    │  │      (NFT)        │    │    Tracker         │                       │  │
│    │  │                   │    │                    │                       │  │
│    │  │ • mintHerbBatch   │    │ • trackBatch       │                       │  │
│    │  │ • verifyHerbBatch│    │ • updateStatus     │                       │  │
│    │  │ • getHerbBatch   │    │ • getHistory       │                       │  │
│    │  └─────────────────────┘    └─────────────────────┘                       │  │
│    │                                                                          │  │
│    │  ┌─────────────────────┐    ┌─────────────────────┐                       │  │
│    │  │   RewardsContract │    │  ChainlinkOracle   │                       │  │
│    │  │                   │    │     (Stub)          │                       │  │
│    │  │ • claimPoints     │    │                    │                       │  │
│    │  │ • transferPoints │    │ • getTemperature   │                       │  │
│    │  │ • getBalance      │    │ • getHumidity      │                       │  │
│    │  └─────────────────────┘    └─────────────────────┘                       │  │
│    │                                                                          │  │
│    └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│    MetaMask Wallet ◄─────────────────────────────────────────► Block Explorer   │
│    (User Auth)                                                          (Etherscan/Polygonscan)
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            OFF-CHAIN STORAGE                                    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           IPFS (Pinata)                                  │    │
│  │                                                                          │    │
│  │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                 │    │
│  │   │ Herb Image  │   │  Metadata   │   │  Lab Test   │                 │    │
│  │   │    (NFT)    │   │    (JSON)   │   │   Reports   │                 │    │
│  │   └─────────────┘   └─────────────┘   └─────────────┘                 │    │
│  │                                                                          │    │
│  │   CID:QmXyZ...   │   CID:QmAbC...   │   CID:QmDeF...                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   index.html    │
                              │   (Entry Point) │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │    main.jsx     │
                              │  (React Root)   │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │     App.jsx     │
                              │ (Main Router)   │
                              └────────┬────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
   ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
   │   Sidebar     │           │    Topbar     │           │  WalletButton │
   │  Navigation   │           │               │           │  (MetaMask)   │
   └───────────────┘           └───────────────┘           └───────┬───────┘
                                                                       │
                                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CONTEXT LAYER                                     │
│  ┌─────────────────────┐                      ┌─────────────────────┐            │
│  │   WalletContext    │                      │ CollectionsContext │            │
│  │                    │                      │                     │            │
│  │ • account          │                      │ • collections      │            │
│  │ • chainId          │                      │ • addCollection()  │            │
│  │ • connectWallet()  │                      │ • updateCollection│            │
│  │ • contract         │                      │ • getCollections() │            │
│  └─────────────────────┘                      └─────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          walletService.js                                │   │
│  │                                                                          │   │
│  │  • connectWallet()     • submitCollection()      • getContract()       │   │
│  │  • switchNetwork()     • verifyCollection()      • loadContract()      │   │
│  │  • getBalance()        • processBatch()           • handleError()       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PAGE LAYER                                        │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Dashboard  │  │Collections  │  │  Batches   │  │  SeeItem   │            │
│  │             │  │             │  │             │  │            │            │
│  │ • Stats     │  │ • Add New   │  │ • List All  │  │ • Details  │            │
│  │ • Charts    │  │ • View All  │  │ • Track     │  │ • QR Code  │            │
│  │ • Tables    │  │ • Submit    │  │ • History   │  │ • Verify   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Processing  │  │  Lab Test   │  │Verification │  │  Profile   │            │
│  │             │  │             │  │   Report    │  │            │            │
│  │ • Add Step  │  │ • Submit    │  │ • View      │  │ • Settings │            │
│  │ • History   │  │ • Results   │  │ • Download  │  │ • Wallet   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │   Express Server    │
                        │     (Port 5000)     │
                        └──────────┬──────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CORS Middle   │    │     Helmet      │    │   Rate Limiter  │
│   (Security)    │    │    (Security)   │    │    (Protection) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │    API Routes       │
                        └──────────┬──────────┘
                                   │
    ┌──────────────────────────────┼──────────────────────────────┐
    │                              │                              │
    ▼                              ▼                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│/api/collections │    │/api/blockchain  │    │  /api/pinata    │
│                 │    │                 │    │                 │
│ • GET /         │    │ • GET /contract │    │ • GET /test     │
│ • POST /        │    │ • POST /submit  │    │ • POST /upload  │
│ • GET /:id      │    │ • GET /tx/:hash │    │ • DELETE /unpin │
│ • PUT /:id      │    │ • POST /verify  │    │ • GET /gateway  │
│ • DELETE /:id   │    │                 │    │                 │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                   │
│                                                                          │
│  ┌─────────────────────────┐  ┌─────────────────────────┐              │
│  │   Blockchain Service    │  │    Pinata Service       │              │
│  │                         │  │    (IPFS)               │              │
│  │ • getContractAddress()  │  │ • uploadMetadata()      │              │
│  │ • submitCollection()    │  │ • uploadImage()         │              │
│  │ • verifyCollection()    │  │ • unpinFile()           │              │
│  │ • getCollection()       │  │ • getGatewayUrl()       │              │
│  │ • getAllCollections()   │  │                         │              │
│  └─────────────────────────┘  └─────────────────────────┘              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN INTERACTION                              │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Ethers.js Provider                         │    │
│  │                                                                  │    │
│  │  • JsonRpcProvider (Sepolia/Amoy RPC)                          │    │
│  │  • Wallet (Private Key)                                         │    │
│  │  • Contract Instance                                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                    │                                      │
│                                    ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Smart Contracts                             │    │
│  │                                                                  │    │
│  │  • HerbCollection.sol     • RewardsContract.sol                 │    │
│  │  • SupplyChainTracker.sol                                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Collection Submission Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Collector│     │ Frontend │     │ Backend  │     │Blockchain│     │  IPFS    │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │               │               │               │               │
     │ 1.Submit      │               │               │               │
     │──────────────>│               │               │               │
     │               │ 2.API Call    │               │               │
     │               │──────────────>│               │               │
     │               │               │ 3.Upload to   │               │
     │               │               │───────────────>│              │
     │               │               │               │ 4.Mint NFT   │
     │               │               │               │──────────────>│
     │               │               │               │               │
     │               │               │               │ 5.Store CID  │
     │               │               │               │<──────────────│
     │               │               │               │               │
     │               │               │ 6.Return     │               │
     │               │               │<─────────────│               │
     │               │ 7.Response    │               │               │
     │               │<──────────────│               │               │
     │ 8.Confirmation               │               │               │
     │<──────────────│               │               │               │
     │               │               │               │               │
```

### Verification Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │     │ Frontend │     │ Backend  │     │Blockchain│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │               │               │               │
     │ 1.Verify     │               │               │
     │──────────────>│               │               │
     │               │ 2.API Call   │               │
     │               │──────────────>│               │
     │               │               │ 3.Call       │
     │               │               │verify()      │
     │               │               │─────────────>│
     │               │               │               │
     │               │               │ 4.Emit Event │
     │               │               │<─────────────│
     │               │               │               │
     │               │               │ 5.Response   │
     │               │               │<─────────────│
     │               │ 6.Updated     │               │
     │               │<──────────────│               │
     │ 7.Confirmed  │               │               │
     │<──────────────│               │               │
     │               │               │               │
```

---

## Smart Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SMART CONTRACT LAYER                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Core Contracts                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────┐    ┌───────────────────────┐                   │
│  │    HerbCollection     │    │   SupplyChainTracker  │                   │
│  │      (ERC721)         │    │                        │                   │
│  ├───────────────────────┤    ├───────────────────────┤                   │
│  │ State:                │    │ State:                │                   │
│  │ • collections[]       │    │ • batches[]           │                   │
│  │ • nextCollectionId     │    │ • batchHistory[]      │                   │
│  │ • collectorCollections │    │ • batchStatus         │                   │
│  ├───────────────────────┤    ├───────────────────────┤                   │
│  │ Functions:            │    │ Functions:            │                   │
│  │ • submitCollection()  │    │ • trackBatch()        │                   │
│  │ • verifyCollection()  │    │ • updateStatus()      │                   │
│  │ • getCollection()     │    │ • getHistory()        │                   │
│  │ • getAllCollections() │    │ • getBatchByCode()    │                   │
│  └───────────────────────┘    └───────────────────────┘                   │
│                                                                             │
│  ┌───────────────────────┐    ┌───────────────────────┐                   │
│  │   RewardsContract     │    │    ChainlinkOracle   │                   │
│  │                       │    │      (Stub)          │                   │
│  ├───────────────────────┤    ├───────────────────────┤                   │
│  │ State:                │    │ State:               │                   │
│  │ • pointsBalance       │    │ • latestTemperature  │                   │
│  │ • rewardRates         │    │ • latestHumidity     │                   │
│  │ • accumulatedPoints   │    │ • latestAQI          │                   │
│  ├───────────────────────┤    ├───────────────────────┤                   │
│  │ Functions:            │    │ Functions:           │                   │
│  │ • claimPoints()       │    │ • requestData()      │                   │
│  │ • transferPoints()    │    │ • fulfillRequest()   │                   │
│  │ • getBalance()        │    │ • getLatestData()    │                   │
│  └───────────────────────┘    └───────────────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        Supporting Contracts                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AccessControl.sol          - Role-based access control                     │
│  CertificationManager.sol   - Quality certifications                        │
│  ProcessingContract.sol    - Processing workflows                           │
│  QualityTestContract.sol   - Lab test results                              │
│  DataRegistry.sol          - Data management                               │
│  ... (80+ contracts)       - Additional features                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Network Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NETWORK ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │   Main App      │
                         │  (localhost:    │
                         │   5173)         │
                         └────────┬────────┘
                                  │
                                  │ HTTP
                                  ▼
                         ┌─────────────────┐
                         │   Backend API   │
                         │  (localhost:    │
                         │   5000)         │
                         └────────┬────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
   │   IPFS       │     │  Polygon     │     │  Ethereum    │
   │  (Pinata)    │     │    Amoy      │     │   Sepolia    │
   │              │     │  (Chain ID:  │     │ (Chain ID:   │
   │ • Metadata   │     │   80002)     │     │   11155111)  │
   │ • Images     │     │              │     │              │
   │ • Documents  │     │ • Lower Gas │     │ • L1 Standard│
   └──────────────┘     └──────────────┘     └──────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │   MetaMask   │
                              │   (Wallet)   │
                              └──────────────┘
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | User Interface |
| **Styling** | TailwindCSS | Responsive Design |
| **State** | React Context | State Management |
| **Blockchain** | Ethers.js v6 | Web3 Integration |
| **Backend** | Express.js | API Server |
| **Database** | localStorage + IPFS | Data Persistence |
| **Smart Contracts** | Solidity ^0.8.24 | Blockchain Logic |
| **Development** | Hardhat | Contract Compilation |
| **Testnets** | Polygon Amoy, Ethereum Sepolia | Testing Networks |
| **IPFS** | Pinata | Off-chain Storage |

---

## Security Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYER                                   │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │  Role-Based    │  │   Input         │  │   Rate          │
  │  Access        │  │   Validation    │  │   Limiting      │
  │  Control       │  │                 │  │                 │
  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
           │                    │                    │
           ▼                    ▼                    ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                     Security Middleware                        │
  │  • CORS Configuration                                          │
  │  • Helmet.js (HTTP Headers)                                    │
  │  • Express Rate Limit                                          │
  │  • Input Sanitization                                          │
  └─────────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                     Blockchain Security                         │
  │  • OpenZeppelin Contracts (Audited)                            │
  │  • Access Control Lists                                        │
  │  • Event Logging for Auditing                                  │
  │  • Immutable Transaction History                                │
  └─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

   Development              Staging                 Production
   ┌─────────┐             ┌─────────┐            ┌─────────┐
   │  Local  │────────────▶│ Testnet │───────────▶│ Mainnet │
   │  Host   │             │ (Amoy/  │            │         │
   │         │             │ Sepolia)│            │         │
   └─────────┘             └─────────┘            └─────────┘
       │                       │                       │
       ▼                       ▼                       ▼
   ┌─────────┐             ┌─────────┐            ┌─────────┐
   │ npm run │             │ Hardhat │            │ Hardhat │
   │  dev   │             │ Deploy  │            │ Deploy  │
   └─────────┘             └─────────┘            └─────────┘

   Frontend: Vite        Frontend: Netlify      Frontend: Vercel/Netlify
   Backend:  localhost    Backend:  Render       Backend:  AWS/DigitalOcean
```

---

*Last Updated: February 2026*
*Version: 2.0*
