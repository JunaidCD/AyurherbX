// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ShippingManager {
    struct Shipment {
        bytes32 batchId;
        address shipper;
        address carrier;
        string origin;
        string destination;
        uint256 shipmentDate;
        uint256 estimatedDelivery;
        uint256 actualDelivery;
        string status;
    }
    
    mapping(bytes32 => Shipment) public shipments;
    
    event ShipmentCreated(bytes32 indexed batchId, address indexed shipper, string destination);
    event ShipmentInTransit(bytes32 indexed batchId);
    event ShipmentDelivered(bytes32 indexed batchId, uint256 deliveryDate);
    
    function createShipment(
        bytes32 batchId,
        address carrier,
        string calldata origin,
        string calldata destination,
        uint256 estimatedDelivery
    ) external {
        shipments[batchId] = Shipment({
            batchId: batchId,
            shipper: msg.sender,
            carrier: carrier,
            origin: origin,
            destination: destination,
            shipmentDate: block.timestamp,
            estimatedDelivery: estimatedDelivery,
            actualDelivery: 0,
            status: "Created"
        });
        
        emit ShipmentCreated(batchId, msg.sender, destination);
    }
    
    function startTransit(bytes32 batchId) external {
        require(shipments[batchId].shipper == msg.sender, "Not shipper");
        shipments[batchId].status = "In Transit";
        
        emit ShipmentInTransit(batchId);
    }
    
    function completeDelivery(bytes32 batchId) external {
        require(shipments[batchId].shipper == msg.sender, "Not shipper");
        shipments[batchId].actualDelivery = block.timestamp;
        shipments[batchId].status = "Delivered";
        
        emit ShipmentDelivered(batchId, block.timestamp);
    }
    
    function getShipment(bytes32 batchId) external view returns (Shipment memory) {
        return shipments[batchId];
    }
}
