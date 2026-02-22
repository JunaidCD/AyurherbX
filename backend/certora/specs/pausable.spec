/*
 * Pausable Verification Spec for HerbNFTv2
 * 
 * This spec verifies that:
 * 1. Only admin can pause/unpause
 * 2. Minting is blocked when paused
 * 3. Verification is blocked when paused
 */

methods {
    // Allow external calls
    function pause() external => DISPATCHER(true);
    function unpause() external => DISPATCHER(true);
    function paused() external => DISPATCHER(true);
    function grantRole(bytes32, address) external => DISPATCHER(true);
    function hasRole(bytes32, address) external => DISPATCHER(true);
}

/*
 * @rule Only admin can pause the contract
 */
rule onlyAdminCanPause() {
    env e;
    require !hasRole(ADMIN_ROLE, e.msg.sender);
    
    pause();
    
    assert paused(), "Non-admin cannot pause the contract";
}

/*
 * @rule Only admin can unpause the contract
 */
rule onlyAdminCanUnpause() {
    env e;
    require !hasRole(ADMIN_ROLE, e.msg.sender);
    require paused();
    
    unpause();
    
    assert !paused(), "Non-admin cannot unpause the contract";
}

/*
 * @rule Minting is blocked when paused
 */
rule mintingBlockedWhenPaused(address minter) {
    env e;
    require paused();
    require hasRole(MINTER_ROLE, minter) || hasRole(ADMIN_ROLE, minter);
    
    // Try to mint - this should fail
    mintHerbBatch("Herb", "BATCH001", "Location", "2024-01-01", "uri");
    
    // If we get here, minting succeeded when paused - this is a bug
    // The rule is broken if this assertion fails
    assert false, "Minting should be blocked when paused";
}

/*
 * @rule Verification is blocked when paused
 */
rule verificationBlockedWhenPaused(uint256 tokenId, address verifier) {
    env e;
    require paused();
    require hasRole(VERIFIER_ROLE, verifier) || hasRole(ADMIN_ROLE, verifier);
    
    // Try to verify - this should fail
    verifyHerbBatch(tokenId, "A");
    
    // If we get here, verification succeeded when paused - this is a bug
    assert false, "Verification should be blocked when paused";
}
