const { expect, use } = require('chai');
const { ethers } = require('hardhat');
const { BigNumber } = ethers;
const helpers = require('@nomicfoundation/hardhat-network-helpers');

use(require('chai-as-promised'));

const TARGET_GAS_PRICE = 57_044;
const EIGHT_DAYS = 60 * 60 * 24 * 8;

const logGasUsage = (currentGasUsage) => {
    const diff = TARGET_GAS_PRICE - currentGasUsage;
    console.log(`           Current gas use:   ${currentGasUsage}`);
    console.log(`           The gas target is: ${TARGET_GAS_PRICE}`);
    if (diff < 0) {
        console.log(
            `           You are \x1b[31m${diff * -1}\x1b[0m above the target`
        );
    }
};

describe('Distribute', async function () {
    let instance;
    let owner;
    let acct1;
    let acct2;
    let acct3;
    let acct4;

    beforeEach(async () => {
        [owner, acct1, acct2, acct3, acct4] = await ethers.getSigners();
        const ContractFactory = await ethers.getContractFactory(
            'OptimizedDistribute'
        );
        instance = await ContractFactory.deploy([
            acct1.address,
            acct2.address,
            acct3.address,
            acct4.address,
        ]);

        await instance.deployed();
    });

    describe('Payable', function () {
        it('The functions MUST remain non-payable', async function () {
            let error;
            try {
                await instance.distribute({
                    value: ethers.utils.parseEther('1.00'),
                });
            } catch (e) {
                error = e;
            }

            expect(error.reason).to.equal(
                'non-payable method cannot override value'
            );
            expect(error.code).to.equal('UNSUPPORTED_OPERATION');
            expect(instance.distribute()).to.not.be.rejected;
        });
    });

    describe('Gas target', function () {
        it('The functions MUST meet the expected gas efficiency', async function () {
            await helpers.time.increase(EIGHT_DAYS);
            await helpers.setBalance(
                instance.address,
                ethers.utils.parseEther('1.00')
            );
            const gasEstimate = await instance.estimateGas.distribute();

            logGasUsage(gasEstimate);

            expect(gasEstimate).to.satisfy(function (val) {
                return val <= TARGET_GAS_PRICE;
            });
        });
    });

    describe('Business logic', function () {
        it('The functions MUST perform as expected', async function () {
            await expect(instance.distribute()).to.be.rejectedWith(
                'cannot distribute yet'
            );

            await helpers.time.increase(EIGHT_DAYS);

            await helpers.setBalance(
                instance.address,
                ethers.utils.parseEther('1.00')
            );
            await helpers.setBalance(acct1.address, 0);
            await helpers.setBalance(acct2.address, 0);
            await helpers.setBalance(acct3.address, 0);
            await helpers.setBalance(acct4.address, 0);

            await instance.distribute();

            expect(await ethers.provider.getBalance(acct1.address)).to.equal(
                new BigNumber.from(ethers.utils.parseEther('0.25'))
            );
            expect(await ethers.provider.getBalance(acct2.address)).to.equal(
                new BigNumber.from(ethers.utils.parseEther('0.25'))
            );
            expect(await ethers.provider.getBalance(acct3.address)).to.equal(
                new BigNumber.from(ethers.utils.parseEther('0.25'))
            );
            expect(await ethers.provider.getBalance(acct4.address)).to.equal(
                new BigNumber.from(ethers.utils.parseEther('0.25'))
            );
        });
    });
});
