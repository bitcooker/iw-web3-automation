import {ethers} from "ethers";
import * as zksync from "zksync-web3";

const ethProvider = new ethers.getDefaultProvider();
const provider = new zksync.Provider("https://zksync-era.blockpi.network/v1/rpc/public");
const {
    cEthAbi,
    comptrollerAbi,
    priceFeedAbi,
    cErcAbi,
    erc20Abi,
} = require('../constants/abi/reactorfusion/contracts.json');

export const depositBorrow = async (privateKey, amount1, amount2) => {

    // Your Ethereum wallet private key
    const wallet = new zksync.Wallet(privateKey, provider, ethProvider);
    const myWalletAddress = wallet.address;

    // Mainnet Contract for cETH (the collateral-supply process is different for cERC20 tokens)
    const rfEthAddress = '0xC5db68F30D21cBe0C9Eac7BE5eA83468d69297e6';
    const rfEth = new zksync.Contract(rfEthAddress, cEthAbi, wallet);

    // Mainnet Contract for the Compound Protocol's Comptroller
    const comptrollerAddress = '0xF3CaF0bE62a0E6Ff6569004af55F57A0B9440434';
    const comptroller = new zksync.Contract(comptrollerAddress, comptrollerAbi, wallet);

    // Mainnet address of underlying token (like DAI or USDC)
    const underlyingAddress = '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'; // Dai
    const underlying = new zksync.Contract(underlyingAddress, erc20Abi, wallet);
    const assetName = "USDC";

    // Mainnet address for a rfToken
    const rfTokenAddress = '0xC5db68F30D21cBe0C9Eac7BE5eA83468d69297e6'; // cDai
    const rfToken = new zksync.Contract(rfTokenAddress, cErcAbi, wallet);
    const underlyingDecimals = 6; // Number of decimals defined in this ERC20 token's contract

    // balances print
    let myWalletEthBalance = await provider.getBalance(myWalletAddress) / 1e18;
    console.log("My Wallet's  ETH Balance:", myWalletEthBalance);

    let myWalletCEthBalance = await rfEth.balanceOf(myWalletAddress) / 1e8;
    console.log("My Wallet's cETH Balance:", myWalletCEthBalance);

    let myWalletUnderlyingBalance = await underlying.callStatic.balanceOf(myWalletAddress) / Math.pow(10, underlyingDecimals);
    console.log(`My Wallet's  ${assetName} Balance:`, myWalletUnderlyingBalance);


    // const ethToSupplyAsCollateral = amount1;

    // console.log('\nSupplying ETH to the protocol as collateral (you will get cETH in return)...\n');
    // let mint = await rfEth.mint({
    //     value: (ethToSupplyAsCollateral * 1e18).toString()
    // });

    // console.log('\nEntering market (via Comptroller contract) for ETH (as collateral)...');
    // let markets = [rfEthAddress]; // This is the cToken contract(s) for your collateral
    // let enterMarkets = await comptroller.enterMarkets(markets);
    // await enterMarkets.wait(1);

    // console.log('Calculating your liquid assets in the protocol...');
    // let { 1: liquidity } = await comptroller.callStatic.getAccountLiquidity(myWalletAddress);
    // liquidity = liquidity / 1e18;

    // console.log('Fetching rfETH collateral factor...');
    // let { 1: collateralFactor } = await comptroller.callStatic.markets(rfEthAddress);
    // collateralFactor = (collateralFactor / 1e18) * 100; // Convert to percent


    // console.log(`Fetching borrow rate per block for ${assetName} borrowing...`);
    // let borrowRate = await rfToken.callStatic.borrowRatePerBlock();
    // borrowRate = borrowRate / Math.pow(10, underlyingDecimals);

    // console.log(`\nYou have ${liquidity} of LIQUID assets (worth of USD) pooled in the protocol.`);
    // console.log(`You can borrow up to ${collateralFactor}% of your TOTAL collateral supplied to the protocol as ${assetName}.`);
    // console.log(`NEVER borrow near the maximum amount because your account will be instantly liquidated.`);
    // console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetName} per block.\nThis is based on the current borrow rate.\n`);

    // const underlyingToBorrow = amount2;
    // console.log(`Now attempting to borrow ${underlyingToBorrow} ${assetName}...`);
    // const scaledUpBorrowAmount = (underlyingToBorrow * Math.pow(10, underlyingDecimals)).toString();
    // const trx = await rfToken.borrow(scaledUpBorrowAmount);
    // await trx.wait(1);
    // console.log('Borrow Transaction', trx);

    // // balances print
    // myWalletEthBalance = await provider.getBalance(myWalletAddress) / 1e18;
    // console.log("My Wallet's  ETH Balance:", myWalletEthBalance);

    // myWalletCEthBalance = await rfEth.balanceOf(myWalletAddress) / 1e8;
    // console.log("My Wallet's cETH Balance:", myWalletCEthBalance);

    // myWalletUnderlyingBalance = await underlying.callStatic.balanceOf(myWalletAddress) / Math.pow(10, underlyingDecimals);
    // console.log(`My Wallet's  ${assetName} Balance:`, myWalletUnderlyingBalance);


    // let balance = await rfToken.callStatic.borrowBalanceCurrent(myWalletAddress);
    // balance = balance / Math.pow(10, underlyingDecimals);
    // console.log(`Borrow balance is ${balance}`);
    
    // console.log(`Now repaying the borrow...`);
    // const underlyingToRepay = (underlyingToBorrow * Math.pow(10, underlyingDecimals)).toString();
    // const approve = await underlying.approve(rfTokenAddress, underlyingToRepay);
    // await approve.wait(1);

    // const repayBorrow = await rfToken.repayBorrow(underlyingToRepay);
    // const repayBorrowResult = await repayBorrow.wait(1);

    // const failure = repayBorrowResult.events.find(_ => _.event === 'Failure');
    // if (failure) {
    //   const errorCode = failure.args.error;
    //   console.error(`repayBorrow error, code ${errorCode}`);
    //   process.exit(1);
    // }

    // console.log(`\nBorrow repaid.\n`);
};

