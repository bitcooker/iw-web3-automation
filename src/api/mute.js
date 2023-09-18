import {ethers} from "ethers";
import * as zksync from "zksync-web3";

import {USDC, WETH} from "../constants"

import routerAbi  from "../constants/abi/mute/Router.json";
import factoryAbi from "../constants/abi/mute/Factory.json";

export const muteUsdcSwap = async function (wallet, amount) {
    const addresses = {
        WETH: WETH,
        USDC: USDC,
        router: '0x8B791913eB07C32779a16750e3868aA8495F5964',
        factory: '0x40be1cba6c5b47cdf9da7f963b6f761f4c60627d'
    }

    const address = await wallet.getAddress();

    const zkSyncProvider = new zksync.Provider("https://zksync-era.blockpi.network/v1/rpc/public");
    const ethProvider = ethers.getDefaultProvider();

    const mygasPrice = ethers.utils.parseUnits('5', 'gwei');

    // const wallet = new zksync.Wallet(privateKey, zkSyncProvider, ethProvider);

    const router = new ethers.Contract(
        addresses.router,
        routerAbi,
        wallet
    );

    const factory = new ethers.Contract(
        addresses.factory,
        factoryAbi,
        wallet
    );

    // console.log("Test TX");

    let tokenIn = addresses.WETH, tokenOut = addresses.USDC;

    const pair = await factory.getPair(tokenIn, tokenOut, true);
    // console.log(pair)

    const etherscanProvider = new ethers.providers.EtherscanProvider();
    const ethPrice = await etherscanProvider.getEtherPrice();
    // console.log(ethPrice);

    const amountIn = ethers.utils.parseUnits((amount / ethPrice).toFixed(6), 'ether');
    const amountOutMin = 0;

    // console.log("Starting swap...");

    try {
        const tx = await router.swapExactETHForTokens(
            amountOutMin,
            [tokenIn, tokenOut],
            address,
            Math.floor(Date.now() / 1000) + 60 * 30, // 20 minutes from the current Unix time
            [true, true],
            {
                value: amountIn,
                // gasPrice: mygasPrice,
                gasLimit: 500000
            }
        );
        // console.log("Swap done!");
        const receipt = await tx.wait();
        // console.log("Transaction receipt");
        // console.log(receipt.transactionHash);
        return receipt.transactionHash;
    }
    catch {
        return false;
    }
}