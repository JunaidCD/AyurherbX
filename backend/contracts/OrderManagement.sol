// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OrderManagement {
    struct Order {
        bytes32 orderId;
        address customer;
        bytes32[] batchIds;
        uint256 totalAmount;
        string status;
        uint256 createdAt;
        uint256 deliveredAt;
    }
    
    mapping(bytes32 => Order) public orders;
    mapping(address => bytes32[]) public customerOrders;
    
    event OrderCreated(bytes32 indexed orderId, address indexed customer, uint256 amount);
    event OrderStatusChanged(bytes32 indexed orderId, string status);
    
    function createOrder(
        bytes32 orderId,
        bytes32[] calldata batchIds,
        uint256 totalAmount
    ) external {
        require(orders[orderId].createdAt == 0, "Order exists");
        
        orders[orderId] = Order({
            orderId: orderId,
            customer: msg.sender,
            batchIds: batchIds,
            totalAmount: totalAmount,
            status: "Created",
            createdAt: block.timestamp,
            deliveredAt: 0
        });
        customerOrders[msg.sender].push(orderId);
        
        emit OrderCreated(orderId, msg.sender, totalAmount);
    }
    
    function updateOrderStatus(bytes32 orderId, string calldata status) external {
        require(orders[orderId].customer == msg.sender, "Not customer");
        orders[orderId].status = status;
        
        if (keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Delivered"))) {
            orders[orderId].deliveredAt = block.timestamp;
        }
        
        emit OrderStatusChanged(orderId, status);
    }
    
    function getOrder(bytes32 orderId) external view returns (Order memory) {
        return orders[orderId];
    }
}
