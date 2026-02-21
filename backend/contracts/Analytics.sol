// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AnalyticsContract
 * @dev Analytics tracking
 */
contract AnalyticsContract {
    struct Stat {
        string metric;
        uint256 value;
        uint256 timestamp;
    }

    Stat[] public stats;

    function recordStat(string memory _metric, uint256 _value) external {
        stats.push(Stat({
            metric: _metric,
            value: _value,
            timestamp: block.timestamp
        }));
    }

    function getStatsCount() external view returns (uint256) {
        return stats.length;
    }
}
