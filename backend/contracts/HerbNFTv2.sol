// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title HerbNFTv2
 * @dev ERC721 NFT contract with Role-Based Access Control (RBAC)
 * 
 * Key Features:
 * - Role-Based Access Control (ADMIN, COLLECTOR, PROCESSOR, LAB, VERIFIER)
 * - ReentrancyGuard for security
 * - Pausable for emergencies
 * - Batch minting support
 */
contract HerbNFTv2 is ERC721, ERC721URIStorage, AccessControl, ReentrancyGuard, Pausable {

    // ============================================
    // ROLES DEFINITION (RBAC)
    // ============================================
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant COLLECTOR_ROLE = keccak256("COLLECTOR_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // ============================================
    // STRUCTS
    // ============================================
    struct HerbBatch {
        uint256 tokenId;
        string herbName;
        string batchCode;
        address collector;
        string originLocation;
        string harvestDate;
        string qualityGrade;
        uint64 collectionTimestamp;
        bool isVerified;
        bool isProcessed;
        EnvironmentalData environmentalData;
    }

    struct EnvironmentalData {
        int256 temperature;
        uint256 humidity;
        uint256 airQualityIndex;
        uint256 lastUpdated;
    }

    // ============================================
    // STATE VARIABLES
    // ============================================
    uint256 private _nextTokenId = 1;
    mapping(uint256 => HerbBatch) public herbBatches;
    mapping(string => uint256) public batchCodeToTokenId;

    // Events
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

    // ============================================
    // CONSTRUCTOR - Initialize RBAC
    // ============================================
    constructor() ERC721("AyurHerb NFT v2", "AHNFTv2") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // ============================================
    // MODIFIERS
    // ============================================
    modifier onlyAdminOrVerifier() {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(VERIFIER_ROLE, msg.sender),
            "Not authorized: admin or verifier"
        );
        _;
    }

    modifier onlyMinterOrAdmin() {
        require(
            hasRole(MINTER_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized: minter or admin"
        );
        _;
    }

    // ============================================
    // BATCH MINTING
    // ============================================
    
    /**
     * @dev Mint multiple herb batches in a single transaction
     */
    function batchMint(
        string[] memory _herbNames,
        string[] memory _batchCodes,
        string[] memory _originLocations,
        string[] memory _harvestDates,
        string[] memory _tokenURIs
    ) external whenNotPaused nonReentrant onlyMinterOrAdmin {
        require(
            _herbNames.length == _batchCodes.length &&
            _batchCodes.length == _originLocations.length &&
            _originLocations.length == _harvestDates.length &&
            _harvestDates.length == _tokenURIs.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < _herbNames.length; i++) {
            uint256 tokenId = _nextTokenId++;
            
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, _tokenURIs[i]);

            herbBatches[tokenId] = HerbBatch({
                tokenId: tokenId,
                herbName: _herbNames[i],
                batchCode: _batchCodes[i],
                collector: msg.sender,
                originLocation: _originLocations[i],
                harvestDate: _harvestDates[i],
                qualityGrade: "B",
                collectionTimestamp: uint64(block.timestamp),
                isVerified: false,
                isProcessed: false,
                environmentalData: EnvironmentalData({
                    temperature: 0,
                    humidity: 0,
                    airQualityIndex: 0,
                    lastUpdated: 0
                })
            });

            batchCodeToTokenId[_batchCodes[i]] = tokenId;

            emit HerbBatchMinted(tokenId, msg.sender, _herbNames[i], _batchCodes[i], block.timestamp);
        }
    }

    /**
     * @dev Single mint
     */
    function mintHerbBatch(
        string calldata _herbName,
        string calldata _batchCode,
        string calldata _originLocation,
        string calldata _harvestDate,
        string calldata _tokenURI
    ) external whenNotPaused nonReentrant onlyMinterOrAdmin returns (uint256) {
        require(bytes(_herbName).length > 0, "Herb name cannot be empty");
        require(bytes(_batchCode).length > 0, "Batch code cannot be empty");
        require(bytes(_originLocation).length > 0, "Origin location cannot be empty");
        require(batchCodeToTokenId[_batchCode] == 0, "Batch code already exists");

        uint256 tokenId = _nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        herbBatches[tokenId] = HerbBatch({
            tokenId: tokenId,
            herbName: _herbName,
            batchCode: _batchCode,
            collector: msg.sender,
            originLocation: _originLocation,
            harvestDate: _harvestDate,
            qualityGrade: "B",
            collectionTimestamp: uint64(block.timestamp),
            isVerified: false,
            isProcessed: false,
            environmentalData: EnvironmentalData({
                temperature: 0,
                humidity: 0,
                airQualityIndex: 0,
                lastUpdated: 0
            })
        });

        batchCodeToTokenId[_batchCode] = tokenId;

        emit HerbBatchMinted(tokenId, msg.sender, _herbName, _batchCode, block.timestamp);

        return tokenId;
    }

    // ============================================
    // VERIFICATION (RBAC protected)
    // ============================================
    function verifyHerbBatch(uint256 _tokenId, string calldata _qualityGrade) 
        external onlyAdminOrVerifier whenNotPaused {
        require(_tokenId < _nextTokenId, "Token does not exist");
        require(herbBatches[_tokenId].isVerified == false, "Already verified");
        
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

    // ============================================
    // ENVIRONMENTAL DATA
    // ============================================
    function updateEnvironmentalData(
        uint256 _tokenId,
        int256 _temperature,
        uint256 _humidity,
        uint256 _airQualityIndex
    ) external onlyAdminOrVerifier whenNotPaused {
        require(_tokenId < _nextTokenId, "Token does not exist");
        require(_humidity <= 100, "Humidity must be 0-100");

        herbBatches[_tokenId].environmentalData = EnvironmentalData({
            temperature: _temperature,
            humidity: _humidity,
            airQualityIndex: _airQualityIndex,
            lastUpdated: block.timestamp
        });

        emit EnvironmentalDataUpdated(_tokenId, _temperature, _humidity, block.timestamp);
    }

    // ============================================
    // PROCESSING
    // ============================================
    function markAsProcessed(uint256 _tokenId) external whenNotPaused {
        require(_tokenId < _nextTokenId, "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        
        herbBatches[_tokenId].isProcessed = true;
    }

    // ============================================
    // PAUSABLE - Emergency Stop
    // ============================================
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // ============================================
    // ROLE MANAGEMENT (RBAC Functions)
    // ============================================
    function grantMinterRole(address _account) external onlyRole(ADMIN_ROLE) {
        grantRole(MINTER_ROLE, _account);
    }

    function grantVerifierRole(address _account) external onlyRole(ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, _account);
    }

    function grantProcessorRole(address _account) external onlyRole(ADMIN_ROLE) {
        grantRole(PROCESSOR_ROLE, _account);
    }

    function grantLabRole(address _account) external onlyRole(ADMIN_ROLE) {
        grantRole(LAB_ROLE, _account);
    }

    function grantCollectorRole(address _account) external onlyRole(ADMIN_ROLE) {
        grantRole(COLLECTOR_ROLE, _account);
    }

    function revokeMinterRole(address _account) external onlyRole(ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, _account);
    }

    function revokeVerifierRole(address _account) external onlyRole(ADMIN_ROLE) {
        revokeRole(VERIFIER_ROLE, _account);
    }

    // ============================================
    // GETTERS
    // ============================================
    function getHerbBatch(uint256 _tokenId) external view returns (HerbBatch memory) {
        require(_tokenId < _nextTokenId, "Token does not exist");
        return herbBatches[_tokenId];
    }

    function getBatchByCode(string calldata _batchCode) external view returns (HerbBatch memory) {
        uint256 tokenId = batchCodeToTokenId[_batchCode];
        require(tokenId > 0, "Batch not found");
        return herbBatches[tokenId];
    }

    function getTotalBatches() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function hasRoleByAddress(bytes32 _role, address _account) external view returns (bool) {
        return hasRole(_role, _account);
    }

    // ============================================
    // REQUIRED OVERRIDES
    // ============================================
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
