// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract Require {
    // Do not modify these variables
    uint256 constant COOLDOWN = 1 minutes;
    uint256 lastPurchaseTime;

    // Optimize this function
    function purchaseToken() external payable {
        require(
            msg.value == 0.1 ether &&
                block.timestamp > lastPurchaseTime + COOLDOWN,
            'cannot purchase'
        );
        lastPurchaseTime = block.timestamp;
        // mint the user a token
    }
}
