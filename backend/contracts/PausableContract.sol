// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PausableContract
 * @dev Emergency pause functionality
 */
contract PausableContract {
    bool public paused;
    address public pauser;

    event Paused(address pauser);
    event Unpaused(address pauser);

    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }

    modifier whenPaused() {
        require(paused, "Not paused");
        _;
    }

    constructor() {
        pauser = msg.sender;
        paused = false;
    }

    function pause() external whenNotPaused {
        require(msg.sender == pauser, "Not pauser");
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external whenPaused {
        require(msg.sender == pauser, "Not pauser");
        paused = false;
        emit Unpaused(msg.sender);
    }
}
