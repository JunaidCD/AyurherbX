// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WaterQuality {
    struct WaterTest {
        bytes32 batchId;
        uint256 ph;
        uint256 dissolvedOxygen;
        uint256 temperature;
        uint256 timestamp;
    }
    
    mapping(bytes32 => WaterTest[]) public waterTests;
    
    event WaterTested(bytes32 indexed batchId, uint256 ph);
    
    function recordWaterTest(
        bytes32 batchId,
        uint256 ph,
        uint256 dissolvedOxygen,
        uint256 temperature
    ) external {
        waterTests[batchId].push(WaterTest({
            batchId: batchId,
            ph: ph,
            dissolvedOxygen: dissolvedOxygen,
            temperature: temperature,
            timestamp: block.timestamp
        }));
        
        emit WaterTested(batchId, ph);
    }
    
    function getWaterTests(bytes32 batchId) external view returns (WaterTest[] memory) {
        return waterTests[batchId];
    }
}
