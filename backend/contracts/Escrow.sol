// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EscrowContract
 * @dev Secure payment escrow for herb transactions
 */
contract EscrowContract {
    enum State { Created, Funded, Released, Cancelled }

    struct Escrow {
        address buyer;
        address seller;
        address arbiter;
        uint256 amount;
        State state;
        uint256 createdAt;
    }

    mapping(bytes32 => Escrow) public escrows;

    event EscrowCreated(bytes32 indexed id, address buyer, address seller, uint256 amount);
    event EscrowFunded(bytes32 indexed id, address funder);
    event EscrowReleased(bytes32 indexed id, address recipient);
    event EscrowCancelled(bytes32 indexed id);

    function createEscrow(address _seller, address _arbiter) external payable returns (bytes32) {
        bytes32 id = keccak256(abi.encodePacked(msg.sender, _seller, block.timestamp));
        
        escrows[id] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            arbiter: _arbiter,
            amount: msg.value,
            state: State.Funded,
            createdAt: block.timestamp
        });

        emit EscrowCreated(id, msg.sender, _seller, msg.value);
        emit EscrowFunded(id, msg.sender);
        return id;
    }

    function releaseEscrow(bytes32 _id) external {
        Escrow storage e = escrows[_id];
        require(e.arbiter == msg.sender, "Not arbiter");
        require(e.state == State.Funded, "Not funded");
        
        e.state = State.Released;
        payable(e.seller).transfer(e.amount);
        
        emit EscrowReleased(_id, e.seller);
    }

    function cancelEscrow(bytes32 _id) external {
        Escrow storage e = escrows[_id];
        require(e.buyer == msg.sender || e.arbiter == msg.sender, "Not authorized");
        require(e.state == State.Funded, "Not funded");
        
        e.state = State.Cancelled;
        payable(e.buyer).transfer(e.amount);
        
        emit EscrowCancelled(_id);
    }
}
