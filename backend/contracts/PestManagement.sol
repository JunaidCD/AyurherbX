// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PestManagement {
    struct Treatment {
        bytes32 batchId;
        string pestType;
        string treatmentMethod;
        uint256 treatmentDate;
        string chemicalUsed;
    }
    
    mapping(bytes32 => Treatment[]) public treatments;
    
    event TreatmentApplied(bytes32 indexed batchId, string pestType);
    
    function applyTreatment(
        bytes32 batchId,
        string calldata pestType,
        string calldata method,
        string calldata chemical
    ) external {
        treatments[batchId].push(Treatment({
            batchId: batchId,
            pestType: pestType,
            treatmentMethod: method,
            treatmentDate: block.timestamp,
            chemicalUsed: chemical
        }));
        
        emit TreatmentApplied(batchId, pestType);
    }
    
    function getTreatments(bytes32 batchId) external view returns (Treatment[] memory) {
        return treatments[batchId];
    }
}
