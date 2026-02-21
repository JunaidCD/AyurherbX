// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title InsuranceContract
 * @dev Insurance coverage for herb batches
 */
contract InsuranceContract {
    struct Policy {
        uint256 batchTokenId;
        address farmer;
        uint256 coverageAmount;
        uint256 premium;
        bool active;
        uint256 expiry;
    }

    mapping(uint256 => Policy) public policies;

    event PolicyCreated(uint256 indexed id, address farmer, uint256 coverage);
    event PolicyClaimed(uint256 indexed id, uint256 amount);

    function createPolicy(uint256 _batchId, uint256 _coverage) external payable {
        require(policies[_batchId].coverageAmount == 0, "Policy exists");
        
        policies[_batchId] = Policy({
            batchTokenId: _batchId,
            farmer: msg.sender,
            coverageAmount: _coverage,
            premium: msg.value,
            active: true,
            expiry: block.timestamp + 365 days
        });
        
        emit PolicyCreated(_batchId, msg.sender, _coverage);
    }

    function claim(uint256 _batchId) external {
        Policy storage p = policies[_batchId];
        require(p.active, "Not active");
        require(block.timestamp < p.expiry, "Expired");
        
        p.active = false;
        payable(p.farmer).transfer(p.coverageAmount);
        
        emit PolicyClaimed(_batchId, p.coverageAmount);
    }
}
