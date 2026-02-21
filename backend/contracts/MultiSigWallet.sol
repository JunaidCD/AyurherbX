// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MultiSigWallet
 * @dev Multi-signature wallet for admin operations
 */
contract MultiSigWallet {
    event TransactionSubmitted(uint256 indexed txId, address indexed owner);
    event TransactionApproved(uint256 indexed txId, address indexed approver);
    event TransactionExecuted(uint256 indexed txId);

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 approvalCount;
    }

    mapping(uint256 => mapping(address => bool)) public approvals;
    Transaction[] public transactions;
    address[] public owners;
    uint256 public required;

    constructor(address[] memory _owners, uint256 _required) {
        owners = _owners;
        required = _required;
    }

    function submitTransaction(address _to, uint256 _value, bytes memory _data) external {
        uint256 txId = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            approvalCount: 0
        }));
        emit TransactionSubmitted(txId, msg.sender);
    }

    function approveTransaction(uint256 _txId) external {
        require(!approvals[_txId][msg.sender], "Already approved");
        approvals[_txId][msg.sender] = true;
        transactions[_txId].approvalCount++;
        emit TransactionApproved(_txId, msg.sender);
    }

    function executeTransaction(uint256 _txId) external payable {
        Transaction storage t = transactions[_txId];
        require(t.approvalCount >= required, "Not enough approvals");
        require(!t.executed, "Already executed");
        
        t.executed = true;
        (bool success, ) = t.to.call{value: t.value}(t.data);
        require(success, "Execution failed");
        
        emit TransactionExecuted(_txId);
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }
}
