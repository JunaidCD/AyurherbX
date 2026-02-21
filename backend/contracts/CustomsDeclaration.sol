// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CustomsDeclaration {
    struct Declaration {
        bytes32 batchId;
        string description;
        uint256 declaredValue;
        string hsCode;
        string status;
    }
    
    mapping(bytes32 => Declaration) public declarations;
    
    event DeclarationFiled(bytes32 indexed batchId, uint256 value);
    event DeclarationApproved(bytes32 indexed batchId);
    
    function fileDeclaration(
        bytes32 batchId,
        string calldata description,
        uint256 value,
        string calldata hsCode
    ) external {
        declarations[batchId] = Declaration({
            batchId: batchId,
            description: description,
            declaredValue: value,
            hsCode: hsCode,
            status: "Pending"
        });
        
        emit DeclarationFiled(batchId, value);
    }
    
    function approveDeclaration(bytes32 batchId) external {
        declarations[batchId].status = "Approved";
        emit DeclarationApproved(batchId);
    }
    
    function getDeclaration(bytes32 batchId) external view returns (Declaration memory) {
        return declarations[batchId];
    }
}
