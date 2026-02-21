// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TokenClaim
 * @dev Airdrop claim contract
 */
contract TokenClaim {
    mapping(address => bool) public claimed;
    mapping(address => uint256) public claimAmounts;
    uint256 public totalClaimed;
    address public distributor;

    event Claimed(address claimant, uint256 amount);

    constructor() {
        distributor = msg.sender;
    }

    function setClaimAmounts(address[] memory _addresses, uint256[] memory _amounts) external {
        require(msg.sender == distributor, "Not distributor");
        
        for (uint256 i = 0; i < _addresses.length; i++) {
            claimAmounts[_addresses[i]] = _amounts[i];
        }
    }

    function claim() external {
        require(!claimed[msg.sender], "Already claimed");
        require(claimAmounts[msg.sender] > 0, "No claim");
        
        claimed[msg.sender] = true;
        totalClaimed += claimAmounts[msg.sender];
        
        payable(msg.sender).transfer(claimAmounts[msg.sender]);
        emit Claimed(msg.sender, claimAmounts[msg.sender]);
    }

    receive() external payable {}
}
