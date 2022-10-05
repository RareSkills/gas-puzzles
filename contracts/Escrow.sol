// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CreateEscrowContract {}

contract Escrow is ReentrancyGuard {
    address public buyer;
    address public seller;
    address public arbiter;
    uint256 public expiration;
    bool public arbiterUnlocked;
    uint256 public depositDate;
    bool public alreadyDeposited;

    constructor(
        address _buyer,
        address _seller,
        address _arbiter,
        uint256 _expiration
    ) {
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        expiration = expiration;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "only arbiter");
        _;
    }

    function buyerDeposit() public payable nonReentrant {
        require(
            msg.sender == buyer,
            "you are not the buyer, you cannot deposit"
        );
        require(alreadyDeposited == false, "you cannot deposit twice");
        depositDate = block.timestamp;
    }

    function arbiterRefund() public onlyArbiter {
        payable(buyer).transfer(address(this).balance);
    }

    function arbiterUnlock() public onlyArbiter {
        arbiterUnlocked = true;
    }

    function updateArbiter(address _newArbiter) public onlyArbiter {
        arbiter = _newArbiter;
    }

    function sellerWithdraw() public {
        require(
            msg.sender == seller,
            "you are not the seller, you cannot withdraw"
        );
        require(
            arbiterUnlocked || block.timestamp > expiration,
            "arbiter has not unlocked"
        );
        payable(seller).transfer(address(this).balance);
    }
}
