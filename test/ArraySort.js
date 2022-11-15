const { expect, use } = require('chai');
const { ethers } = require('hardhat');
const { BigNumber } = ethers;
const helpers = require('@nomicfoundation/hardhat-network-helpers');

use(require('chai-as-promised'));

const TARGET_GAS_PRICE = 27_855;
const PRE_SORTED_ARRAY = [1, 2, 3, 4, 5];
const REVERSE_SORTED_ARRAY = [5, 4, 3, 2, 1];
const UNSORTED_ARRAY = [5, 1, 4, 3, 2];
const SORTED_ARRAY_STR = PRE_SORTED_ARRAY.toString();

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

describe('ArraySort', async function () {
    let instance;

    beforeEach(async () => {
        const ContractFactory = await ethers.getContractFactory(
            'OptimizedArraySort'
        );
        instance = await ContractFactory.deploy();

        await instance.deployed();
    });

    describe('Payable', function () {
        it('The functions MUST remain non-payable', async function () {
            let error;
            try {
                await instance.sortArray(PRE_SORTED_ARRAY,{
                    value: ethers.utils.parseEther('1.00'),
                });
            } catch (e) {
                error = e;
            }

            expect(error.reason).to.equal(
                'non-payable method cannot override value'
            );

            expect(error.code).to.equal('UNSUPPORTED_OPERATION');
            expect(instance.sortArray(PRE_SORTED_ARRAY)).to.not.be.rejected;
        });
    });

    describe('Gas target', function () {
        it('The functions MUST meet the expected gas efficiency', async function () {
            const gasEstimate = await instance.estimateGas.sortArray(REVERSE_SORTED_ARRAY);

            logGasUsage(gasEstimate);

            expect(gasEstimate).lte(TARGET_GAS_PRICE);
        });
    });

    describe('Business logic', function () {
        it('The functions MUST perform as expected', async function () {
            const sortedArray = await instance.sortArray(PRE_SORTED_ARRAY);
            expect(sortedArray.toString()).to.equal(SORTED_ARRAY_STR);
        });

        it('The functions MUST perform as expected', async function () {
            const sortedArray = await instance.sortArray(REVERSE_SORTED_ARRAY);
            expect(sortedArray.toString()).to.equal(SORTED_ARRAY_STR);
        });
        
        it('The functions MUST perform as expected', async function () {
            const sortedArray = await instance.sortArray(UNSORTED_ARRAY);
            expect(sortedArray.toString()).to.equal(SORTED_ARRAY_STR);
        });
    });
});
