// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FarmerRegistry
 * @dev Farmer registration
 */
contract FarmerRegistry {
    struct Farmer {
        string name;
        string location;
        uint256 registeredAt;
        bool verified;
    }

    mapping(address => Farmer) public farmers;
    address[] public farmerAddresses;

    function register(string memory _name, string memory _location) external {
        farmers[msg.sender] = Farmer({
            name: _name,
            location: _location,
            registeredAt: block.timestamp,
            verified: false
        });
        farmerAddresses.push(msg.sender);
    }

    function verify(address _farmer) external {
        farmers[_farmer].verified = true;
    }

    function getFarmerCount() external view returns (uint256) {
        return farmerAddresses.length;
    }
}
