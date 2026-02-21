// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificationManager {
    struct Certificate {
        bytes32 batchId;
        string certType;
        string issuingAuthority;
        uint256 issueDate;
        uint256 expiryDate;
        bool valid;
        string certificateURI;
    }
    
    mapping(bytes32 => Certificate[]) public certificates;
    
    event CertificateIssued(bytes32 indexed batchId, string certType, uint256 issueDate);
    event CertificateRevoked(bytes32 indexed batchId, uint256 index);
    
    function issueCertificate(
        bytes32 batchId,
        string calldata certType,
        string calldata issuingAuthority,
        uint256 validityPeriod,
        string calldata certificateURI
    ) external {
        certificates[batchId].push(Certificate({
            batchId: batchId,
            certType: certType,
            issuingAuthority: issuingAuthority,
            issueDate: block.timestamp,
            expiryDate: block.timestamp + validityPeriod,
            valid: true,
            certificateURI: certificateURI
        }));
        
        emit CertificateIssued(batchId, certType, block.timestamp);
    }
    
    function revokeCertificate(bytes32 batchId, uint256 index) external {
        require(certificates[batchId].length > index, "Invalid index");
        certificates[batchId][index].valid = false;
        
        emit CertificateRevoked(batchId, index);
    }
    
    function getCertificates(bytes32 batchId) external view returns (Certificate[] memory) {
        return certificates[batchId];
    }
}
