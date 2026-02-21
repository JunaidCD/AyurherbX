// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title WhitelistContract
 * @dev Whitelist management for restricted operations
 */
contract WhitelistContract {
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public whitelistAddedAt;

    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);

    function addToWhitelist(address _address) external {
        whitelist[_address] = true;
        whitelistAddedAt[_address] = block.timestamp;
        emit AddressWhitelisted(_address);
    }

    function removeFromWhitelist(address _address) external {
        whitelist[_address] = false;
        emit AddressRemovedFromWhitelist(_address);
    }

    function isWhitelisted(address _address) external view returns (bool) {
        return whitelist[_address];
    }
}
