// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HerbalDatabase2 {
    struct Herb {
        bytes32 herbId;
        string name;
        string scientificName;
        string family;
        string description;
        uint256 minTemperature;
        uint256 maxTemperature;
        uint256 harvestDays;
    }
    
    mapping(bytes32 => Herb) public herbs;
    
    event HerbRegistered(bytes32 indexed herbId, string name);
    
    function registerHerb(
        bytes32 herbId,
        string calldata name,
        string calldata scientificName,
        string calldata family,
        string calldata description,
        uint256 minTemp,
        uint256 maxTemp,
        uint256 harvestPeriod
    ) external {
        require(herbs[herbId].minTemperature == 0, "Herb exists");
        
        herbs[herbId] = Herb({
            herbId: herbId,
            name: name,
            scientificName: scientificName,
            family: family,
            description: description,
            minTemperature: minTemp,
            maxTemperature: maxTemp,
            harvestDays: harvestPeriod
        });
        
        emit HerbRegistered(herbId, name);
    }
    
    function getHerb(bytes32 herbId) external view returns (Herb memory) {
        return herbs[herbId];
    }
}
