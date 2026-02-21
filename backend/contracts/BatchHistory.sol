// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BatchHistory {
    struct HistoryEntry {
        bytes32 batchId;
        string action;
        address actor;
        uint256 timestamp;
        string details;
    }
    
    mapping(bytes32 => HistoryEntry[]) public history;
    
    event HistoryAdded(bytes32 indexed batchId, string action, address indexed actor);
    
    function addHistoryEntry(
        bytes32 batchId,
        string calldata action,
        string calldata details
    ) external {
        history[batchId].push(HistoryEntry({
            batchId: batchId,
            action: action,
            actor: msg.sender,
            timestamp: block.timestamp,
            details: details
        }));
        
        emit HistoryAdded(batchId, action, msg.sender);
    }
    
    function getHistory(bytes32 batchId) external view returns (HistoryEntry[] memory) {
        return history[batchId];
    }
}
