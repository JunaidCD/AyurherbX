// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LoyaltyPoints {
    mapping(address => uint256) public points;
    mapping(address => uint256) public totalEarned;
    mapping(address => uint256) public totalRedeemed;
    
    event PointsEarned(address indexed user, uint256 points, string reason);
    event PointsRedeemed(address indexed user, uint256 points, string reason);
    
    function earnPoints(address user, uint256 amount, string calldata reason) external {
        points[user] += amount;
        totalEarned[user] += amount;
        
        emit PointsEarned(user, amount, reason);
    }
    
    function redeemPoints(uint256 amount, string calldata reason) external {
        require(points[msg.sender] >= amount, "Insufficient points");
        points[msg.sender] -= amount;
        totalRedeemed[msg.sender] += amount;
        
        emit PointsRedeemed(msg.sender, amount, reason);
    }
    
    function getPoints(address user) external view returns (uint256) {
        return points[user];
    }
}
