// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TransferManager {
    struct Transfer {
        bytes32 batchId;
        address from;
        address to;
        uint256 quantity;
        uint256 timestamp;
        string status;
    }
    
    mapping(bytes32 => Transfer[]) public transfers;
    
    event TransferInitiated(bytes32 indexed batchId, address indexed from, address indexed to);
    event TransferCompleted(bytes32 indexed batchId);
    
    function initiateTransfer(
        bytes32 batchId,
        address to,
        uint256 quantity
    ) external {
        transfers[batchId].push(Transfer({
            batchId: batchId,
            from: msg.sender,
            to: to,
            quantity: quantity,
            timestamp: block.timestamp,
            status: "Initiated"
        }));
        
        emit TransferInitiated(batchId, msg.sender, to);
    }
    
    function completeTransfer(bytes32 batchId, uint256 index) external {
        transfers[batchId][index].status = "Completed";
        emit TransferCompleted(batchId);
    }
    
    function getTransfers(bytes32 batchId) external view returns (Transfer[] memory) {
        return transfers[batchId];
    }
}
