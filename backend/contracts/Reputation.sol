// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ReputationContract
 * @dev Reputation scoring for participants
 */
contract ReputationContract {
    struct Reputation {
        uint256 score;
        uint256 totalRatings;
        uint256 lastUpdate;
    }

    mapping(address => Reputation) public reputations;

    event ReputationUpdated(address indexed user, uint256 newScore);

    function updateReputation(address _user, uint256 _rating) external {
        Reputation storage r = reputations[_user];
        r.score = (r.score * r.totalRatings + _rating) / (r.totalRatings + 1);
        r.totalRatings++;
        r.lastUpdate = block.timestamp;
        emit ReputationUpdated(_user, r.score);
    }

    function getReputation(address _user) external view returns (Reputation memory) {
        return reputations[_user];
    }
}
