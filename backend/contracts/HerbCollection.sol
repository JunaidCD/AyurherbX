// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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
    
    // Events
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
        // In a real implementation, you might have a role-based system
        // For now, any address can be a collector
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
