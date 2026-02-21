// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DataStorage
 * @dev On-chain data storage for herb information
 */
contract DataStorage {
    struct DataRecord {
        bytes32 dataHash;
        string ipfsHash;
        address creator;
        uint256 timestamp;
        bool isEncrypted;
    }

    mapping(bytes32 => DataRecord) public records;
    mapping(address => bytes32[]) public userRecords;

    event DataStored(bytes32 indexed hash, address indexed creator, uint256 timestamp);

    function storeData(bytes32 _hash, string memory _ipfsHash, bool _encrypted) external {
        require(records[_hash].timestamp == 0, "Data already exists");
        
        records[_hash] = DataRecord({
            dataHash: _hash,
            ipfsHash: _ipfsHash,
            creator: msg.sender,
            timestamp: block.timestamp,
            isEncrypted: _encrypted
        });
        
        userRecords[msg.sender].push(_hash);
        emit DataStored(_hash, msg.sender, block.timestamp);
    }

    function getData(bytes32 _hash) external view returns (DataRecord memory) {
        return records[_hash];
    }

    function getUserData(address _user) external view returns (bytes32[] memory) {
        return userRecords[_user];
    }
}
