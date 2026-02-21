// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AuditTrail {
    struct AuditEntry {
        bytes32 batchId;
        string action;
        address actor;
        uint256 timestamp;
        string details;
    }
    
    mapping(bytes32 => AuditEntry[]) public auditLogs;
    
    event AuditEntryAdded(bytes32 indexed batchId, string action, address indexed actor);
    
    function addAuditEntry(
        bytes32 batchId,
        string calldata action,
        string calldata details
    ) external {
        auditLogs[batchId].push(AuditEntry({
            batchId: batchId,
            action: action,
            actor: msg.sender,
            timestamp: block.timestamp,
            details: details
        }));
        
        emit AuditEntryAdded(batchId, action, msg.sender);
    }
    
    function getAuditTrail(bytes32 batchId) external view returns (AuditEntry[] memory) {
        return auditLogs[batchId];
    }
    
    function getAuditCount(bytes32 batchId) external view returns (uint256) {
        return auditLogs[batchId].length;
    }
}
