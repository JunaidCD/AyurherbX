// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RouteTracker {
    struct Route {
        bytes32 batchId;
        string[] waypoints;
        uint256[] timestamps;
    }
    
    mapping(bytes32 => Route) public routes;
    
    event WaypointAdded(bytes32 indexed batchId, string location);
    
    function addWaypoint(bytes32 batchId, string calldata location) external {
        routes[batchId].waypoints.push(location);
        routes[batchId].timestamps.push(block.timestamp);
        
        emit WaypointAdded(batchId, location);
    }
    
    function getRoute(bytes32 batchId) external view returns (string[] memory, uint256[] memory) {
        return (routes[batchId].waypoints, routes[batchId].timestamps);
    }
}
