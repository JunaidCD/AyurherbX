// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FertilizerTracker {
    struct Fertilizer {
        bytes32 batchId;
        string fertilizerType;
        string brand;
        uint256 applicationDate;
        uint256 quantity;
    }
    
    mapping(bytes32 => Fertilizer[]) public fertilizers;
    
    event FertilizerApplied(bytes32 indexed batchId, string fertilizerType);
    
    function applyFertilizer(
        bytes32 batchId,
        string calldata fertilizerType,
        string calldata brand,
        uint256 quantity
    ) external {
        fertilizers[batchId].push(Fertilizer({
            batchId: batchId,
            fertilizerType: fertilizerType,
            brand: brand,
            applicationDate: block.timestamp,
            quantity: quantity
        }));
        
        emit FertilizerApplied(batchId, fertilizerType);
    }
    
    function getFertilizers(bytes32 batchId) external view returns (Fertilizer[] memory) {
        return fertilizers[batchId];
    }
}
