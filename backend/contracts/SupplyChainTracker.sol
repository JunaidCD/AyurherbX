// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SupplyChainTracker
 * @dev Tracks complete supply chain journey of herb batches
 * Provides end-to-end provenance and journey mapping
 */
contract SupplyChainTracker is Ownable {

    // Supply chain stages
    enum Stage {
        Collection,
        Processing,
        Testing,
        Storage,
        Distribution,
        Retail,
        Consumed
    }

    // Journey checkpoint
    struct Checkpoint {
        uint256 id;
        uint256 batchTokenId;
        Stage stage;
        address custodian; // Current owner/handler
        string location;
        string locationCoordinates; // Lat/Long
        uint256 timestamp;
        string description;
        string documentURI; // IPFS reference
        bytes32 dataHash; // Hash of additional data
    }

    // Supply chain journey
    struct Journey {
        uint256 batchTokenId;
        Checkpoint[] checkpoints;
        Stage currentStage;
        address originalCollector;
        uint256 startTime;
        uint256 lastUpdateTime;
        bool isComplete;
    }

    // Stage duration tracking
    struct StageDuration {
        Stage stage;
        uint256 duration;
        uint256 count;
    }

    // Mappings
    mapping(uint256 => Journey) public journeys;
    mapping(uint256 => mapping(Stage => uint256)) public stageDurations;
    mapping(address => uint256[]) public custodianBatches;
    
    uint256 public nextCheckpointId = 1;

    // Events
    event JourneyStarted(
        uint256 indexed batchTokenId,
        address indexed collector,
        string location,
        uint256 timestamp
    );

    event CheckpointAdded(
        uint256 indexed checkpointId,
        uint256 indexed batchTokenId,
        Stage stage,
        address custodian,
        uint256 timestamp
    );

    event StageTransition(
        uint256 indexed batchTokenId,
        Stage fromStage,
        Stage toStage,
        address custodian,
        uint256 timestamp
    );

    event JourneyCompleted(
        uint256 indexed batchTokenId,
        uint256 totalCheckpoints,
        uint256 totalDuration,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Start a new supply chain journey
     */
    function startJourney(
        uint256 _batchTokenId,
        string memory _location,
        string memory _coordinates,
        string memory _description
    ) external returns (uint256) {
        require(journeys[_batchTokenId].startTime == 0, "Journey already exists");
        
        Journey storage journey = journeys[_batchTokenId];
        journey.batchTokenId = _batchTokenId;
        journey.currentStage = Stage.Collection;
        journey.originalCollector = msg.sender;
        journey.startTime = block.timestamp;
        journey.lastUpdateTime = block.timestamp;
        
        // Create initial checkpoint
        uint256 checkpointId = _addCheckpoint(
            _batchTokenId,
            Stage.Collection,
            msg.sender,
            _location,
            _coordinates,
            _description,
            ""
        );

        emit JourneyStarted(_batchTokenId, msg.sender, _location, block.timestamp);
        
        return checkpointId;
    }

    /**
     * @dev Add a checkpoint to the journey
     */
    function addCheckpoint(
        uint256 _batchTokenId,
        Stage _stage,
        string memory _location,
        string memory _coordinates,
        string memory _description,
        string memory _documentURI,
        bytes32 /* _dataHash */
    ) external returns (uint256) {
        Journey storage journey = journeys[_batchTokenId];
        require(journey.startTime > 0, "Journey not started");
        require(!journey.isComplete, "Journey already complete");
        
        // Validate stage progression
        if (_stage != journey.currentStage) {
            require(_getStageIndex(_stage) == _getStageIndex(journey.currentStage) + 1, "Invalid stage progression");
            emit StageTransition(_batchTokenId, journey.currentStage, _stage, msg.sender, block.timestamp);
            journey.currentStage = _stage;
        }

        uint256 checkpointId = _addCheckpoint(
            _batchTokenId,
            _stage,
            msg.sender,
            _location,
            _coordinates,
            _description,
            _documentURI
        );

        journey.lastUpdateTime = block.timestamp;
        
        // Track stage duration
        if (journey.checkpoints.length >= 2) {
            Checkpoint memory prev = journey.checkpoints[journey.checkpoints.length - 1];
            uint256 duration = block.timestamp - prev.timestamp;
            stageDurations[_batchTokenId][prev.stage] += duration;
        }

        return checkpointId;
    }

    /**
     * @dev Internal checkpoint creation
     */
    function _addCheckpoint(
        uint256 _batchTokenId,
        Stage _stage,
        address _custodian,
        string memory _location,
        string memory _coordinates,
        string memory _description,
        string memory _documentURI
    ) internal returns (uint256) {
        uint256 checkpointId = nextCheckpointId++;
        
        Journey storage journey = journeys[_batchTokenId];
        
        journey.checkpoints.push(Checkpoint({
            id: checkpointId,
            batchTokenId: _batchTokenId,
            stage: _stage,
            custodian: _custodian,
            location: _location,
            locationCoordinates: _coordinates,
            timestamp: block.timestamp,
            description: _description,
            documentURI: _documentURI,
            dataHash: bytes32(0)
        }));

        custodianBatches[_custodian].push(_batchTokenId);

        emit CheckpointAdded(checkpointId, _batchTokenId, _stage, _custodian, block.timestamp);

        return checkpointId;
    }

    /**
     * @dev Complete the supply chain journey
     */
    function completeJourney(uint256 _batchTokenId) external {
        Journey storage journey = journeys[_batchTokenId];
        require(journey.startTime > 0, "Journey not started");
        require(!journey.isComplete, "Already complete");
        
        journey.isComplete = true;
        journey.currentStage = Stage.Consumed;
        
        // Calculate total duration
        uint256 totalDuration = block.timestamp - journey.startTime;
        
        // Track final stage duration
        if (journey.checkpoints.length > 0) {
            Checkpoint memory last = journey.checkpoints[journey.checkpoints.length - 1];
            stageDurations[_batchTokenId][last.stage] += (block.timestamp - last.timestamp);
        }

        emit JourneyCompleted(
            _batchTokenId,
            journey.checkpoints.length,
            totalDuration,
            block.timestamp
        );
    }

    /**
     * @dev Get journey details
     */
    function getJourney(uint256 _batchTokenId) external view returns (Journey memory) {
        return journeys[_batchTokenId];
    }

    /**
     * @dev Get checkpoint details
     */
    function getCheckpoint(uint256 _batchTokenId, uint256 _index) external view returns (Checkpoint memory) {
        require(_index < journeys[_batchTokenId].checkpoints.length, "Invalid index");
        return journeys[_batchTokenId].checkpoints[_index];
    }

    /**
     * @dev Get all checkpoints for a batch
     */
    function getAllCheckpoints(uint256 _batchTokenId) external view returns (Checkpoint[] memory) {
        return journeys[_batchTokenId].checkpoints;
    }

    /**
     * @dev Get stage duration
     */
    function getStageDuration(uint256 _batchTokenId, Stage _stage) external view returns (uint256) {
        return stageDurations[_batchTokenId][_stage];
    }

    /**
     * @dev Get custodian's batches
     */
    function getCustodianBatches(address _custodian) external view returns (uint256[] memory) {
        return custodianBatches[_custodian];
    }

    /**
     * @dev Get journey timestamp
     */
    function getJourneyTime(uint256 _batchTokenId) external view returns (uint256 startTime, uint256 lastUpdate, uint256 duration) {
        Journey storage journey = journeys[_batchTokenId];
        return (journey.startTime, journey.lastUpdateTime, journey.lastUpdateTime - journey.startTime);
    }

    /**
     * @dev Verify journey authenticity
     */
    function verifyJourney(uint256 _batchTokenId) external view returns (
        bool isValid,
        uint256 checkpointCount,
        Stage currentStage,
        uint256 totalDuration
    ) {
        Journey storage journey = journeys[_batchTokenId];
        isValid = journey.startTime > 0;
        checkpointCount = journey.checkpoints.length;
        currentStage = journey.currentStage;
        totalDuration = journey.isComplete ? (journey.lastUpdateTime - journey.startTime) : (block.timestamp - journey.startTime);
    }

    /**
     * @dev Get stage index
     */
    function _getStageIndex(Stage _stage) internal pure returns (uint256) {
        return uint256(_stage);
    }

    /**
     * @dev Get checkpoint count
     */
    function getCheckpointCount() external view returns (uint256) {
        return nextCheckpointId - 1;
    }
}
