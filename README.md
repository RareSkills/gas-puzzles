# [RareSkills](https://rareskills.io) Gas Puzzles

If you want to learn about gas optimization, take the [Udemy gas optimization course](https://www.udemy.com/course/advanced-solidity-understanding-and-optimizing-gas-costs/?referralCode=C4684D6872713525E349)!

## Puzzles that are ready for you
- [x] Distribute (hard)
- [x] Array Sum (easy)
- [x] Mint150 (hard)
- [x] ERC165 (low level programming required)
- [x] Array Sort (medium)
- [x] Security101 (easy/medium)
- [ ] Escrow
- [ ] EscrowV2
- [ ] Mint
- [ ] Presale
- [x] Vote (easy)
- [x] Require (easy)
- [ ] Staking

## Contributors

DO NOT COMMIT SOLUTIONS, BE SURE TO PUT ANSWERS IN `contracts/contracts_optimized` to ensure they fall into the `.gitignore`

## Players

Your goal is to optimize the contracts such that they reach the target efficiency.

Rules

-   you may not change the optimizer level
-   you may not change the solidity version
-   you may refactor functionality as long as you don't break the business logic
-   you may make reasonable assumptions about what variable sizes are necessary to get things done
-   you may remove unnecessary or redundant logic (some have been intentionally added)
-   because making functions `payable` is a controversial optimization, you do not need to make functions `payable` to reach the gas target unless the function needs to be payable to fulfill its business logic

## Testing

As mentioned above, optimized contracts should be created in their own sub-folder
to prevent committing them publicly.

The file structure should look similar to this:

```
- GasPuzzles
  |_
    contracts
    |_
      contracts_optimized
    | |_
    |   ArraySum.sol
    |   Distribute.sol
    |   ..
    |   ...
    |
    ArraySum.sol
    Distribute.sol
    ..
    ...
```

Within the contracts that are optimized be sure to follow the following naming
convention to ensure tests run smoothly:

```
contract OptimizedArraySum {

...

contract OptimizedDistribute {

...
```

```
npx hardhat test
npx hardhat test test/ArraySum
npx prettier --write *
```
