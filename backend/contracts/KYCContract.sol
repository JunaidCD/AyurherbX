// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KYCContract
 * @dev Know Your Customer verification
 */
contract KYCContract {
    struct KYCData {
        address user;
        string fullName;
        string country;
        uint256 verifiedAt;
        bool approved;
    }

    mapping(address => KYCData) public kycData;

    event KYCSubmitted(address indexed user);
    event KYCApproved(address indexed user);
    event KYCRejected(address indexed user);

    function submitKYC(string memory _name, string memory _country) external {
        kycData[msg.sender] = KYCData({
            user: msg.sender,
            fullName: _name,
            country: _country,
            verifiedAt: 0,
            approved: false
        });
        
        emit KYCSubmitted(msg.sender);
    }

    function approveKYC(address _user) external {
        KYCData storage k = kycData[_user];
        k.approved = true;
        k.verifiedAt = block.timestamp;
        
        emit KYCApproved(_user);
    }

    function isApproved(address _user) external view returns (bool) {
        return kycData[_user].approved;
    }
}
