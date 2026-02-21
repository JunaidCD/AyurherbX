// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProcessingNFT {
    struct ProcessingStep {
        uint256 stepId;
        string stepType;
        uint256 temperature;
        uint256 duration;
        address operator;
        uint256 timestamp;
    }
    
    mapping(bytes32 => ProcessingStep[]) public processingSteps;
    mapping(bytes32 => bool) public batchProcessed;
    
    event ProcessingStarted(bytes32 indexed batchId, address indexed processor);
    event ProcessingStepAdded(bytes32 indexed batchId, uint256 stepId, string stepType);
    event ProcessingCompleted(bytes32 indexed batchId);
    
    function startProcessing(bytes32 batchId) external {
        require(!batchProcessed[batchId], "Already processed");
        emit ProcessingStarted(batchId, msg.sender);
    }
    
    function addProcessingStep(
        bytes32 batchId,
        string calldata stepType,
        uint256 temperature,
        uint256 duration
    ) external {
        ProcessingStep[] storage steps = processingSteps[batchId];
        steps.push(ProcessingStep({
            stepId: steps.length,
            stepType: stepType,
            temperature: temperature,
            duration: duration,
            operator: msg.sender,
            timestamp: block.timestamp
        }));
        
        emit ProcessingStepAdded(batchId, steps.length - 1, stepType);
    }
    
    function completeProcessing(bytes32 batchId) external {
        require(processingSteps[batchId].length > 0, "No steps recorded");
        batchProcessed[batchId] = true;
        emit ProcessingCompleted(batchId);
    }
    
    function getProcessingSteps(bytes32 batchId) external view returns (ProcessingStep[] memory) {
        return processingSteps[batchId];
    }
}
