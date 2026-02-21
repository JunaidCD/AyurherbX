// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CultivationData {
    struct Cultivation {
        bytes32 batchId;
        string farmLocation;
        string soilType;
        string irrigationMethod;
        uint256 plantingDate;
    }
    
    mapping(bytes32 => Cultivation) public cultivations;
    
    event CultivationRecorded(bytes32 indexed batchId, string location);
    
    function recordCultivation(
        bytes32 batchId,
        string calldata location,
        string calldata soilType,
        string calldata irrigation
    ) external {
        cultivations[batchId] = Cultivation({
            batchId: batchId,
            farmLocation: location,
            soilType: soilType,
            irrigationMethod: irrigation,
            plantingDate: block.timestamp
        });
        
        emit CultivationRecorded(batchId, location);
    }
    
    function getCultivation(bytes32 batchId) external view returns (Cultivation memory) {
        return cultivations[batchId];
    }
}
