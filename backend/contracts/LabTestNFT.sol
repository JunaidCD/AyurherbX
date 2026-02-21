// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LabTestNFT {
    struct LabTest {
        bytes32 batchId;
        string testType;
        string result;
        uint256 qualityScore;
        address labAddress;
        uint256 testDate;
        bool passed;
    }
    
    mapping(bytes32 => LabTest[]) public labTests;
    mapping(address => bool) public authorizedLabs;
    
    event LabTestRecorded(bytes32 indexed batchId, address indexed lab, uint256 qualityScore);
    event LabAuthorized(address indexed lab, bool authorized);
    
    function authorizeLab(address lab, bool authorized) external {
        authorizedLabs[lab] = authorized;
        emit LabAuthorized(lab, authorized);
    }
    
    function recordTest(
        bytes32 batchId,
        string calldata testType,
        string calldata result,
        uint256 qualityScore,
        bool passed
    ) external {
        require(authorizedLabs[msg.sender], "Not authorized");
        
        labTests[batchId].push(LabTest({
            batchId: batchId,
            testType: testType,
            result: result,
            qualityScore: qualityScore,
            labAddress: msg.sender,
            testDate: block.timestamp,
            passed: passed
        }));
        
        emit LabTestRecorded(batchId, msg.sender, qualityScore);
    }
    
    function getLabTests(bytes32 batchId) external view returns (LabTest[] memory) {
        return labTests[batchId];
    }
    
    function getLatestTest(bytes32 batchId) external view returns (LabTest memory) {
        LabTest[] memory tests = labTests[batchId];
        require(tests.length > 0, "No tests recorded");
        return tests[tests.length - 1];
    }
}
