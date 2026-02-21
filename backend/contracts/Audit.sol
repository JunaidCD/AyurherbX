// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AuditContract
 * @dev Audit trail for all supply chain operations
 */
contract AuditContract {
    struct AuditEntry {
        address actor;
        string action;
        uint256 batchTokenId;
        string details;
        uint256 timestamp;
    }

    mapping(uint256 => AuditEntry[]) public batchAudits;
    mapping(address => uint256[]) public userAudits;

    event AuditLog(address indexed actor, string action, uint256 batchId);

    function logAudit(uint256 _batchId, string memory _action, string memory _details) external {
        batchAudits[_batchId].push(AuditEntry({
            actor: msg.sender,
            action: _action,
            batchTokenId: _batchId,
            details: _details,
            timestamp: block.timestamp
        }));
        
        userAudits[msg.sender].push(_batchId);
        emit AuditLog(msg.sender, _action, _batchId);
    }

    function getBatchAuditTrail(uint256 _batchId) external view returns (AuditEntry[] memory) {
        return batchAudits[_batchId];
    }
}
