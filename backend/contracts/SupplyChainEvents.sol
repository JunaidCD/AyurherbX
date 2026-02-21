// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SupplyChainEvents {
    event BatchCreated(bytes32 indexed batchId, address indexed farmer, uint256 timestamp);
    event BatchProcessed(bytes32 indexed batchId, address indexed processor, uint256 timestamp);
    event QualityTested(bytes32 indexed batchId, address indexed lab, uint256 timestamp);
    event ProductShipped(bytes32 indexed batchId, address indexed logistics, uint256 timestamp);
    event ProductDelivered(bytes32 indexed batchId, address indexed retailer, uint256 timestamp);
    event OwnershipTransferred(bytes32 indexed batchId, address indexed from, address indexed to);
    
    struct SupplyEvent {
        bytes32 batchId;
        string eventType;
        address party;
        uint256 timestamp;
        string location;
    }
    
    mapping(bytes32 => SupplyEvent[]) public supplyChain;
    
    function addEvent(
        bytes32 batchId,
        string calldata eventType,
        address party,
        string calldata location
    ) external {
        supplyChain[batchId].push(SupplyEvent({
            batchId: batchId,
            eventType: eventType,
            party: party,
            timestamp: block.timestamp,
            location: location
        }));
    }
    
    function getEvents(bytes32 batchId) external view returns (SupplyEvent[] memory) {
        return supplyChain[batchId];
    }
    
    function getEventCount(bytes32 batchId) external view returns (uint256) {
        return supplyChain[batchId].length;
    }
}
