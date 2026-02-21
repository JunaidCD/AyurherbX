// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ExportManager {
    struct ExportRecord {
        bytes32 batchId;
        string destinationCountry;
        string exportLicense;
        uint256 exportDate;
        string status;
    }
    
    mapping(bytes32 => ExportRecord) public exports;
    
    event ExportRecorded(bytes32 indexed batchId, string destination);
    event ExportCleared(bytes32 indexed batchId);
    
    function recordExport(
        bytes32 batchId,
        string calldata destination,
        string calldata license
    ) external {
        require(exports[batchId].exportDate == 0, "Export exists");
        
        exports[batchId] = ExportRecord({
            batchId: batchId,
            destinationCountry: destination,
            exportLicense: license,
            exportDate: block.timestamp,
            status: "Pending"
        });
        
        emit ExportRecorded(batchId, destination);
    }
    
    function clearExport(bytes32 batchId) external {
        exports[batchId].status = "Cleared";
        emit ExportCleared(batchId);
    }
    
    function getExport(bytes32 batchId) external view returns (ExportRecord memory) {
        return exports[batchId];
    }
}
