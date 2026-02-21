// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FarmerCredential {
    struct Credential {
        address farmer;
        string credentialType;
        string issuingBody;
        uint256 issueDate;
        uint256 expiryDate;
        bool valid;
    }
    
    mapping(address => Credential[]) public credentials;
    
    event CredentialIssued(address indexed farmer, string credentialType);
    event CredentialRevoked(address indexed farmer, uint256 index);
    
    function issueCredential(
        address farmer,
        string calldata credentialType,
        string calldata issuingBody,
        uint256 validityPeriod
    ) external {
        credentials[farmer].push(Credential({
            farmer: farmer,
            credentialType: credentialType,
            issuingBody: issuingBody,
            issueDate: block.timestamp,
            expiryDate: block.timestamp + validityPeriod,
            valid: true
        }));
        
        emit CredentialIssued(farmer, credentialType);
    }
    
    function revokeCredential(address farmer, uint256 index) external {
        require(credentials[farmer].length > index, "Invalid index");
        credentials[farmer][index].valid = false;
        
        emit CredentialRevoked(farmer, index);
    }
    
    function getCredentials(address farmer) external view returns (Credential[] memory) {
        return credentials[farmer];
    }
}
