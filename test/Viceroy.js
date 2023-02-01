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
    let attackerWallet, attacker, oligarch, governance, communityWallet;

    before(async function () {
        const AttackerFactory = await ethers.getContractFactory('GovernanceAttacker');
        attacker = await AttackerFactory.connect(attackerWallet).deploy();
        await attacker.deployed();

        const OligarchFactory = await ethers.getContractFactory('OligarchNFT');
        oligarch = await OligarchFactory.deploy(attacker.address);
        await oligarch.deployed();

        const GovernanceFactory = await ethers.getContractFactory('GovernanceFactory');
        governance = await GovernanceFactory.deploy(oligarch.address);
        await governance.deployed();

        const WalletFactory = await ether.getContractFactory('CommunityWallet');
        communityWallet = await WalletFactory.deploy(governance.address, {value: BigNumber.from('10000000000000000000')});
        await communityWallet.deployed();
    })

    describe('Gas Target', async function () {
        it('can exploit', async function() {
            const exploitTx = await attacker.connect(attackerWallet).attack()
            const receipt = await exploitTx.wait();

            const gasEstimate = receipt.gasUsed;

            logGasUsage(gasEstimate);
            expect(gasEstimate).lte(TARGET_GAS_PRICE);
        })
    })

    after(async function() {
        const walletBalance = await ethers.provider.getBalance(communityWallet.address);
        expect(walletBalance).to.equal(0);

        const attackerBalance = await ethers.provider.getBalance(attacker.address)
        expect(attackerBalance).to.be.greaterThanOrEqual(BigNumber.from('10000000000000000000'))
    
        expect(await ethers.provider.getTransactionCount(attackerWallet.address)).to.equal(1, "must exploit in one transaction");
    })
})