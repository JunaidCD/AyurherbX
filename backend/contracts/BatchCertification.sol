// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BatchCertification {
    struct Certification {
        bytes32 batchId;
        string certName;
        string issuer;
        uint256 issueDate;
        bool valid;
    }
    
    mapping(bytes32 => Certification[]) public certifications;
    
    event CertificationIssued(bytes32 indexed batchId, string certName);
    
    function issueCertification(
        bytes32 batchId,
        string calldata certName,
        string calldata issuer
    ) external {
        certifications[batchId].push(Certification({
            batchId: batchId,
            certName: certName,
            issuer: issuer,
            issueDate: block.timestamp,
            valid: true
        }));
        
        emit CertificationIssued(batchId, certName);
    }
    
    function getCertifications(bytes32 batchId) external view returns (Certification[] memory) {
        return certifications[batchId];
    }
}
