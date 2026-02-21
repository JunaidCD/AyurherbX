// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ColdChainManager
 * @dev Cold chain monitoring
 */
contract ColdChainManager {
    struct TemperatureLog {
        uint256 batchId;
        int256 temperature;
        uint256 timestamp;
    }

    mapping(uint256 => TemperatureLog[]) public temperatureLogs;

    function logTemperature(uint256 _batchId, int256 _temp) external {
        temperatureLogs[_batchId].push(TemperatureLog({
            batchId: _batchId,
            temperature: _temp,
            timestamp: block.timestamp
        }));
    }

    function getTemperatureLogs(uint256 _batchId) external view returns (TemperatureLog[] memory) {
        return temperatureLogs[_batchId];
    }
}
