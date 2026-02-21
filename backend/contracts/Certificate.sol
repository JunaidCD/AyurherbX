// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateContract
 * @dev Document certificates for herb batches
 */
contract CertificateContract {
    struct Certificate {
        uint256 batchTokenId;
        string certType;
        string issuer;
        string documentHash;
        uint256 issueDate;
        uint256 expiryDate;
        bool valid;
    }

    mapping(bytes32 => Certificate) public certificates;

    event CertificateIssued(bytes32 indexed certId, uint256 batchId, string certType);
    event CertificateRevoked(bytes32 indexed certId);

    function issueCertificate(uint256 _batchId, string memory _type, string memory _issuer, uint256 _validityDays) external returns (bytes32) {
        bytes32 certId = keccak256(abi.encodePacked(_batchId, _type, block.timestamp));
        
        certificates[certId] = Certificate({
            batchTokenId: _batchId,
            certType: _type,
            issuer: _issuer,
            documentHash: "",
            issueDate: block.timestamp,
            expiryDate: block.timestamp + (_validityDays * 1 days),
            valid: true
        });
        
        emit CertificateIssued(certId, _batchId, _type);
        return certId;
    }

    function revokeCertificate(bytes32 _certId) external {
        certificates[_certId].valid = false;
        emit CertificateRevoked(_certId);
    }

    function isValid(bytes32 _certId) external view returns (bool) {
        Certificate memory c = certificates[_certId];
        return c.valid && block.timestamp < c.expiryDate;
    }
}
