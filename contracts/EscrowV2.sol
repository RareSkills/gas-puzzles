// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract CreateEscrowV2Contract {}

contract EscrowV2 {
    address public buyer;
    address public seller;
    address public arbiter;
    uint256 public depositDate;
    uint256 public duration;
    bool public alreadyDeposited;

    constructor(
        address _buyer,
        address _seller,
        address _arbiter,
        uint256 _duration
    ) {}

    function buyerDeposit() public payable {
        require(
            msg.sender == buyer,
            "you are not the buyer, you cannot deposit"
        );
        require(alreadyDeposited == false, "you cannot deposit twice");
        depositDate = block.timestamp;
    }

    function sellerWithdraw() public {
        require(
            msg.sender == seller,
            "you are not the seller, you cannot withdraw"
        );
        require(
            block.timestamp >= depositDate + duration,
            "you cannot withdraw yet, you greedy seller. Take it easy"
        );
        payable(msg.sender).transfer(address(this).balance);
    }
}
