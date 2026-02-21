// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InventoryTracker {
    struct InventoryItem {
        bytes32 batchId;
        uint256 quantity;
        string location;
        uint256 lastUpdated;
        bool active;
    }
    
    mapping(bytes32 => InventoryItem) public inventory;
    bytes32[] public inventoryIds;
    
    event InventoryUpdated(bytes32 indexed batchId, uint256 quantity, string location);
    event InventoryTransferred(bytes32 indexed batchId, address indexed from, address indexed to);
    
    function addInventory(
        bytes32 batchId,
        uint256 quantity,
        string calldata location
    ) external {
        require(inventory[batchId].lastUpdated == 0, "Already exists");
        
        inventory[batchId] = InventoryItem({
            batchId: batchId,
            quantity: quantity,
            location: location,
            lastUpdated: block.timestamp,
            active: true
        });
        inventoryIds.push(batchId);
        
        emit InventoryUpdated(batchId, quantity, location);
    }
    
    function updateQuantity(bytes32 batchId, uint256 newQuantity) external {
        require(inventory[batchId].lastUpdated != 0, "Not found");
        inventory[batchId].quantity = newQuantity;
        inventory[batchId].lastUpdated = block.timestamp;
        
        emit InventoryUpdated(batchId, newQuantity, inventory[batchId].location);
    }
    
    function getInventory(bytes32 batchId) external view returns (InventoryItem memory) {
        return inventory[batchId];
    }
}
