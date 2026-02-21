// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HerbalDatabase
 * @dev Herbal species database
 */
contract HerbalDatabase {
    struct HerbInfo {
        string scientificName;
        string commonName;
        string family;
        string medicinalUses;
        uint256 optimalTemperature;
        uint256 optimalHumidity;
    }

    mapping(string => HerbInfo) public herbs;

    function addHerb(string memory _name, string memory _scientific, string memory _family, string memory _uses, uint256 _temp, uint256 _humidity) external {
        herbs[_name] = HerbInfo({
            scientificName: _scientific,
            commonName: _name,
            family: _family,
            medicinalUses: _uses,
            optimalTemperature: _temp,
            optimalHumidity: _humidity
        });
    }

    function getHerbInfo(string memory _name) external view returns (HerbInfo memory) {
        return herbs[_name];
    }
}
