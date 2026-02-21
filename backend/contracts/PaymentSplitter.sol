// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PaymentSplitterContract
 * @dev Split payments among multiple recipients
 */
contract PaymentSplitterContract {
    event PaymentReceived(address from, uint256 amount);
    event FundsDistributed(address[] recipients, uint256[] amounts);

    function distribute(address[] memory _recipients, uint256[] memory _amounts) external payable {
        require(_recipients.length == _amounts.length, "Length mismatch");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            payable(_recipients[i]).transfer(_amounts[i]);
        }
        
        emit FundsDistributed(_recipients, _amounts);
    }

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }
}
