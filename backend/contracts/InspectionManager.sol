// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InspectionManager {
    struct Inspection {
        bytes32 batchId;
        address inspector;
        string result;
        bool passed;
        uint256 timestamp;
    }
    
    mapping(bytes32 => Inspection[]) public inspections;
    
    event InspectionRecorded(bytes32 indexed batchId, address indexed inspector, bool passed);
    
    function recordInspection(
        bytes32 batchId,
        string calldata result,
        bool passed
    ) external {
        inspections[batchId].push(Inspection({
            batchId: batchId,
            inspector: msg.sender,
            result: result,
            passed: passed,
            timestamp: block.timestamp
        }));
        
        emit InspectionRecorded(batchId, msg.sender, passed);
    }
    
    function getInspections(bytes32 batchId) external view returns (Inspection[] memory) {
        return inspections[batchId];
    }
}
