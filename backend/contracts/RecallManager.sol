// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RecallManager {
    struct Recall {
        bytes32 recallId;
        bytes32 batchId;
        string reason;
        uint256 recallDate;
        bool active;
    }
    
    mapping(bytes32 => Recall) public recalls;
    bytes32[] public recallIds;
    
    event RecallInitiated(bytes32 indexed recallId, bytes32 indexed batchId, string reason);
    event RecallCompleted(bytes32 indexed recallId);
    
    function initiateRecall(
        bytes32 recallId,
        bytes32 batchId,
        string calldata reason
    ) external {
        require(recalls[recallId].recallDate == 0, "Recall exists");
        
        recalls[recallId] = Recall({
            recallId: recallId,
            batchId: batchId,
            reason: reason,
            recallDate: block.timestamp,
            active: true
        });
        recallIds.push(recallId);
        
        emit RecallInitiated(recallId, batchId, reason);
    }
    
    function completeRecall(bytes32 recallId) external {
        require(recalls[recallId].recallDate != 0, "Recall not found");
        recalls[recallId].active = false;
        
        emit RecallCompleted(recallId);
    }
    
    function getRecall(bytes32 recallId) external view returns (Recall memory) {
        return recalls[recallId];
    }
}
