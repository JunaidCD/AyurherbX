// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BatchProcessor
 * @dev Batch processing operations
 */
contract BatchProcessor {
    struct BatchOperation {
        uint256[] batchTokenIds;
        address operator;
        string operationType;
        uint256 timestamp;
    }

    mapping(bytes32 => BatchOperation) public operations;

    event BatchOperationCreated(bytes32 indexed opId, address operator, uint256 count);

    function createBatchOperation(uint256[] memory _batchIds, string memory _opType) external returns (bytes32) {
        bytes32 opId = keccak256(abi.encodePacked(_batchIds[0], block.timestamp));
        
        operations[opId] = BatchOperation({
            batchTokenIds: _batchIds,
            operator: msg.sender,
            operationType: _opType,
            timestamp: block.timestamp
        });
        
        emit BatchOperationCreated(opId, msg.sender, _batchIds.length);
        return opId;
    }

    function getOperation(bytes32 _opId) external view returns (BatchOperation memory) {
        return operations[_opId];
    }
}
