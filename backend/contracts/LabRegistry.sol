// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LabRegistry
 * @dev Lab registration and accreditation
 */
contract LabRegistry {
    struct Lab {
        string name;
        string accreditation;
        address labAddress;
        bool certified;
    }

    mapping(address => Lab) public labs;

    function registerLab(string memory _name, string memory _accreditation) external {
        labs[msg.sender] = Lab({
            name: _name,
            accreditation: _accreditation,
            labAddress: msg.sender,
            certified: false
        });
    }

    function certifyLab(address _lab) external {
        labs[_lab].certified = true;
    }
}
