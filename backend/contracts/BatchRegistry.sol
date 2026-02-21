// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BatchRegistry {
    struct Batch {
        bytes32 batchId;
        address farmer;
        uint256 timestamp;
        string herbType;
        uint256 quantity;
        bool verified;
    }
    
    mapping(bytes32 => Batch) public batches;
    bytes32[] public batchIds;
    
    event BatchRegistered(bytes32 indexed batchId, address indexed farmer, uint256 timestamp);
    event BatchVerified(bytes32 indexed batchId, bool verified);
    
    function registerBatch(
        bytes32 batchId,
        address farmer,
        string calldata herbType,
        uint256 quantity
    ) external {
        require(batches[batchId].timestamp == 0, "Batch already exists");
        
        batches[batchId] = Batch({
            batchId: batchId,
            farmer: farmer,
            timestamp: block.timestamp,
            herbType: herbType,
            quantity: quantity,
            verified: false
        });
        batchIds.push(batchId);
        
        emit BatchRegistered(batchId, farmer, block.timestamp);
    }
    
    function verifyBatch(bytes32 batchId, bool verified) external {
        require(batches[batchId].timestamp != 0, "Batch does not exist");
        batches[batchId].verified = verified;
        emit BatchVerified(batchId, verified);
    }
    
    function getBatch(bytes32 batchId) external view returns (Batch memory) {
        return batches[batchId];
    }
    
    function getBatchCount() external view returns (uint256) {
        return batchIds.length;
    }
}
