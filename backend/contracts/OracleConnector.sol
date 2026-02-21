// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OracleConnector {
    struct OracleData {
        bytes32 requestId;
        string dataType;
        int256 value;
        uint256 timestamp;
        bool available;
    }
    
    mapping(bytes32 => OracleData) public oracleData;
    
    event DataRequested(bytes32 indexed requestId, string dataType);
    event DataReceived(bytes32 indexed requestId, int256 value);
    
    function requestData(bytes32 requestId, string calldata dataType) external {
        oracleData[requestId] = OracleData({
            requestId: requestId,
            dataType: dataType,
            value: 0,
            timestamp: 0,
            available: false
        });
        
        emit DataRequested(requestId, dataType);
    }
    
    function fulfillData(bytes32 requestId, int256 value) external {
        require(!oracleData[requestId].available, "Already fulfilled");
        
        oracleData[requestId].value = value;
        oracleData[requestId].timestamp = block.timestamp;
        oracleData[requestId].available = true;
        
        emit DataReceived(requestId, value);
    }
    
    function getData(bytes32 requestId) external view returns (OracleData memory) {
        return oracleData[requestId];
    }
}
