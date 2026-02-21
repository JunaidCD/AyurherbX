// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title QRCodeRegistry
 * @dev QR code management
 */
contract QRCodeRegistry {
    mapping(bytes32 => uint256) public qrToBatch;
    mapping(uint256 => bytes32) public batchToQR;

    function registerQR(bytes32 _qrHash, uint256 _batchId) external {
        qrToBatch[_qrHash] = _batchId;
        batchToQR[_batchId] = _qrHash;
    }

    function getBatchByQR(bytes32 _qrHash) external view returns (uint256) {
        return qrToBatch[_qrHash];
    }
}
