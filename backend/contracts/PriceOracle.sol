// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PriceOracle
 * @dev Price feed for herb market
 */
contract PriceOracle {
    mapping(string => int256) public prices;
    mapping(string => uint256) public lastUpdated;

    event PriceUpdated(string indexed herb, int256 price);

    function updatePrice(string memory _herb, int256 _price) external {
        prices[_herb] = _price;
        lastUpdated[_herb] = block.timestamp;
        emit PriceUpdated(_herb, _price);
    }

    function getPrice(string memory _herb) external view returns (int256) {
        return prices[_herb];
    }
}
