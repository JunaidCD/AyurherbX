// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ComplianceContract
 * @dev Regulatory compliance tracking
 */
contract ComplianceContract {
    struct ComplianceRecord {
        uint256 batchTokenId;
        string standard; // ISO, GMP, organic
        bool passed;
        string auditor;
        uint256 auditDate;
        string certificateHash;
    }

    mapping(uint256 => ComplianceRecord[]) public complianceRecords;

    event ComplianceAdded(uint256 indexed batchId, string standard, bool passed);

    function addComplianceRecord(uint256 _batchId, string memory _standard, bool _passed, string memory _auditor) external {
        complianceRecords[_batchId].push(ComplianceRecord({
            batchTokenId: _batchId,
            standard: _standard,
            passed: _passed,
            auditor: _auditor,
            auditDate: block.timestamp,
            certificateHash: ""
        }));
        
        emit ComplianceAdded(_batchId, _standard, _passed);
    }

    function getComplianceRecords(uint256 _batchId) external view returns (ComplianceRecord[] memory) {
        return complianceRecords[_batchId];
    }
}
