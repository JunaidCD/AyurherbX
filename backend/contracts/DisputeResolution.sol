// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DisputeResolution
 * @dev Dispute management for transactions
 */
contract DisputeResolution {
    enum DisputeStatus { Open, UnderReview, Resolved, Closed }

    struct Dispute {
        uint256 transactionId;
        address complainant;
        address respondent;
        string description;
        DisputeStatus status;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    mapping(bytes32 => Dispute) public disputes;
    bytes32[] public disputeIds;

    event DisputeOpened(bytes32 indexed disputeId, address complainant);
    event DisputeResolved(bytes32 indexed disputeId, DisputeStatus status);

    function openDispute(uint256 _txId, address _respondent, string memory _description) external returns (bytes32) {
        bytes32 disputeId = keccak256(abi.encodePacked(_txId, msg.sender, block.timestamp));
        
        disputes[disputeId] = Dispute({
            transactionId: _txId,
            complainant: msg.sender,
            respondent: _respondent,
            description: _description,
            status: DisputeStatus.Open,
            createdAt: block.timestamp,
            resolvedAt: 0
        });
        
        disputeIds.push(disputeId);
        emit DisputeOpened(disputeId, msg.sender);
        
        return disputeId;
    }

    function resolveDispute(bytes32 _disputeId, DisputeStatus _status) external {
        Dispute storage d = disputes[_disputeId];
        d.status = _status;
        d.resolvedAt = block.timestamp;
        
        emit DisputeResolved(_disputeId, _status);
    }
}
