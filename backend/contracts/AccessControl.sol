// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AyurHerbAccessControl
 * @dev Role-based access control for the AyurHerb platform
 */
contract AyurHerbAccessControl {

    bytes32 public constant COLLECTOR_ROLE = keccak256("COLLECTOR_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(bytes32 => mapping(address => bool)) public roles;

    event CollectorRoleGranted(address indexed account);
    event CollectorRoleRevoked(address indexed account);
    event ProcessorRoleGranted(address indexed account);
    event ProcessorRoleRevoked(address indexed account);
    event LabRoleGranted(address indexed account);
    event LabRoleRevoked(address indexed account);

    function grantCollectorRole(address account) external {
        roles[COLLECTOR_ROLE][account] = true;
        emit CollectorRoleGranted(account);
    }

    function grantProcessorRole(address account) external {
        roles[PROCESSOR_ROLE][account] = true;
        emit ProcessorRoleGranted(account);
    }

    function grantLabRole(address account) external {
        roles[LAB_ROLE][account] = true;
        emit LabRoleGranted(account);
    }

    function revokeCollectorRole(address account) external {
        roles[COLLECTOR_ROLE][account] = false;
        emit CollectorRoleRevoked(account);
    }

    function isCollector(address account) external view returns (bool) {
        return roles[COLLECTOR_ROLE][account];
    }

    function isProcessor(address account) external view returns (bool) {
        return roles[PROCESSOR_ROLE][account];
    }

    function isLab(address account) external view returns (bool) {
        return roles[LAB_ROLE][account];
    }
}
