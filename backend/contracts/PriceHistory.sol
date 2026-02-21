// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PriceHistory {
    struct PricePoint {
        uint256 price;
        uint256 timestamp;
    }
    
    mapping(bytes32 => PricePoint[]) public priceHistory;
    
    event PriceRecorded(bytes32 indexed batchId, uint256 price);
    
    function recordPrice(bytes32 batchId, uint256 price) external {
        priceHistory[batchId].push(PricePoint({
            price: price,
            timestamp: block.timestamp
        }));
        
        emit PriceRecorded(batchId, price);
    }
    
    function getPriceHistory(bytes32 batchId) external view returns (PricePoint[] memory) {
        return priceHistory[batchId];
    }
    
    function getLatestPrice(bytes32 batchId) external view returns (uint256) {
        PricePoint[] memory prices = priceHistory[batchId];
        if (prices.length == 0) return 0;
        return prices[prices.length - 1].price;
    }
}
