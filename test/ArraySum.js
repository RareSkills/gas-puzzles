const { expect, use } = require('chai');
const { ethers } = require('hardhat');
const { BigNumber } = ethers;
const helpers = require('@nomicfoundation/hardhat-network-helpers');

use(require('chai-as-promised'));

const TARGET_GAS_PRICE = 23_396;
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

describe('ArraySum', async function () {
    let instance;

    beforeEach(async () => {
        const ContractFactory = await ethers.getContractFactory(
            'OptimizedArraySum'
        );
        instance = await ContractFactory.deploy();

        await instance.deployed();
    });

    describe('Payable', function () {
        it('The functions MUST remain non-payable', async function () {
            let error;
            try {
                await instance.getArraySum({
                    value: ethers.utils.parseEther('1.00'),
                });
            } catch (e) {
                error = e;
            }

            expect(error.reason).to.equal(
                'non-payable method cannot override value'
            );
            expect(error.code).to.equal('UNSUPPORTED_OPERATION');
            expect(instance.getArraySum()).to.not.be.rejected;
        });
    });

    describe('Gas target', function () {
        it('The functions MUST meet the expected gas efficiency', async function () {
            const gasEstimate = await instance.estimateGas.getArraySum();

            logGasUsage(gasEstimate);

            expect(gasEstimate).lte(TARGET_GAS_PRICE);
        });
    });

    describe('Business logic', function () {
        it('The functions MUST perform as expected', async function () {
            await instance.setArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(await instance.getArraySum()).to.equal(45);

            await instance.setArray([
                100, 200, 300, 400, 500, 600, 700, 800, 900,
            ]);
            expect(await instance.getArraySum()).to.equal(4500);
        });

        it('should not overflow', async function () {
            await instance.setArray([2n ** 256n - 1n, 4n]);
            await expect(instance.getArraySum()).to.be.reverted;
        });
    });
});
