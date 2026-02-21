// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PackagingStandard {
    struct Package {
        bytes32 batchId;
        string packagingType;
        string material;
        uint256 weight;
        string dimensions;
    }
    
    mapping(bytes32 => Package) public packages;
    
    event PackageRecorded(bytes32 indexed batchId, string packagingType);
    
    function recordPackage(
        bytes32 batchId,
        string calldata packagingType,
        string calldata material,
        uint256 weight,
        string calldata dimensions
    ) external {
        packages[batchId] = Package({
            batchId: batchId,
            packagingType: packagingType,
            material: material,
            weight: weight,
            dimensions: dimensions
        });
        
        emit PackageRecorded(batchId, packagingType);
    }
    
    function getPackage(bytes32 batchId) external view returns (Package memory) {
        return packages[batchId];
    }
}
