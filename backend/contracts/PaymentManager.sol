// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PaymentManager {
    struct Payment {
        bytes32 paymentId;
        address payer;
        address payee;
        uint256 amount;
        string status;
        uint256 timestamp;
    }
    
    mapping(bytes32 => Payment) public payments;
    
    event PaymentProcessed(bytes32 indexed paymentId, address indexed from, address indexed to, uint256 amount);
    event PaymentRefunded(bytes32 indexed paymentId);
    
    function processPayment(bytes32 paymentId, address payee) external payable {
        require(payments[paymentId].timestamp == 0, "Payment exists");
        
        payments[paymentId] = Payment({
            paymentId: paymentId,
            payer: msg.sender,
            payee: payee,
            amount: msg.value,
            status: "Completed",
            timestamp: block.timestamp
        });
        
        emit PaymentProcessed(paymentId, msg.sender, payee, msg.value);
    }
    
    function refundPayment(bytes32 paymentId) external {
        require(payments[paymentId].payer == msg.sender, "Not payer");
        require(payments[paymentId].timestamp != 0, "Payment not found");
        
        payments[paymentId].status = "Refunded";
        emit PaymentRefunded(paymentId);
    }
    
    function getPayment(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }
}
