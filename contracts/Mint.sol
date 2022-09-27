// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract Mint {
    uint256 public constant MAX_SUPPLY = 150;
    uint256 public totalSupply;
    uint256 public publicMintOpens;
    mapping(address => bool) alreadyMinted;
    address public deployer;
    uint256 public minimumBuffer = 1 days;

    constructor() {
        deployer = msg.sender;
    }

    function setMintOpenDate(uint256 unixDate) external {
        require(msg.sender == deployer, "only deployer");
        require(unixDate >= minimumBuffer, "not enough buffer");
        publicMintOpens = unixDate;
    }

    function mint() external payable {
        require(totalSupply < MAX_SUPPLY, "supply used up");
        require(!alreadyMinted[msg.sender], "you already minted");
        require(msg.value == 0.07 ether, "wrong price");
        require(
            publicMintOpens != 0 && block.timestamp > publicMintOpens,
            "public mint not open"
        );

        alreadyMinted[msg.sender] = true;
        totalSupply++;
        // mint the token
    }
}
