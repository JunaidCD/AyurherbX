// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SeedRegistry {
    struct Seed {
        bytes32 seedId;
        string name;
        string supplier;
        string origin;
        uint256 certificationDate;
    }
    
    mapping(bytes32 => Seed) public seeds;
    
    event SeedRegistered(bytes32 indexed seedId, string name);
    
    function registerSeed(
        bytes32 seedId,
        string calldata name,
        string calldata supplier,
        string calldata origin
    ) external {
        seeds[seedId] = Seed({
            seedId: seedId,
            name: name,
            supplier: supplier,
            origin: origin,
            certificationDate: block.timestamp
        });
        
        emit SeedRegistered(seedId, name);
    }
    
    function getSeed(bytes32 seedId) external view returns (Seed memory) {
        return seeds[seedId];
    }
}
