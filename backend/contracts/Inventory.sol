// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title InventoryManager
 * @dev Inventory management for herb stock
 */
contract InventoryManager {
    struct InventoryItem {
        uint256 batchTokenId;
        uint256 quantity;
        string unit; // kg, g, pieces
        string storageLocation;
        uint256 lastUpdated;
    }

    mapping(uint256 => InventoryItem) public inventory;
    mapping(address => uint256[]) public userInventory;

    event InventoryUpdated(uint256 indexed batchId, uint256 quantity, address updater);

    function updateInventory(uint256 _batchId, uint256 _quantity, string memory _unit, string memory _location) external {
        inventory[_batchId] = InventoryItem({
            batchTokenId: _batchId,
            quantity: _quantity,
            unit: _unit,
            storageLocation: _location,
            lastUpdated: block.timestamp
        });
        
        emit InventoryUpdated(_batchId, _quantity, msg.sender);
    }

    function getInventory(uint256 _batchId) external view returns (InventoryItem memory) {
        return inventory[_batchId];
    }
}
