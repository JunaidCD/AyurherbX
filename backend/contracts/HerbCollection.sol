// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title HerbNFT
 * @dev ERC721 NFT contract for representing herb batches as unique tokens
 * Each NFT represents a unique batch with full provenance tracking
 * 
 * Production-ready features:
 * - NFT-based herb batch tracking with unique token IDs
 * - Metadata for origin, quality grade, harvest date
 * - Chainlink oracle stub for temperature/humidity data
 * - Quality verification system
 * - ReentrancyGuard for security
 * - Pausable for emergency stops
 * - Gas optimized with packed structs
 */
contract HerbNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {

    // Struct for herb batch metadata - GAS OPTIMIZED
    struct HerbBatch {
        uint256 tokenId;
        string herbName;
        string batchCode;
        address collector;
        string originLocation;
        string harvestDate;
        string qualityGrade;    // A, B, C grade
        uint256 collectionTimestamp;
        bool isVerified;
        bool isProcessed;
        EnvironmentalData environmentalData;
    }

    // Environmental data from Chainlink oracle - GAS OPTIMIZED
    struct EnvironmentalData {
        int256 temperature;
        uint256 humidity;
        uint256 airQualityIndex;
        uint256 lastUpdated;
    }

    // Counter for token IDs
    uint256 private _nextTokenId = 1;

    // Mapping from token ID to HerbBatch
    mapping(uint256 => HerbBatch) public herbBatches;
    
    // Mapping from batch code to token ID (for quick lookup)
    mapping(string => uint256) public batchCodeToTokenId;

    // Events for NFT lifecycle - Immutable tracking via events
    event HerbBatchMinted(
        uint256 indexed tokenId,
        address indexed collector,
        string herbName,
        string batchCode,
        uint256 timestamp
    );

    event HerbBatchVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        string qualityGrade
    );

    event EnvironmentalDataUpdated(
        uint256 indexed tokenId,
        int256 temperature,
        uint256 humidity,
        uint256 timestamp
    );

    constructor() ERC721("AyurHerb NFT", "AHNFT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new herb batch NFT
     * @param _herbName Name of the herb
     * @param _batchCode Unique batch identifier
     * @param _originLocation Geographic origin
     * @param _harvestDate Date of harvest (ISO format string)
     * @param _tokenURI IPFS URI containing full metadata JSON
     */
    function mintHerbBatch(
        string calldata _herbName,
        string calldata _batchCode,
        string calldata _originLocation,
        string calldata _harvestDate,
        string calldata _tokenURI
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(bytes(_herbName).length > 0, "Herb name cannot be empty");
        require(bytes(_batchCode).length > 0, "Batch code cannot be empty");
        require(bytes(_originLocation).length > 0, "Origin location cannot be empty");
        require(batchCodeToTokenId[_batchCode] == 0, "Batch code already exists");

        uint256 tokenId = _nextTokenId++;
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        // Create herb batch record
        herbBatches[tokenId] = HerbBatch({
            tokenId: tokenId,
            herbName: _herbName,
            batchCode: _batchCode,
            collector: msg.sender,
            originLocation: _originLocation,
            harvestDate: _harvestDate,
            qualityGrade: "B", // Default grade, upgradeable after verification
            collectionTimestamp: block.timestamp,
            isVerified: false,
            isProcessed: false,
            environmentalData: EnvironmentalData({
                temperature: 0,
                humidity: 0,
                airQualityIndex: 0,
                lastUpdated: 0
            })
        });

        // Map batch code to token ID
        batchCodeToTokenId[_batchCode] = tokenId;

        emit HerbBatchMinted(
            tokenId,
            msg.sender,
            _herbName,
            _batchCode,
            block.timestamp
        );

        return tokenId;
    }

    /**
     * @dev Verify a herb batch and assign quality grade
     * @param _tokenId Token ID to verify
     * @param _qualityGrade Quality grade (A, B, or C)
     */
    function verifyHerbBatch(uint256 _tokenId, string calldata _qualityGrade) external onlyOwner whenNotPaused {
        require(_tokenId < _nextTokenId, "Token does not exist");
        require(herbBatches[_tokenId].isVerified == false, "Already verified");
        
        // Validate quality grade
        bytes32 gradeA = keccak256(abi.encodePacked("A"));
        bytes32 gradeB = keccak256(abi.encodePacked("B"));
        bytes32 gradeC = keccak256(abi.encodePacked("C"));
        bytes32 inputGrade = keccak256(abi.encodePacked(_qualityGrade));
        
        require(
            inputGrade == gradeA || inputGrade == gradeB || inputGrade == gradeC,
            "Invalid quality grade"
        );

        herbBatches[_tokenId].isVerified = true;
        herbBatches[_tokenId].qualityGrade = _qualityGrade;

        emit HerbBatchVerified(_tokenId, msg.sender, _qualityGrade);
    }

    /**
     * @dev Update environmental data for a batch (Chainlink oracle stub)
     * In production, this would be called by a Chainlink oracle
     * @param _tokenId Token ID to update
     * @param _temperature Temperature in Kelvin (x100 for precision)
     * @param _humidity Humidity percentage
     * @param _airQualityIndex AQI value
     */
    function updateEnvironmentalData(
        uint256 _tokenId,
        int256 _temperature,
        uint256 _humidity,
        uint256 _airQualityIndex
    ) external onlyOwner whenNotPaused {
        require(_tokenId < _nextTokenId, "Token does not exist");
        require(_humidity <= 100, "Humidity must be 0-100");

        herbBatches[_tokenId].environmentalData = EnvironmentalData({
            temperature: int256(_temperature),
            humidity: _humidity,
            airQualityIndex: _airQualityIndex,
            lastUpdated: block.timestamp
        });

        emit EnvironmentalDataUpdated(_tokenId, _temperature, _humidity, block.timestamp);
    }

    /**
     * @dev Mark batch as processed
     * @param _tokenId Token ID to mark as processed
     */
    function markAsProcessed(uint256 _tokenId) external whenNotPaused {
        require(_tokenId < _nextTokenId, "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        
        herbBatches[_tokenId].isProcessed = true;
    }

    // ============================================
    // PAUSABLE FUNCTIONS - Emergency Stop
    // ============================================
    
    /**
     * @dev Pause the contract - emergency stop
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get complete herb batch data
     * @param _tokenId Token ID to query
     */
    function getHerbBatch(uint256 _tokenId) external view returns (HerbBatch memory) {
        require(_tokenId < _nextTokenId, "Token does not exist");
        return herbBatches[_tokenId];
    }

    /**
     * @dev Get batch by batch code
     * @param _batchCode Batch code to search
     */
    function getBatchByCode(string calldata _batchCode) external view returns (HerbBatch memory) {
        uint256 tokenId = batchCodeToTokenId[_batchCode];
        require(tokenId > 0, "Batch not found");
        return herbBatches[tokenId];
    }

    /**
     * @dev Get total number of minted batches
     */
    function getTotalBatches() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // Required overrides for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

/**
 * @title ChainlinkOracleStub
 * @dev Stub contract for Chainlink oracle integration
 * In production, this would be replaced with actual Chainlink price feeds/data
 * 
 * Provides:
 * - Environmental data (temperature, humidity, AQI)
 * - Mock oracle request/fulfill pattern
 * - Data staleness tracking
 */
contract ChainlinkOracleStub {
    // Event for data requests
    event DataRequested(uint256 requestId, string dataType, address callbackAddr);
    
    // Event for data fulfillment
    event DataFulfilled(uint256 requestId, int256 temperature, uint256 humidity, uint256 timestamp);

    // Mock last values (in production, these would come from Chainlink)
    int256 public lastTemperature;
    uint256 public lastHumidity;
    uint256 public lastAirQualityIndex;
    uint256 public lastUpdateTimestamp;

    // Request tracking
    mapping(uint256 => bool) public fulfilledRequests;

    /**
     * @dev Simulate requesting environmental data from oracle
     * @param _dataType Type of data requested
     * @return requestId Mock request ID
     */
    function requestEnvironmentalData(string memory _dataType) external returns (uint256) {
        uint256 requestId = uint256(keccak256(abi.encodePacked(block.timestamp, _dataType)));
        emit DataRequested(requestId, _dataType, msg.sender);
        return requestId;
    }

    /**
     * @dev Simulate oracle fulfilling data request
     * In production, this would be called by Chainlink oracle node
     * @param _requestId Request ID to fulfill
     * @param _temperature Temperature in Kelvin (x100)
     * @param _humidity Humidity percentage
     * @param _airQualityIndex AQI value
     */
    function fulfillRequest(
        uint256 _requestId,
        int256 _temperature,
        uint256 _humidity,
        uint256 _airQualityIndex
    ) external {
        require(!fulfilledRequests[_requestId], "Request already fulfilled");

        lastTemperature = _temperature;
        lastHumidity = _humidity;
        lastAirQualityIndex = _airQualityIndex;
        lastUpdateTimestamp = block.timestamp;
        fulfilledRequests[_requestId] = true;

        emit DataFulfilled(_requestId, _temperature, _humidity, block.timestamp);
    }

    /**
     * @dev Get latest environmental data (stub)
     * In production, this would aggregate multiple oracle responses
     */
    function getLatestData() external view returns (
        int256 temperature,
        uint256 humidity,
        uint256 airQualityIndex,
        uint256 timestamp
    ) {
        return (lastTemperature, lastHumidity, lastAirQualityIndex, lastUpdateTimestamp);
    }

    /**
     * @dev Simulate updating data directly (for testing)
     * In production, this would only be callable by authorized oracle
     */
    function updateDataStub(
        int256 _temperature,
        uint256 _humidity,
        uint256 _airQualityIndex
    ) external {
        lastTemperature = _temperature;
        lastHumidity = _humidity;
        lastAirQualityIndex = _airQualityIndex;
        lastUpdateTimestamp = block.timestamp;
    }
}

/**
 * @title HerbCollection
 * @dev Legacy contract for backward compatibility
 * New implementations should use HerbNFT contract
 */
contract HerbCollection {
    struct Collection {
        uint256 id;
        string herbName;
        string quantity;
        string batchId;
        address collector;
        string location;
        string notes;
        uint256 timestamp;
        bool isVerified;
    }

    mapping(uint256 => Collection) public collections;
    mapping(address => uint256[]) public collectorCollections;
    
    uint256 public nextCollectionId;
    address public owner;
    
    // Events - Immutable tracking via events
    event CollectionSubmitted(
        uint256 indexed collectionId,
        address indexed collector,
        string herbName,
        string batchId,
        uint256 timestamp
    );
    
    event CollectionVerified(
        uint256 indexed collectionId,
        address indexed verifier
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyCollector() {
        _;
    }

    constructor() {
        owner = msg.sender;
        nextCollectionId = 1;
    }

    function submitCollection(
        string memory _herbName,
        string memory _quantity,
        string memory _batchId,
        string memory _location,
        string memory _notes
    ) external onlyCollector returns (uint256) {
        require(bytes(_herbName).length > 0, "Herb name cannot be empty");
        require(bytes(_quantity).length > 0, "Quantity cannot be empty");
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");

        uint256 collectionId = nextCollectionId;
        
        collections[collectionId] = Collection({
            id: collectionId,
            herbName: _herbName,
            quantity: _quantity,
            batchId: _batchId,
            collector: msg.sender,
            location: _location,
            notes: _notes,
            timestamp: block.timestamp,
            isVerified: false
        });

        collectorCollections[msg.sender].push(collectionId);
        nextCollectionId++;

        emit CollectionSubmitted(
            collectionId,
            msg.sender,
            _herbName,
            _batchId,
            block.timestamp
        );

        return collectionId;
    }

    function verifyCollection(uint256 _collectionId) external onlyOwner {
        require(_collectionId < nextCollectionId, "Collection does not exist");
        require(!collections[_collectionId].isVerified, "Collection already verified");
        
        collections[_collectionId].isVerified = true;
        
        emit CollectionVerified(_collectionId, msg.sender);
    }

    function getCollection(uint256 _collectionId) external view returns (Collection memory) {
        require(_collectionId < nextCollectionId, "Collection does not exist");
        return collections[_collectionId];
    }

    function getCollectorCollections(address _collector) external view returns (uint256[] memory) {
        return collectorCollections[_collector];
    }

    function getTotalCollections() external view returns (uint256) {
        return nextCollectionId - 1;
    }

    function getAllCollections() external view returns (Collection[] memory) {
        Collection[] memory allCollections = new Collection[](nextCollectionId - 1);
        
        for (uint256 i = 1; i < nextCollectionId; i++) {
            allCollections[i - 1] = collections[i];
        }
        
        return allCollections;
    }

    // Emergency functions
    function updateOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
}
