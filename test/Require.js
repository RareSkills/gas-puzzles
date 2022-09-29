const { expect, use } = require('chai');
const { ethers } = require('hardhat');

use(require('chai-as-promised'));

describe("Require", function () {
    let instance; 
    beforeEach(async function () {
        const ContractFactory = await ethers.getContractFactory("OptimizedRequire");
        instance = await ContractFactory.deploy();
        await instance.deployed();
    });
    describe("Use later", function () {
        it("Sample test", async function () {
            expect(true).to.equal(true);
        });
    });
});
