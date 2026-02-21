// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QualityTestContract
 * @dev Manages quality testing and certification for herb batches
 * Records lab test results, certifications, and compliance data
 */
contract QualityTestContract is Ownable {

    // Test types
    enum TestType {
        Purity,
        Potency,
        HeavyMetals,
        Pesticides,
        Microbiology,
        MoistureContent,
        AshContent,
        ExtractiveValue,
        FiberContent,
        Adulteration
    }

    // Test status
    enum TestStatus {
        Pending,
        InProgress,
        Completed,
        Failed,
        Certified
    }

    // Certification levels
    enum CertificationLevel {
        None,
        Standard,
        Premium,
        Organic,
        GMP
    }

    // Test result structure
    struct TestResult {
        uint256 id;
        uint256 batchTokenId;
        TestType testType;
        TestStatus status;
        address labAddress;
        string testMethod;
        uint256 resultValue;
        uint256 minAcceptable;
        uint256 maxAcceptable;
        bool passed;
        string unit;
        string notes;
        uint256 testDate;
        uint256 certificationDate;
        string labReportURI; // IPFS URI for full report
    }

    // Certification structure
    struct Certification {
        uint256 id;
        uint256 batchTokenId;
        CertificationLevel level;
        address certifier;
        uint256 issueDate;
        uint256 expiryDate;
        string certStandard; // e.g., "ISO 9001", "Ayurvedic Grade A"
        bool isRevoked;
        string certURI;
    }

    // Batch test history
    struct BatchQualityProfile {
        uint256 batchTokenId;
        uint256[] testIds;
        CertificationLevel currentCertLevel;
        bool hasOrganicCert;
        bool hasGMPCert;
        uint256 overallScore; // 0-100
        uint256 lastTestDate;
    }

    // Mappings
    mapping(uint256 => TestResult) public testResults;
    mapping(uint256 => Certification) public certifications;
    mapping(uint256 => BatchQualityProfile) public qualityProfiles;
    mapping(address => uint256[]) public labTests;
    mapping(uint256 => uint256[]) public batchTests;
    mapping(uint256 => uint256[]) public batchCertifications;

    uint256 public nextTestId = 1;
    uint256 public nextCertId = 1;

    // Events
    event TestRequested(
        uint256 indexed testId,
        uint256 indexed batchTokenId,
        TestType testType,
        address labAddress,
        uint256 timestamp
    );

    event TestCompleted(
        uint256 indexed testId,
        uint256 indexed batchTokenId,
        bool passed,
        uint256 resultValue,
        uint256 timestamp
    );

    event CertificationIssued(
        uint256 indexed certId,
        uint256 indexed batchTokenId,
        CertificationLevel level,
        uint256 expiryDate,
        uint256 timestamp
    );

    event CertificationRevoked(
        uint256 indexed certId,
        address revoker,
        uint256 timestamp
    );

    event QualityProfileUpdated(
        uint256 indexed batchTokenId,
        CertificationLevel level,
        uint256 overallScore,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Request a quality test for a batch
     */
    function requestTest(
        uint256 _batchTokenId,
        TestType _testType,
        string memory _testMethod,
        uint256 _minAcceptable,
        uint256 _maxAcceptable,
        string memory _unit
    ) external returns (uint256) {
        require(_batchTokenId > 0, "Invalid batch token ID");
        
        uint256 testId = nextTestId++;
        
        testResults[testId] = TestResult({
            id: testId,
            batchTokenId: _batchTokenId,
            testType: _testType,
            status: TestStatus.Pending,
            labAddress: msg.sender,
            testMethod: _testMethod,
            resultValue: 0,
            minAcceptable: _minAcceptable,
            maxAcceptable: _maxAcceptable,
            passed: false,
            unit: _unit,
            notes: "",
            testDate: 0,
            certificationDate: 0,
            labReportURI: ""
        });

        labTests[msg.sender].push(testId);
        batchTests[_batchTokenId].push(testId);

        // Initialize quality profile if not exists
        if (qualityProfiles[_batchTokenId].lastTestDate == 0) {
            qualityProfiles[_batchTokenId] = BatchQualityProfile({
                batchTokenId: _batchTokenId,
                testIds: new uint256[](0),
                currentCertLevel: CertificationLevel.None,
                hasOrganicCert: false,
                hasGMPCert: false,
                overallScore: 0,
                lastTestDate: block.timestamp
            });
        }
        
        qualityProfiles[_batchTokenId].testIds.push(testId);

        emit TestRequested(testId, _batchTokenId, _testType, msg.sender, block.timestamp);

        return testId;
    }

    /**
     * @dev Record test result
     */
    function recordTestResult(
        uint256 _testId,
        uint256 _resultValue,
        string memory _notes,
        string memory _labReportURI
    ) external {
        TestResult storage result = testResults[_testId];
        require(result.labAddress == msg.sender, "Not the assigned lab");
        require(result.status == TestStatus.Pending, "Test not pending");
        
        result.resultValue = _resultValue;
        result.notes = _notes;
        result.labReportURI = _labReportURI;
        result.testDate = block.timestamp;
        result.passed = (_resultValue >= result.minAcceptable && _resultValue <= result.maxAcceptable);
        result.status = result.passed ? TestStatus.Completed : TestStatus.Failed;

        emit TestCompleted(_testId, result.batchTokenId, result.passed, _resultValue, block.timestamp);
        
        // Update quality profile
        _updateQualityProfile(result.batchTokenId);
    }

    /**
     * @dev Issue certification for a batch
     */
    function issueCertification(
        uint256 _batchTokenId,
        CertificationLevel _level,
        uint256 _validityDays,
        string memory _certStandard,
        string memory _certURI
    ) external onlyOwner returns (uint256) {
        require(_batchTokenId > 0, "Invalid batch token ID");
        
        uint256 certId = nextCertId++;
        
        certifications[certId] = Certification({
            id: certId,
            batchTokenId: _batchTokenId,
            level: _level,
            certifier: msg.sender,
            issueDate: block.timestamp,
            expiryDate: block.timestamp + (_validityDays * 1 days),
            certStandard: _certStandard,
            isRevoked: false,
            certURI: _certURI
        });

        batchCertifications[_batchTokenId].push(certId);

        // Update quality profile
        BatchQualityProfile storage profile = qualityProfiles[_batchTokenId];
        if (_level > profile.currentCertLevel) {
            profile.currentCertLevel = _level;
        }
        if (_level == CertificationLevel.Organic) {
            profile.hasOrganicCert = true;
        }
        if (_level == CertificationLevel.GMP) {
            profile.hasGMPCert = true;
        }

        emit CertificationIssued(certId, _batchTokenId, _level, certifications[certId].expiryDate, block.timestamp);

        return certId;
    }

    /**
     * @dev Revoke a certification
     */
    function revokeCertification(uint256 _certId) external onlyOwner {
        Certification storage cert = certifications[_certId];
        require(!cert.isRevoked, "Already revoked");
        
        cert.isRevoked = true;

        emit CertificationRevoked(_certId, msg.sender, block.timestamp);
    }

    /**
     * @dev Update quality profile after test
     */
    function _updateQualityProfile(uint256 _batchTokenId) internal {
        BatchQualityProfile storage profile = qualityProfiles[_batchTokenId];
        uint256[] storage testIds = profile.testIds;
        
        if (testIds.length == 0) return;

        uint256 passedCount = 0;
        for (uint256 i = 0; i < testIds.length; i++) {
            if (testResults[testIds[i]].passed) {
                passedCount++;
            }
        }

        // Calculate overall score (percentage of passed tests)
        profile.overallScore = (passedCount * 100) / testIds.length;
        profile.lastTestDate = block.timestamp;

        emit QualityProfileUpdated(_batchTokenId, profile.currentCertLevel, profile.overallScore, block.timestamp);
    }

    /**
     * @dev Get test result details
     */
    function getTestResult(uint256 _testId) external view returns (TestResult memory) {
        return testResults[_testId];
    }

    /**
     * @dev Get certification details
     */
    function getCertification(uint256 _certId) external view returns (Certification memory) {
        return certifications[_certId];
    }

    /**
     * @dev Get batch quality profile
     */
    function getQualityProfile(uint256 _batchTokenId) external view returns (BatchQualityProfile memory) {
        return qualityProfiles[_batchTokenId];
    }

    /**
     * @dev Get batch test results
     */
    function getBatchTests(uint256 _batchTokenId) external view returns (TestResult[] memory) {
        uint256[] storage testIds = batchTests[_batchTokenId];
        TestResult[] memory results = new TestResult[](testIds.length);
        
        for (uint256 i = 0; i < testIds.length; i++) {
            results[i] = testResults[testIds[i]];
        }
        
        return results;
    }

    /**
     * @dev Get batch certifications
     */
    function getBatchCertifications(uint256 _batchTokenId) external view returns (Certification[] memory) {
        uint256[] storage certIds = batchCertifications[_batchTokenId];
        Certification[] memory certs = new Certification[](certIds.length);
        
        for (uint256 i = 0; i < certIds.length; i++) {
            certs[i] = certifications[certIds[i]];
        }
        
        return certs;
    }

    /**
     * @dev Check if batch is fully certified
     */
    function isBatchCertified(uint256 _batchTokenId) external view returns (bool) {
        BatchQualityProfile storage profile = qualityProfiles[_batchTokenId];
        return profile.currentCertLevel >= CertificationLevel.Standard && profile.overallScore >= 80;
    }

    /**
     * @dev Get lab's tests
     */
    function getLabTests(address _lab) external view returns (uint256[] memory) {
        return labTests[_lab];
    }

    /**
     * @dev Get total tests
     */
    function getTotalTests() external view returns (uint256) {
        return nextTestId - 1;
    }

    /**
     * @dev Get total certifications
     */
    function getTotalCertifications() external view returns (uint256) {
        return nextCertId - 1;
    }
}
