// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DataRegistry is AccessControl {
    bytes32 public constant DATA_MANAGER_ROLE = keccak256("DATA_MANAGER_ROLE");
    
    struct Record {
        bytes32 dataHash;
        uint256 timestamp;
        string metadata;
    }
    
    mapping(bytes32 => Record) public records;
    mapping(address => bool) public authorizedOracles;
    
    event RecordCreated(bytes32 indexed recordId, bytes32 dataHash, uint256 timestamp);
    event OracleAuthorized(address indexed oracle, bool authorized);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DATA_MANAGER_ROLE, msg.sender);
    }
    
    function createRecord(bytes32 recordId, bytes32 dataHash, string calldata metadata) 
        external onlyRole(DATA_MANAGER_ROLE) 
    {
        records[recordId] = Record({
            dataHash: dataHash,
            timestamp: block.timestamp,
            metadata: metadata
        });
        emit RecordCreated(recordId, dataHash, block.timestamp);
    }
    
    function getRecord(bytes32 recordId) external view returns (Record memory) {
        return records[recordId];
    }
    
    function setOracleAuthorization(address oracle, bool authorized) 
        external onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        authorizedOracles[oracle] = authorized;
        emit OracleAuthorized(oracle, authorized);
    }
    
    function verifyRecord(bytes32 recordId, bytes32 dataHash) external view returns (bool) {
        return records[recordId].dataHash == dataHash;
    }
}
