//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract Award is ERC721 {
    constructor() ERC721('Award', 'A') {
        _mint(msg.sender, 1337);
    }
}

// NOTE
// The NFTGiver contract does not follow the ERC165 spec properly. It's supposed
// to consist of two calls, one to determine if it is ERC165, then the specific
// protocol. Don't copy this code for production applications.

contract NFTGiver {
    uint256 public constant GAS_LIMIT = 46;
    struct Game {
        bool success1;
        bool success2;
        bool success3;
        bool success4;
    }

    mapping(ERC165 => Game) private passedChallenge;
    bytes4 immutable ERC1155Reciever = 0x4e2312e0;
    bytes4 immutable ERC1363Reciever = 0x88a7ca5c;
    bytes4 immutable ERCRareReciever = 0x13371337;
    bytes4 immutable ERCBadReceiver = 0xdecafc0f;

    ERC721 private award;
    uint256[] private order;

    constructor(ERC721 awardNFT, uint256[] memory _order) {
        award = awardNFT;
        order = _order;
    }

    function _supportsInterface(ERC165 target, bytes4 _interface)
        public
        view
        returns (bool)
    {
        return target.supportsInterface{gas: GAS_LIMIT}(_interface);
    }

    function challenge1(ERC165 target) external {
        require(_supportsInterface(target, ERC1155Reciever));
        require(!_supportsInterface(target, ERC1363Reciever));
        require(!_supportsInterface(target, ERCRareReciever));
        require(!_supportsInterface(target, ERCBadReceiver));
        passedChallenge[target].success1 = true;

        require(order[order.length - 1] == 1);
        order.pop();
    }

    function challenge2(ERC165 target) external {
        require(!_supportsInterface(target, ERC1155Reciever));
        require(_supportsInterface(target, ERC1363Reciever));
        require(!_supportsInterface(target, ERCRareReciever));
        require(!_supportsInterface(target, ERCBadReceiver));

        require(order[order.length - 1] == 2);
        order.pop();

        passedChallenge[target].success2 = true;
    }

    function challenge3(ERC165 target) external {
        require(!_supportsInterface(target, ERC1155Reciever));
        require(!_supportsInterface(target, ERC1363Reciever));
        require(_supportsInterface(target, ERCRareReciever));
        require(!_supportsInterface(target, ERCBadReceiver));

        require(order[order.length - 1] == 3);
        order.pop();

        passedChallenge[target].success3 = true;
    }

    function challenge4(ERC165 target) external {
        require(!_supportsInterface(target, ERC1155Reciever));
        require(!_supportsInterface(target, ERC1363Reciever));
        require(!_supportsInterface(target, ERCRareReciever));
        require(_supportsInterface(target, ERCBadReceiver));

        require(order[order.length - 1] == 4);
        order.pop();

        passedChallenge[target].success4 = true;
    }

    function success(ERC165 target) external {
        require(passedChallenge[target].success1);
        require(passedChallenge[target].success2);
        require(passedChallenge[target].success3);
        require(passedChallenge[target].success4);

        delete passedChallenge[target];

        require(award.ownerOf(1337) == address(this));
        award.transferFrom(address(this), msg.sender, 1337);
    }
}
