// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TokenVesting
 * @dev Vesting schedule for farmer rewards
 */
contract TokenVesting {
    struct VestingSchedule {
        address beneficiary;
        uint256 totalAmount;
        uint256 startTime;
        uint256 duration;
        uint256 released;
    }

    mapping(bytes32 => VestingSchedule) public schedules;
    mapping(address => bytes32[]) public beneficiarySchedules;

    event VestingCreated(bytes32 indexed id, address beneficiary, uint256 amount, uint256 duration);
    event TokensReleased(bytes32 indexed id, uint256 amount);

    function createVesting(address _beneficiary, uint256 _amount, uint256 _duration) external {
        bytes32 id = keccak256(abi.encodePacked(_beneficiary, block.timestamp));
        
        schedules[id] = VestingSchedule({
            beneficiary: _beneficiary,
            totalAmount: _amount,
            startTime: block.timestamp,
            duration: _duration,
            released: 0
        });
        
        beneficiarySchedules[_beneficiary].push(id);
        emit VestingCreated(id, _beneficiary, _amount, _duration);
    }

    function release(bytes32 _id) external {
        VestingSchedule storage s = schedules[_id];
        uint256 vested = _computeVestedAmount(s);
        uint256 releasable = vested - s.released;
        
        require(releasable > 0, "No tokens due");
        
        s.released += releasable;
        payable(s.beneficiary).transfer(releasable);
        
        emit TokensReleased(_id, releasable);
    }

    function _computeVestedAmount(VestingSchedule storage s) internal view returns (uint256) {
        if (block.timestamp >= s.startTime + s.duration) {
            return s.totalAmount;
        }
        return (s.totalAmount * (block.timestamp - s.startTime)) / s.duration;
    }
}
