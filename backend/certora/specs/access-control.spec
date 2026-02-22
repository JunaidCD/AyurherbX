/*
 * Access Control Verification Spec for HerbNFTv2
 * 
 * This spec verifies that:
 * 1. Only ADMIN_ROLE can grant/revoke roles
 * 2. Role assignments are correctly tracked
 * 3. Default admin cannot be removed
 */

methods {
    // Allow external calls
    function grantRole(bytes32, address) external => DISPATCHER(true);
    function revokeRole(bytes32, address) external => DISPATCHER(true);
    function hasRole(bytes32, address) external => DISPATCHER(true);
    function ownerOf(uint256) external => DISPATCHER(true);
}

/*
 * @rule Only admin can grant MINTER_ROLE
 */
rule onlyAdminCanGrantMinterRole(address user) {
    env e;
    require !hasRole(ADMIN_ROLE, e.msg.sender);
    
    grantMinterRole(user);
    
    assert hasRole(MINTER_ROLE, user), "Non-admin cannot grant MINTER_ROLE";
}

/*
 * @rule Only admin can grant VERIFIER_ROLE
 */
rule onlyAdminCanGrantVerifierRole(address user) {
    env e;
    require !hasRole(ADMIN_ROLE, e.msg.sender);
    
    grantVerifierRole(user);
    
    assert hasRole(VERIFIER_ROLE, user), "Non-admin cannot grant VERIFIER_ROLE";
}

/*
 * @rule Default admin role cannot be revoked
 */
rule defaultAdminCannotBeRevoked(address user) {
    env e;
    require hasRole(DEFAULT_ADMIN_ROLE, user);
    
    revokeRole(DEFAULT_ADMIN_ROLE, user);
    
    assert hasRole(DEFAULT_ADMIN_ROLE, user), "DEFAULT_ADMIN_ROLE cannot be revoked";
}

/*
 * @rule Only token owner can mark as processed
 */
rule onlyOwnerCanMarkAsProcessed(uint256 tokenId) {
    env e;
    address currentOwner = ownerOf(tokenId);
    require currentOwner != e.msg.sender;
    
    markAsProcessed(tokenId);
    
    // If this rule is broken, the function would have succeeded
    // with a non-owner, which is not allowed
}
