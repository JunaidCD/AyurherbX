// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract QualityStandard {
    struct Standard {
        bytes32 standardId;
        string name;
        string description;
        uint256 minQualityScore;
        bool active;
    }
    
    mapping(bytes32 => Standard) public standards;
    
    event StandardCreated(bytes32 indexed standardId, string name);
    event StandardUpdated(bytes32 indexed standardId, bool active);
    
    function createStandard(
        bytes32 standardId,
        string calldata name,
        string calldata description,
        uint256 minScore
    ) external {
        require(standards[standardId].minQualityScore == 0, "Standard exists");
        
        standards[standardId] = Standard({
            standardId: standardId,
            name: name,
            description: description,
            minQualityScore: minScore,
            active: true
        });
        
        emit StandardCreated(standardId, name);
    }
    
    function updateStandard(bytes32 standardId, bool active) external {
        standards[standardId].active = active;
        emit StandardUpdated(standardId, active);
    }
    
    function getStandard(bytes32 standardId) external view returns (Standard memory) {
        return standards[standardId];
    }
}
