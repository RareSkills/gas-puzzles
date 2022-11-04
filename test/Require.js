const { expect, use } = require('chai');
const { ethers } = require('hardhat');
const { BigNumber } = ethers;
const helpers = require('@nomicfoundation/hardhat-network-helpers');

use(require('chai-as-promised'));

const TARGET_GAS_PRICE = 43_317;
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

describe('Require', async function () {
    let instance;

    beforeEach(async () => {
        const ContractFactory = await ethers.getContractFactory(
            'OptimizedRequire'
        );
        instance = await ContractFactory.deploy();

        await instance.deployed();
    });

    describe('Gas target', function () {
        it('The functions MUST meet the expected gas efficiency', async function () {
            await helpers.time.increase(10_000);
            const gasEstimate = await instance.estimateGas.purchaseToken({
                value: ethers.utils.parseEther('0.1'),
            });

            logGasUsage(gasEstimate);

            expect(gasEstimate).to.satisfy(function (val) {
                return val <= TARGET_GAS_PRICE;
            });
        });
    });

    describe('Business logic', function () {
        it('it should revert if msg.value is not 0.1 ether', async function () {
            await expect(
                instance.purchaseToken({
                    value: ethers.utils.parseEther('0.0999'),
                })
            ).to.be.reverted;
            await expect(
                instance.purchaseToken({
                    value: ethers.utils.parseEther('0.1001'),
                })
            ).to.be.reverted;

            await expect(instance.purchaseToken()).to.be.reverted;
        });

        it('should not allow purchases within the cooldown window', async function () {
            await instance.purchaseToken({
                value: ethers.utils.parseEther('0.1'),
            });
            await helpers.time.increase(58);
            await expect(
                instance.purchaseToken({
                    value: ethers.utils.parseEther('0.1'),
                })
            ).to.be.reverted;
        });

        it('should allow purchases outside the cooldown window', async function () {
            await instance.purchaseToken({
                value: ethers.utils.parseEther('0.1'),
            });
            await helpers.time.increase(60);
            await expect(
                instance.purchaseToken({
                    value: ethers.utils.parseEther('0.1'),
                })
            ).to.not.be.reverted;
        });
    });
});
