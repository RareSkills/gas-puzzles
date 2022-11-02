const {
    time,
    loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

// RULES
// - You may only use the attacker account
// - Multiple transactions allowed, but fewer makes you cooler
// - You may not modify the victim contract or anything it inherits from
// - You may not modify NFT or the parent contracts
// - You may not modify the tests, you may only write code in the specified block
// - You may not tamper with the javascript random number generator
// - You pass the challenge if you pass the test, but if you can
//   lower the GAS_LIMIT below 46, that makes you cooler

describe('ERC165Challenge', function () {
    this.beforeEach(async function () {
        await ethers.provider.send('hardhat_reset');
        [owner, attacker] = await ethers.getSigners();
        const AwardFactory = await ethers.getContractFactory('Award');
        const award = await AwardFactory.deploy();

        const order = [1, 2, 3, 4];
        shuffleArray(order);

        const Factory = await ethers.getContractFactory('NFTGiver');
        const victim = await Factory.deploy(award.address, order);

        this.victim = victim;
        this.attacker = attacker;
        this.award = award;
        this.order = order;
        award.transferFrom(owner.address, victim.address, 1337);
    });

    [1, 2, 3, 4, 5, 6, 7].forEach(function (round) {
        it(`Hack Round ${round}`, async function () {
            /* YOUR CODE HERE */
        });
    });

    this.afterEach(async function () {
        expect(await this.award.ownerOf(1337)).to.be.equal(
            this.attacker.address
        );
    });

    this.afterAll(async function () {
        const limitUsed = await this.victim.GAS_LIMIT();
        const numTxns = await ethers.provider.getTransactionCount(
            attacker.address
        );
        console.log(`\nGas limit used: ${limitUsed}`);
        console.log(`Number of Transactions: ${numTxns}`);
    });
});
