// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InsuranceClaim {
    struct Claim {
        bytes32 claimId;
        bytes32 batchId;
        address claimant;
        uint256 amount;
        string reason;
        string status;
        uint256 filedAt;
    }
    
    mapping(bytes32 => Claim) public claims;
    
    event ClaimFiled(bytes32 indexed claimId, address indexed claimant, uint256 amount);
    event ClaimResolved(bytes32 indexed claimId, string resolution);
    
    function fileClaim(
        bytes32 claimId,
        bytes32 batchId,
        uint256 amount,
        string calldata reason
    ) external {
        require(claims[claimId].filedAt == 0, "Claim exists");
        
        claims[claimId] = Claim({
            claimId: claimId,
            batchId: batchId,
            claimant: msg.sender,
            amount: amount,
            reason: reason,
            status: "Pending",
            filedAt: block.timestamp
        });
        
        emit ClaimFiled(claimId, msg.sender, amount);
    }
    
    function resolveClaim(bytes32 claimId, string calldata resolution) external {
        claims[claimId].status = resolution;
        emit ClaimResolved(claimId, resolution);
    }
    
    function getClaim(bytes32 claimId) external view returns (Claim memory) {
        return claims[claimId];
    }
}
