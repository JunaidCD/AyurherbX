// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title NotificationContract
 * @dev On-chain notifications
 */
contract NotificationContract {
    struct Notification {
        address recipient;
        string message;
        uint256 timestamp;
        bool read;
    }

    mapping(address => Notification[]) public notifications;

    event NotificationSent(address indexed recipient, string message);

    function sendNotification(address _recipient, string memory _message) external {
        notifications[_recipient].push(Notification({
            recipient: _recipient,
            message: _message,
            timestamp: block.timestamp,
            read: false
        }));
        
        emit NotificationSent(_recipient, _message);
    }

    function getNotifications(address _user) external view returns (Notification[] memory) {
        return notifications[_user];
    }
}
