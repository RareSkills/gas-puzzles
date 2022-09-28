const { expect, use } = require('chai');
const { ethers } = require('hardhat');

use(require('chai-as-promised'));

describe("Escrow", function () {
    let instance; 
    beforeEach(async function () {
        const [owner, admin, buyer, seller, arbiter] = await ethers.getSigners();

        const ContractFactory = await ethers.getContractFactory("OptimizedEscrow");
        instance = await ContractFactory.deploy(
            buyer.address,
            seller.address,
            arbiter.address,
            1000);
        await instance.deployed();
    });

    describe("Payable", function () {
        it("The 'sellerWithdraw' function MUST remain non-payable.", 
            async function () {
                let error;
                try {
                    await instance.sellerWithdraw({
                        value: ethers.utils.parseEther("1.00")
                    });
                } catch (e) {
                    error = e;
                }

                expect(error.reason).to.equal('non-payable method cannot override value');
                expect(error.code).to.equal('UNSUPPORTED_OPERATION');
                expect(instance.sellerWithdraw()).to.not.be.rejected;
        });
    });
});
