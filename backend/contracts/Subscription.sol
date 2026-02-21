// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SubscriptionContract
 * @dev Subscription management for services
 */
contract SubscriptionContract {
    struct Subscription {
        address subscriber;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }

    mapping(address => Subscription) public subscriptions;

    event SubscriptionStarted(address subscriber, uint256 endTime);
    event SubscriptionRenewed(address subscriber);
    event SubscriptionCancelled(address subscriber);

    function subscribe(uint256 _durationDays) external payable {
        subscriptions[msg.sender] = Subscription({
            subscriber: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationDays * 1 days),
            active: true
        });
        
        emit SubscriptionStarted(msg.sender, block.timestamp + (_durationDays * 1 days));
    }

    function isActive(address _subscriber) external view returns (bool) {
        Subscription memory s = subscriptions[_subscriber];
        return s.active && block.timestamp < s.endTime;
    }

    function cancel() external {
        subscriptions[msg.sender].active = false;
        emit SubscriptionCancelled(msg.sender);
    }
}
