// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ImportManager {
    struct ImportRecord {
        bytes32 batchId;
        string originCountry;
        string importLicense;
        uint256 importDate;
        string customsStatus;
    }
    
    mapping(bytes32 => ImportRecord) public imports;
    
    event ImportRecorded(bytes32 indexed batchId, string origin);
    event CustomsCleared(bytes32 indexed batchId);
    
    function recordImport(
        bytes32 batchId,
        string calldata origin,
        string calldata license
    ) external {
        require(imports[batchId].importDate == 0, "Import exists");
        
        imports[batchId] = ImportRecord({
            batchId: batchId,
            originCountry: origin,
            importLicense: license,
            importDate: block.timestamp,
            customsStatus: "Pending"
        });
        
        emit ImportRecorded(batchId, origin);
    }
    
    function clearCustoms(bytes32 batchId) external {
        imports[batchId].customsStatus = "Cleared";
        emit CustomsCleared(batchId);
    }
    
    function getImport(bytes32 batchId) external view returns (ImportRecord memory) {
        return imports[batchId];
    }
}
