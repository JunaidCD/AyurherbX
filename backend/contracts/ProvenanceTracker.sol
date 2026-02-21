// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProvenanceTracker {
    struct ProvenanceEntry {
        bytes32 batchId;
        string location;
        string coordinates;
        uint256 timestamp;
        string handler;
    }
    
    mapping(bytes32 => ProvenanceEntry[]) public provenance;
    
    event ProvenanceAdded(bytes32 indexed batchId, string location);
    
    function addProvenance(
        bytes32 batchId,
        string calldata location,
        string calldata coordinates,
        string calldata handler
    ) external {
        provenance[batchId].push(ProvenanceEntry({
            batchId: batchId,
            location: location,
            coordinates: coordinates,
            timestamp: block.timestamp,
            handler: handler
        }));
        
        emit ProvenanceAdded(batchId, location);
    }
    
    function getProvenance(bytes32 batchId) external view returns (ProvenanceEntry[] memory) {
        return provenance[batchId];
    }
}
