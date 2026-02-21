// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeliveryProof {
    struct Delivery {
        bytes32 batchId;
        address recipient;
        uint256 deliveryTime;
        string signature;
        string location;
    }
    
    mapping(bytes32 => Delivery) public deliveries;
    
    event DeliveryConfirmed(bytes32 indexed batchId, address indexed recipient);
    
    function confirmDelivery(
        bytes32 batchId,
        address recipient,
        string calldata signature,
        string calldata location
    ) external {
        deliveries[batchId] = Delivery({
            batchId: batchId,
            recipient: recipient,
            deliveryTime: block.timestamp,
            signature: signature,
            location: location
        });
        
        emit DeliveryConfirmed(batchId, recipient);
    }
    
    function getDelivery(bytes32 batchId) external view returns (Delivery memory) {
        return deliveries[batchId];
    }
}
