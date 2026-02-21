// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LogisticsContract
 * @dev Shipping and logistics tracking
 */
contract LogisticsContract {
    enum ShippingStatus { Pending, InTransit, Delivered, Delayed, Lost }

    struct Shipment {
        uint256 batchTokenId;
        address sender;
        address receiver;
        string carrier;
        string trackingNumber;
        ShippingStatus status;
        uint256 estimatedDelivery;
        uint256 actualDelivery;
    }

    mapping(bytes32 => Shipment) public shipments;

    event ShipmentCreated(bytes32 indexed id, uint256 batchId, address sender);
    event ShipmentStatusChanged(bytes32 indexed id, ShippingStatus status);

    function createShipment(uint256 _batchId, address _receiver, string memory _carrier) external returns (bytes32) {
        bytes32 id = keccak256(abi.encodePacked(_batchId, block.timestamp));
        
        shipments[id] = Shipment({
            batchTokenId: _batchId,
            sender: msg.sender,
            receiver: _receiver,
            carrier: _carrier,
            trackingNumber: "",
            status: ShippingStatus.Pending,
            estimatedDelivery: block.timestamp + 7 days,
            actualDelivery: 0
        });
        
        emit ShipmentCreated(id, _batchId, msg.sender);
        return id;
    }

    function updateStatus(bytes32 _id, ShippingStatus _status) external {
        Shipment storage s = shipments[_id];
        s.status = _status;
        
        if (_status == ShippingStatus.Delivered) {
            s.actualDelivery = block.timestamp;
        }
        
        emit ShipmentStatusChanged(_id, _status);
    }
}
