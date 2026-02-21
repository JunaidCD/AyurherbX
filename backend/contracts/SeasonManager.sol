// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SeasonManager
 * @dev Manage seasonal operations
 */
contract SeasonManager {
    struct Season {
        string name;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }

    Season[] public seasons;
    uint256 public currentSeasonId;

    event SeasonCreated(uint256 id, string name, uint256 start, uint256 end);
    event SeasonStarted(uint256 id);

    function createSeason(string memory _name, uint256 _start, uint256 _end) external returns (uint256) {
        uint256 id = seasons.length;
        
        seasons.push(Season({
            name: _name,
            startTime: _start,
            endTime: _end,
            active: false
        }));
        
        emit SeasonCreated(id, _name, _start, _end);
        return id;
    }

    function startSeason(uint256 _id) external {
        seasons[_id].active = true;
        currentSeasonId = _id;
        emit SeasonStarted(_id);
    }

    function getCurrentSeason() external view returns (Season memory) {
        return seasons[currentSeasonId];
    }
}
