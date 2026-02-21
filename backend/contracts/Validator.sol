// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ValidatorContract
 * @dev Data validation for herb batches
 */
contract ValidatorContract {
    mapping(bytes32 => bool) public validatedData;

    event DataValidated(bytes32 indexed dataHash, address validator);

    function validateData(bytes32 _dataHash) external {
        validatedData[_dataHash] = true;
        emit DataValidated(_dataHash, msg.sender);
    }

    function isValidated(bytes32 _dataHash) external view returns (bool) {
        return validatedData[_dataHash];
    }
}
