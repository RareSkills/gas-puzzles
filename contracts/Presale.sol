// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract Presale {
    bool[200] public theLuckyFew;
    bytes32 merkleRoot;

    function mint() public {
        require(inTheMerkleTree(msg.sender), "not allowed");
        setAlreadyMinted();

        // mint them a token
    }

    function setAlreadyMinted() internal {}

    function inTheMerkleTree(address buyer) internal returns (bool) {}
}
