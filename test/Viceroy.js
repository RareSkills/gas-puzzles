const { expect, use } = require('chai');
const { ethers } = require('hardhat');
const { BigNumber } = ethers;
const helpers = require('@nomicfoundation/hardhat-network-helpers');

use(require('chai-as-promised'));

const TARGET_GAS_PRICE = 136_508;

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

describe('Viceroy', async function() {
    let attacker, oligarch, governance, communityWallet;

    beforeEach(async function () {
        const AttackerFactory = await ethers.getContractFactory('GovernanceAttacker');
        attacker = await AttackerFactory.deploy();
        await attacker.deployed();

        const OligarchFactory = await ethers.getContractFactory('OligarchNFT');
        oligarch = await OligarchFactory.deploy(attacker.address);
        await oligarch.deployed();

        const GovernanceFactory = await ethers.getContractFactory('GovernanceFactory');
        governance = await GovernanceFactory.deploy(oligarch.address);
        await governance.deployed();

        const WalletFactory = await ether.getContractFactory('CommunityWallet');
        communityWallet = await WalletFactory.deploy(governance.address);
        await communityWallet.deployed();
    })

    describe('Gas Target', async function () {
        it('can exploit', async function() {
            const exploitTx = await attacker.attack()
            const receipt = await exploitTx.wait();

            const balance = await ethers.provider.getBalance(communityWallet.address);
            expect(balance).to.equal(0);

            const gasEstimate = receipt.gasUsed;

            logGasUsage(gasEstimate);
            expect(gasEstimate).lte(TARGET_GAS_PRICE);
        })
    })
})