// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProcessingContract
 * @dev Manages herb processing steps in the supply chain
 * Each processing step is tracked as a distinct operation with parameters
 */
contract ProcessingContract is Ownable {

    // Processing step types
    enum ProcessingType {
        Drying,
        Grinding,
        Crushing,
        Filtering,
        Mixing,
        Packaging,
        Storage,
        Distillation,
        Extraction,
        Fermentation
    }

    // Processing status
    enum ProcessingStatus {
        Pending,
        InProgress,
        Completed,
        Failed,
        Verified
    }

    // Processing step structure
    struct ProcessingStep {
        uint256 id;
        uint256 batchTokenId; // Reference to HerbNFT
        ProcessingType stepType;
        ProcessingStatus status;
        address processor;
        string description;
        int256 temperature;      // Temperature in Kelvin (x100)
        uint256 duration;         // Duration in minutes
        uint256 startTime;
        uint256 endTime;
        string notes;
        bool qualityVerified;
    }

    // Batch processing history
    struct BatchProcessing {
        uint256 batchTokenId;
        uint256[] stepIds;
        ProcessingStatus overallStatus;
        uint256 startTime;
        uint256 completionTime;
    }

    // Mappings
    mapping(uint256 => ProcessingStep) public processingSteps;
    mapping(uint256 => BatchProcessing) public batchProcessing;
    mapping(address => uint256[]) public processorSteps;
    
    uint256 public nextStepId = 1;
    uint256 public nextBatchId = 1;

    // Events
    event ProcessingStepCreated(
        uint256 indexed stepId,
        uint256 indexed batchTokenId,
        ProcessingType stepType,
        address processor,
        uint256 timestamp
    );

    event ProcessingStepCompleted(
        uint256 indexed stepId,
        address processor,
        uint256 timestamp
    );

    event ProcessingStepVerified(
        uint256 indexed stepId,
        address verifier,
        bool qualityPassed
    );

    event BatchProcessingCompleted(
        uint256 indexed batchId,
        uint256 indexed batchTokenId,
        uint256 stepCount,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new processing step for a batch
     */
    function createProcessingStep(
        uint256 _batchTokenId,
        ProcessingType _stepType,
        string memory _description,
        int256 _temperature,
        uint256 _duration,
        string memory _notes
    ) external returns (uint256) {
        require(_batchTokenId > 0, "Invalid batch token ID");
        
        uint256 stepId = nextStepId++;
        
        processingSteps[stepId] = ProcessingStep({
            id: stepId,
            batchTokenId: _batchTokenId,
            stepType: _stepType,
            status: ProcessingStatus.Pending,
            processor: msg.sender,
            description: _description,
            temperature: _temperature,
            duration: _duration,
            startTime: 0,
            endTime: 0,
            notes: _notes,
            qualityVerified: false
        });

        // Initialize batch processing if not exists
        if (batchProcessing[_batchTokenId].startTime == 0) {
            batchProcessing[_batchTokenId] = BatchProcessing({
                batchTokenId: _batchTokenId,
                stepIds: new uint256[](0),
                overallStatus: ProcessingStatus.Pending,
                startTime: block.timestamp,
                completionTime: 0
            });
        }
        
        batchProcessing[_batchTokenId].stepIds.push(stepId);
        processorSteps[msg.sender].push(stepId);

        emit ProcessingStepCreated(stepId, _batchTokenId, _stepType, msg.sender, block.timestamp);

        return stepId;
    }

    /**
     * @dev Start processing a step
     */
    function startProcessing(uint256 _stepId) external {
        ProcessingStep storage step = processingSteps[_stepId];
        require(step.processor == msg.sender, "Not the assigned processor");
        require(step.status == ProcessingStatus.Pending, "Step not pending");
        
        step.status = ProcessingStatus.InProgress;
        step.startTime = block.timestamp;
    }

    /**
     * @dev Complete a processing step
     */
    function completeProcessing(uint256 _stepId) external {
        ProcessingStep storage step = processingSteps[_stepId];
        require(step.processor == msg.sender, "Not the assigned processor");
        require(step.status == ProcessingStatus.InProgress, "Step not in progress");
        
        step.status = ProcessingStatus.Completed;
        step.endTime = block.timestamp;

        emit ProcessingStepCompleted(_stepId, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify a processing step quality
     */
    function verifyProcessingStep(uint256 _stepId, bool _qualityPassed) external onlyOwner {
        ProcessingStep storage step = processingSteps[_stepId];
        require(step.status == ProcessingStatus.Completed, "Step not completed");
        
        step.qualityVerified = _qualityPassed;
        step.status = _qualityPassed ? ProcessingStatus.Verified : ProcessingStatus.Failed;

        emit ProcessingStepVerified(_stepId, msg.sender, _qualityPassed);
    }

    /**
     * @dev Mark entire batch as fully processed
     */
    function completeBatchProcessing(uint256 _batchTokenId) external onlyOwner {
        BatchProcessing storage batch = batchProcessing[_batchTokenId];
        require(batch.stepIds.length > 0, "No processing steps");
        
        // Check all steps are verified
        for (uint256 i = 0; i < batch.stepIds.length; i++) {
            require(
                processingSteps[batch.stepIds[i]].status == ProcessingStatus.Verified,
                "Not all steps verified"
            );
        }

        batch.overallStatus = ProcessingStatus.Verified;
        batch.completionTime = block.timestamp;

        emit BatchProcessingCompleted(
            nextBatchId++,
            _batchTokenId,
            batch.stepIds.length,
            block.timestamp
        );
    }

    /**
     * @dev Get all processing steps for a batch
     */
    function getBatchSteps(uint256 _batchTokenId) external view returns (ProcessingStep[] memory) {
        BatchProcessing storage batch = batchProcessing[_batchTokenId];
        ProcessingStep[] memory steps = new ProcessingStep[](batch.stepIds.length);
        
        for (uint256 i = 0; i < batch.stepIds.length; i++) {
            steps[i] = processingSteps[batch.stepIds[i]];
        }
        
        return steps;
    }

    /**
     * @dev Get processing step details
     */
    function getProcessingStep(uint256 _stepId) external view returns (ProcessingStep memory) {
        return processingSteps[_stepId];
    }

    /**
     * @dev Get processor's steps
     */
    function getProcessorSteps(address _processor) external view returns (uint256[] memory) {
        return processorSteps[_processor];
    }

    /**
     * @dev Get batch processing info
     */
    function getBatchProcessing(uint256 _batchTokenId) external view returns (BatchProcessing memory) {
        return batchProcessing[_batchTokenId];
    }

    /**
     * @dev Get total processing steps count
     */
    function getTotalSteps() external view returns (uint256) {
        return nextStepId - 1;
    }

    /**
     * @dev Update step notes
     */
    function updateStepNotes(uint256 _stepId, string memory _notes) external {
        ProcessingStep storage step = processingSteps[_stepId];
        require(step.processor == msg.sender, "Not the processor");
        step.notes = _notes;
    }
}
