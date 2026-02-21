// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ComplianceVerifier {
    struct ComplianceCheck {
        bytes32 batchId;
        string regulation;
        bool compliant;
        string details;
        uint256 timestamp;
    }
    
    mapping(bytes32 => ComplianceCheck[]) public complianceChecks;
    
    event ComplianceChecked(bytes32 indexed batchId, string regulation, bool compliant);
    
    function performCheck(
        bytes32 batchId,
        string calldata regulation,
        bool compliant,
        string calldata details
    ) external {
        complianceChecks[batchId].push(ComplianceCheck({
            batchId: batchId,
            regulation: regulation,
            compliant: compliant,
            details: details,
            timestamp: block.timestamp
        }));
        
        emit ComplianceChecked(batchId, regulation, compliant);
    }
    
    function getComplianceChecks(bytes32 batchId) external view returns (ComplianceCheck[] memory) {
        return complianceChecks[batchId];
    }
}
