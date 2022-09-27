const { expect, use } = require('chai');
const { ethers } = require('hardhat');

use(require('chai-as-promised'));

describe("ArraySum", function () {
    let instance; 
    beforeEach(async function () {
        const ContractFactory = await ethers.getContractFactory("OptimizedArraySum");
        instance = await ContractFactory.deploy();
        await instance.deployed();
    });

    describe("Payable", function () {
        it("The 'getArraySum' function MUST remain non-payable.", 
            async function () {
                let error;
                try {
                    await instance.getArraySum({
                        value: ethers.utils.parseEther("1.00")
                    });
                } catch (e) {
                    error = e;
                }

                expect(error.reason).to.equal('non-payable method cannot override value');
                expect(error.code).to.equal('UNSUPPORTED_OPERATION');
                expect(instance.getArraySum()).to.not.be.rejected;
        });
    });
});
