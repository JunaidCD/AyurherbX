// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HarvestTracker {
    struct Harvest {
        bytes32 harvestId;
        address farmer;
        bytes32 herbId;
        uint256 quantity;
        uint256 harvestDate;
        string location;
    }
    
    mapping(bytes32 => Harvest) public harvests;
    
    event HarvestRecorded(bytes32 indexed harvestId, address indexed farmer);
    
    function recordHarvest(
        bytes32 harvestId,
        bytes32 herbId,
        uint256 quantity,
        string calldata location
    ) external {
        harvests[harvestId] = Harvest({
            harvestId: harvestId,
            farmer: msg.sender,
            herbId: herbId,
            quantity: quantity,
            harvestDate: block.timestamp,
            location: location
        });
        
        emit HarvestRecorded(harvestId, msg.sender);
    }
    
    function getHarvest(bytes32 harvestId) external view returns (Harvest memory) {
        return harvests[harvestId];
    }
}
