// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ColdStorageMonitor {
    struct StorageCondition {
        bytes32 batchId;
        uint256 temperature;
        uint256 humidity;
        uint256 co2Level;
        uint256 timestamp;
    }
    
    mapping(bytes32 => StorageCondition[]) public conditions;
    
    event ConditionRecorded(bytes32 indexed batchId, uint256 temperature);
    
    function recordConditions(
        bytes32 batchId,
        uint256 temperature,
        uint256 humidity,
        uint256 co2Level
    ) external {
        conditions[batchId].push(StorageCondition({
            batchId: batchId,
            temperature: temperature,
            humidity: humidity,
            co2Level: co2Level,
            timestamp: block.timestamp
        }));
        
        emit ConditionRecorded(batchId, temperature);
    }
    
    function getConditions(bytes32 batchId) external view returns (StorageCondition[] memory) {
        return conditions[batchId];
    }
}
