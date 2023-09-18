import {ethers} from "ethers";
import * as zksync from "zksync-web3";
import {USDC, WETH} from "../constants"

import classicPoolFactoryAbi from '../constants/abi/SyncSwap/SyncSwapClassicPoolFactoryABI.json'
import classicPoolAbi from "../constants/abi/SyncSwap/SyncSwapClassicPool.json";
import routerAbi from "../constants/abi/SyncSwap/SyncSwapRouterABI.json";
import WETHAbi from "../constants/abi/WETHAbi.json"
import { sign } from "crypto";

const wETHAddress = WETH;
const usdcAddress = USDC;
const routerAddress = "0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295";
const classicPoolFactoryAddress = "0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb";


const zkSyncProvider = new zksync.Provider("https://zksync-era.blockpi.network/v1/rpc/public");
const ethProvider = ethers.getDefaultProvider();

export const syncUsdcSwap = async function (signer, amount) {
  // const signer = new zksync.Wallet(privateKey, zkSyncProvider, ethProvider)

  const _ethBalance = await signer.getBalance();
  const ethBalance = ethers.utils.formatEther(_ethBalance);
  
  let tokenInAddress = "";
  let amountIn = 0;

  tokenInAddress = wETHAddress;

  const classicPoolFactory = new zksync.Contract(
    classicPoolFactoryAddress,
    classicPoolFactoryAbi,
    signer
  );

  const poolAddress = await classicPoolFactory.getPool(wETHAddress, usdcAddress);
  console.log(poolAddress);

  // Checks whether the pool exists.
  if (poolAddress === ethers.constants.AddressZero) {
    console.log('pool not exists')
    return
  }

  // amountIn calculation
  const pool = new zksync.Contract(poolAddress, classicPoolAbi, signer);
  const _ratio = await pool.getAmountOut(wETHAddress, ethers.utils.parseEther("1"), usdcAddress);
  const ratio = ethers.utils.formatUnits(_ratio, 6);
  if (amount / ratio > ethBalance) {
    console.log('insufficient balance');
    return
  }
  amountIn = ethers.utils.parseEther((amount / ratio).toFixed(6));

  const withdrawMode = 1; // 1 or 2 to withdraw to user's wallet

  const address = await signer.getAddress();
  console.log(address);

  const swapData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "uint8"],
    [tokenInAddress, address, withdrawMode], // tokenIn, to, withdraw mode
  );

  const steps = [{
    pool: poolAddress,
    data: swapData,
    callback: ethers.constants.AddressZero,
    callbackData: '0x',
  }];


  const paths = [{
    steps: steps,
    tokenIn: ethers.constants.AddressZero,
    amountIn: amountIn,
  }];

  console.log('amount', amountIn)

  const router = new zksync.Contract(routerAddress, routerAbi, signer);

  const response = await router.swap(
    paths, // paths
    0, // amountOutMin // Note: ensures slippage here
    ethers.BigNumber.from(Math.floor(Date.now() / 1000)).add(1800), // deadline // 30 minutes
    {
      value: amountIn, // please uncomment this if your token in is ETH
    }
  );

  // let tx = await response.wait();
  // console.log(tx.transactionHash);
  // return tx.transactionHash;
}

export const addliquidity = async function (signer, amount2, amount1) {
  // const signer = new zksync.Wallet(privateKey, zkSyncProvider, ethProvider)

  const provider = new zksync.Web3Provider(window.ethereum);
  const zksyncSigner = zksync.L1Signer.from(provider.getSigner(), zkSyncProvider);   

  const address = await signer.getAddress();

  const wETHContract = new zksync.Contract(wETHAddress, WETHAbi, zksyncSigner);
  const _ethBalance = await wETHContract.balanceOf(address);
  const ethBalance = ethers.utils.formatEther(_ethBalance);
  console.log(ethBalance);
  // const wethDeposit = await wETHContract.deposit(
  //   {
  //     value: ethers.utils.parseEther(amount1.toString()),
  //     // gasLimit: 10000000
  //   }
  // );
  // await wethDeposit.wait();
  // console.log(wethDeposit.hash);
  const approveWETH = await wETHContract.approve(routerAddress, ethers.utils.parseEther(amount1.toString()));
  await approveWETH.wait();
    
  const usdcContract = new zksync.Contract(usdcAddress, zksync.utils.IERC20, signer);
  let approveTx = await usdcContract.approve(routerAddress, ethers.utils.parseUnits(amount2.toString(), 6));
  await approveTx.wait();

  const _usdcBalance = await usdcContract.balanceOf(address);
  const usdcBalance = ethers.utils.formatUnits(_usdcBalance, 6);
  console.log(usdcBalance);

  if (ethBalance < amount1) {
    console.log('insufficient ether');
    return
  }

  if (usdcBalance < amount2) {
    console.log('insufficient usdc');
    return
  }

  // The factory of the Classic Pool.
  const classicPoolFactory = new zksync.Contract(
    classicPoolFactoryAddress,
    classicPoolFactoryAbi,
    signer
  );

  // Gets the address of the ETH/USDC Classic Pool.
  // wETH is used internally by the pools.
  const poolAddress = await classicPoolFactory.getPool(wETHAddress, usdcAddress);

  // Checks whether the pool exists.
  if (poolAddress === ethers.constants.AddressZero) {
    console.log('pool not exists')
    return
  }

  const router = new zksync.Contract(routerAddress, routerAbi, signer);

  const data = ethers.utils.defaultAbiCoder.encode(['address'], [address]);

  const tokenInputs = [
    {
      token: wETHAddress,
      amount: ethers.utils.parseEther(amount1.toString()),
    },
    {
      token: usdcAddress,
      amount: ethers.utils.parseUnits(amount2.toString(), 6),
    }
  ];
  console.log(tokenInputs);
  try {
    const liquidity = await router.addLiquidity(
      poolAddress,
      tokenInputs,
      data,
      0,
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 14000000 }
    );
    // console.log(liquidity);
    const response = await liquidity.wait();
    // console.log(response.transactionHash);
    return response.transactionHash;
  }
  catch {
    return false;
  }
}