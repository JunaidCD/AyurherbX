// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ClimateData {
    struct Climate {
        bytes32 batchId;
        uint256 temperature;
        uint256 humidity;
        uint256 rainfall;
        uint256 sunlight;
        uint256 timestamp;
    }
    
    mapping(bytes32 => Climate[]) public climateData;
    
    event ClimateRecorded(bytes32 indexed batchId, uint256 temperature);
    
    function recordClimate(
        bytes32 batchId,
        uint256 temperature,
        uint256 humidity,
        uint256 rainfall,
        uint256 sunlight
    ) external {
        climateData[batchId].push(Climate({
            batchId: batchId,
            temperature: temperature,
            humidity: humidity,
            rainfall: rainfall,
            sunlight: sunlight,
            timestamp: block.timestamp
        }));
        
        emit ClimateRecorded(batchId, temperature);
    }
    
    function getClimateData(bytes32 batchId) external view returns (Climate[] memory) {
        return climateData[batchId];
    }
}
