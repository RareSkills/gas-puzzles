const { expect, use } = require('chai');
const { ethers } = require('hardhat');
const helpers = require('@nomicfoundation/hardhat-network-helpers');

use(require('chai-as-promised'));

const logGasUsage = (currentGasUsage) => {
    console.log(`           Current gas use:   ${currentGasUsage}`);
};

// ** MODIFYING THE TEST IS NOT ALLOWED FOR THIS CONTEST ** //
// Your can remove contracts_optimized from the .gitignore to share your answer
describe('Security101', async function () {
    let attacker;
    let victimToken;

    beforeEach(async () => {
        await ethers.provider.send('hardhat_reset');

        [owner, attacker] = await ethers.getSigners();
        const VictimToken = await ethers.getContractFactory(
            'contracts/contracts_optimized/OptimizedSecurity101.sol:Security101'
        );
        victimToken = await VictimToken.deploy();
        await victimToken.deployed();
        await helpers.setBalance(
            victimToken.address,
            ethers.utils.parseEther('10000')
        );
    });

    describe('Gas target (redacted)', function () {
        it('Hack the contract', async function () {
            const attackerContract = await ethers.getContractFactory(
                'contracts/contracts_optimized/OptimizedSecurity101.sol:OptimizedAttackerSecurity101'
            );

            const txn = await attackerContract
                .connect(attacker)
                .deploy(victimToken.address, {
                    value: ethers.utils.parseEther('1.0'),
                });

            const receipt = await txn.deployTransaction.wait();
            const gasUsed = receipt.cumulativeGasUsed;

            logGasUsage(gasUsed);
        });
    });

    afterEach('hack must succeed', async function () {
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.greaterThan(
            ethers.utils.parseEther('9900'),
            'attacker gets money'
        );
        expect(
            await ethers.provider.getBalance(victimToken.address)
        ).to.be.equal(0, 'victim contract not drained');
        expect(
            await ethers.provider.getTransactionCount(attacker.address)
        ).to.equal(1, 'only one transaction allowed');
    });
});
