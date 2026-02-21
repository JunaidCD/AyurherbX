// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProductTracker {
    struct Product {
        bytes32 batchId;
        string name;
        string description;
        uint256 quantity;
        string currentLocation;
        address currentOwner;
        uint256 lastUpdate;
    }
    
    mapping(bytes32 => Product) public products;
    bytes32[] public productIds;
    
    event ProductCreated(bytes32 indexed batchId, string name, address indexed owner);
    event LocationUpdated(bytes32 indexed batchId, string newLocation);
    event OwnerUpdated(bytes32 indexed batchId, address indexed oldOwner, address indexed newOwner);
    
    function createProduct(
        bytes32 batchId,
        string calldata name,
        string calldata description,
        uint256 quantity,
        string calldata location
    ) external {
        require(products[batchId].lastUpdate == 0, "Product exists");
        
        products[batchId] = Product({
            batchId: batchId,
            name: name,
            description: description,
            quantity: quantity,
            currentLocation: location,
            currentOwner: msg.sender,
            lastUpdate: block.timestamp
        });
        productIds.push(batchId);
        
        emit ProductCreated(batchId, name, msg.sender);
    }
    
    function updateLocation(bytes32 batchId, string calldata newLocation) external {
        require(products[batchId].currentOwner == msg.sender, "Not owner");
        products[batchId].currentLocation = newLocation;
        products[batchId].lastUpdate = block.timestamp;
        
        emit LocationUpdated(batchId, newLocation);
    }
    
    function transferOwnership(bytes32 batchId, address newOwner) external {
        require(products[batchId].currentOwner == msg.sender, "Not owner");
        address oldOwner = products[batchId].currentOwner;
        products[batchId].currentOwner = newOwner;
        products[batchId].lastUpdate = block.timestamp;
        
        emit OwnerUpdated(batchId, oldOwner, newOwner);
    }
    
    function getProduct(bytes32 batchId) external view returns (Product memory) {
        return products[batchId];
    }
}
