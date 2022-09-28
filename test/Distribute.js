const { expect, use } = require('chai');
const { ethers } = require('hardhat');

use(require('chai-as-promised'));

describe("Distribute", function () {
    let instance; 
    beforeEach(async function () {
        const [owner, admin, acct1, acct2, acct3, acct4] = await ethers.getSigners();

        const ContractFactory = await ethers.getContractFactory("OptimizedDistribute");
        instance = await ContractFactory.deploy([
            acct1.address,
            acct2.address,
            acct3.address,
            acct4.address]);
        await instance.deployed();
    });

    describe("Payable", function () {
        it("The 'distribute' function MUST remain non-payable.", 
            async function () {
                let error;
                try {
                    await instance.distribute({
                        value: ethers.utils.parseEther("1.00")
                    });
                } catch (e) {
                    error = e;
                }

                expect(error.reason).to.equal('non-payable method cannot override value');
                expect(error.code).to.equal('UNSUPPORTED_OPERATION');
                expect(instance.distribute()).to.not.be.rejected;
        });
    });
});
