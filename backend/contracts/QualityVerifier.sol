// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract QualityVerifier {
    struct QualityRecord {
        bytes32 batchId;
        uint256 qualityScore;
        string testResults;
        address labAddress;
        uint256 timestamp;
        bool approved;
    }
    
    mapping(bytes32 => QualityRecord[]) public qualityRecords;
    
    event QualityTestRecorded(bytes32 indexed batchId, uint256 qualityScore, address indexed lab);
    event QualityApproved(bytes32 indexed batchId, bool approved);
    
    function recordQualityTest(
        bytes32 batchId,
        uint256 qualityScore,
        string calldata testResults,
        address labAddress
    ) external {
        qualityRecords[batchId].push(QualityRecord({
            batchId: batchId,
            qualityScore: qualityScore,
            testResults: testResults,
            labAddress: labAddress,
            timestamp: block.timestamp,
            approved: false
        }));
        
        emit QualityTestRecorded(batchId, qualityScore, labAddress);
    }
    
    function approveQuality(bytes32 batchId, uint256 recordIndex, bool approved) external {
        require(qualityRecords[batchId].length > recordIndex, "Invalid record");
        qualityRecords[batchId][recordIndex].approved = approved;
        emit QualityApproved(batchId, approved);
    }
    
    function getQualityRecords(bytes32 batchId) external view returns (QualityRecord[] memory) {
        return qualityRecords[batchId];
    }
    
    function getLatestQualityScore(bytes32 batchId) external view returns (int256) {
        QualityRecord[] memory records = qualityRecords[batchId];
        if (records.length == 0) return -1;
        return int256(records[records.length - 1].qualityScore);
    }
}
