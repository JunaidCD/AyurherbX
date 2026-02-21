// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SoilQuality {
    struct SoilTest {
        bytes32 batchId;
        uint256 ph;
        uint256 nitrogen;
        uint256 phosphorus;
        uint256 potassium;
        uint256 timestamp;
    }
    
    mapping(bytes32 => SoilTest[]) public soilTests;
    
    event SoilTested(bytes32 indexed batchId, uint256 ph);
    
    function recordSoilTest(
        bytes32 batchId,
        uint256 ph,
        uint256 nitrogen,
        uint256 phosphorus,
        uint256 potassium
    ) external {
        soilTests[batchId].push(SoilTest({
            batchId: batchId,
            ph: ph,
            nitrogen: nitrogen,
            phosphorus: phosphorus,
            potassium: potassium,
            timestamp: block.timestamp
        }));
        
        emit SoilTested(batchId, ph);
    }
    
    function getSoilTests(bytes32 batchId) external view returns (SoilTest[] memory) {
        return soilTests[batchId];
    }
}
