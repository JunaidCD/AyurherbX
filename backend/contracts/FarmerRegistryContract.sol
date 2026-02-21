// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FarmerRegistryContract {
    struct Farmer {
        address walletAddress;
        string name;
        string location;
        uint256 registrationDate;
        bool verified;
        uint256 totalBatches;
    }
    
    mapping(address => Farmer) public farmers;
    address[] public farmerAddresses;
    
    event FarmerRegistered(address indexed farmer, string name, uint256 timestamp);
    event FarmerVerified(address indexed farmer, bool verified);
    
    function registerFarmer(string calldata name, string calldata location) external {
        require(farmers[msg.sender].registrationDate == 0, "Already registered");
        
        farmers[msg.sender] = Farmer({
            walletAddress: msg.sender,
            name: name,
            location: location,
            registrationDate: block.timestamp,
            verified: false,
            totalBatches: 0
        });
        farmerAddresses.push(msg.sender);
        
        emit FarmerRegistered(msg.sender, name, block.timestamp);
    }
    
    function verifyFarmer(address farmer, bool verified) external {
        require(farmers[farmer].registrationDate != 0, "Not registered");
        farmers[farmer].verified = verified;
        emit FarmerVerified(farmer, verified);
    }
    
    function incrementBatchCount(address farmer) external {
        require(farmers[farmer].registrationDate != 0, "Not registered");
        farmers[farmer].totalBatches++;
    }
    
    function getFarmer(address farmer) external view returns (Farmer memory) {
        return farmers[farmer];
    }
    
    function getFarmerCount() external view returns (uint256) {
        return farmerAddresses.length;
    }
}
