// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TimelockController
 * @dev Time-locked operations
 */
contract TimelockController {
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        uint256 executionTime;
        bool executed;
    }

    uint256 public constant DELAY = 2 days;
    mapping(bytes32 => Transaction) public transactions;
    bytes32[] public transactionIds;

    event TransactionQueued(bytes32 indexed txId, address to, uint256 value, uint256 executionTime);
    event TransactionExecuted(bytes32 indexed txId);

    function queueTransaction(address _to, uint256 _value, bytes memory _data) external returns (bytes32) {
        bytes32 txId = keccak256(abi.encodePacked(_to, _value, _data, block.timestamp));
        
        transactions[txId] = Transaction({
            to: _to,
            value: _value,
            data: _data,
            executionTime: block.timestamp + DELAY,
            executed: false
        });
        
        transactionIds.push(txId);
        emit TransactionQueued(txId, _to, _value, block.timestamp + DELAY);
        
        return txId;
    }

    function executeTransaction(bytes32 _txId) external {
        Transaction storage t = transactions[_txId];
        require(block.timestamp >= t.executionTime, "Not ready");
        require(!t.executed, "Already executed");
        
        t.executed = true;
        (bool success, ) = t.to.call{value: t.value}(t.data);
        require(success, "Execution failed");
        
        emit TransactionExecuted(_txId);
    }
}
