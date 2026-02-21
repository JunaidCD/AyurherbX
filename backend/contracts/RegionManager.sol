// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RegionManager
 * @dev Geographic region management
 */
contract RegionManager {
    struct Region {
        string name;
        string country;
        string climateZone;
        uint256 totalFarmers;
    }

    mapping(uint256 => Region) public regions;
    uint256 public nextRegionId = 1;

    event RegionCreated(uint256 id, string name, string country);

    function createRegion(string memory _name, string memory _country, string memory _climate) external returns (uint256) {
        uint256 id = nextRegionId++;
        
        regions[id] = Region({
            name: _name,
            country: _country,
            climateZone: _climate,
            totalFarmers: 0
        });
        
        emit RegionCreated(id, _name, _country);
        return id;
    }

    function getRegion(uint256 _id) external view returns (Region memory) {
        return regions[_id];
    }
}
