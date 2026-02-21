// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RatingSystem {
    struct Rating {
        address rater;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }
    
    mapping(bytes32 => Rating[]) public ratings;
    mapping(bytes32 => uint256) public averageRatings;
    
    event RatingSubmitted(bytes32 indexed batchId, address indexed rater, uint256 rating);
    
    function submitRating(
        bytes32 batchId,
        uint256 rating,
        string calldata comment
    ) external {
        require(rating >= 1 && rating <= 5, "Rating must be 1-5");
        
        ratings[batchId].push(Rating({
            rater: msg.sender,
            rating: rating,
            comment: comment,
            timestamp: block.timestamp
        }));
        
        _updateAverageRating(batchId);
        
        emit RatingSubmitted(batchId, msg.sender, rating);
    }
    
    function _updateAverageRating(bytes32 batchId) internal {
        Rating[] memory batchRatings = ratings[batchId];
        uint256 sum;
        for (uint256 i = 0; i < batchRatings.length; i++) {
            sum += batchRatings[i].rating;
        }
        averageRatings[batchId] = batchRatings.length > 0 ? sum / batchRatings.length : 0;
    }
    
    function getRatings(bytes32 batchId) external view returns (Rating[] memory) {
        return ratings[batchId];
    }
}
