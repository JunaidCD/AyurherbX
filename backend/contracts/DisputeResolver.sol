// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DisputeResolver {
    struct Dispute {
        bytes32 disputeId;
        bytes32 batchId;
        address complainant;
        address respondent;
        string description;
        string status;
        uint256 createdAt;
        uint256 resolvedAt;
    }
    
    mapping(bytes32 => Dispute) public disputes;
    
    event DisputeOpened(bytes32 indexed disputeId, address indexed complainant);
    event DisputeResolved(bytes32 indexed disputeId, string resolution);
    
    function openDispute(
        bytes32 disputeId,
        bytes32 batchId,
        address respondent,
        string calldata description
    ) external {
        require(disputes[disputeId].createdAt == 0, "Dispute exists");
        
        disputes[disputeId] = Dispute({
            disputeId: disputeId,
            batchId: batchId,
            complainant: msg.sender,
            respondent: respondent,
            description: description,
            status: "Open",
            createdAt: block.timestamp,
            resolvedAt: 0
        });
        
        emit DisputeOpened(disputeId, msg.sender);
    }
    
    function resolveDispute(bytes32 disputeId, string calldata resolution) external {
        require(disputes[disputeId].createdAt != 0, "Dispute not found");
        disputes[disputeId].status = "Resolved";
        disputes[disputeId].resolvedAt = block.timestamp;
        
        emit DisputeResolved(disputeId, resolution);
    }
    
    function getDispute(bytes32 disputeId) external view returns (Dispute memory) {
        return disputes[disputeId];
    }
}
