// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract Staking {
    struct Stake {
        uint256 amount;
        address buyer;
        uint256 depositTimestamp;
        uint256 duration;
    }

    mapping(address => Stake) public stakes;

    function stakeEther(uint256 duration) external payable {
        require(
            duration == 1 days || duration == 7 days || duration == 30 days,
            "not a valid duration"
        );
    }

    function withdrawEther() external {}
}
