// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract Distribute {
    address[4] public contributors;
    uint256 public createTime;

    constructor(address[4] memory _contributors) payable {
        contributors = _contributors;
        createTime = block.timestamp;
    }

    function distribute() external {
        require(
            block.timestamp > createTime + 1 weeks,
            "cannot distribute yet"
        );

        uint256 amount = address(this).balance / 4;
        payable(contributors[0]).transfer(amount);
        payable(contributors[1]).transfer(amount);
        payable(contributors[2]).transfer(amount);
        payable(contributors[3]).transfer(amount);
    }
}
