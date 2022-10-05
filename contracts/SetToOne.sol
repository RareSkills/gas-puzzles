// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract SetToOne {
    uint8 public one;

    // TODO: change to a better name
    function foobar() external {
        one = 1;
    }
}
