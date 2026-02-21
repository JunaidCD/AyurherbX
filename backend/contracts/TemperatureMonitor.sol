// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TemperatureMonitor {
    struct TempRecord {
        bytes32 batchId;
        uint256 temperature;
        uint256 humidity;
        uint256 timestamp;
        string location;
    }
    
    mapping(bytes32 => TempRecord[]) public temperatureRecords;
    int256 public minTemperature = -50;
    int256 public maxTemperature = 60;
    
    event TemperatureRecorded(bytes32 indexed batchId, uint256 temperature, uint256 humidity);
    event TemperatureAlert(bytes32 indexed batchId, uint256 temperature, string alert);
    
    function recordTemperature(
        bytes32 batchId,
        uint256 temperature,
        uint256 humidity,
        string calldata location
    ) external {
        temperatureRecords[batchId].push(TempRecord({
            batchId: batchId,
            temperature: temperature,
            humidity: humidity,
            timestamp: block.timestamp,
            location: location
        }));
        
        emit TemperatureRecorded(batchId, temperature, humidity);
        
        if (int256(temperature) < minTemperature || int256(temperature) > maxTemperature) {
            emit TemperatureAlert(batchId, temperature, "Temperature out of range");
        }
    }
    
    function getTemperatureHistory(bytes32 batchId) external view returns (TempRecord[] memory) {
        return temperatureRecords[batchId];
    }
    
    function getLatestTemperature(bytes32 batchId) external view returns (uint256) {
        TempRecord[] memory records = temperatureRecords[batchId];
        if (records.length == 0) return 0;
        return records[records.length - 1].temperature;
    }
}
