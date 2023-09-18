import {ethers} from "ethers";
import * as zksync from "zksync-web3";
import {USDC, WETH} from "../constants"
import routerAbi  from "../constants/abi//mav/Router.json";
const routerAddress = "0x39E098A153Ad69834a9Dac32f0FCa92066aD03f4";

export const mavUsdcSwap = async function(signer, amount) {
    const zkSyncProvider = new zksync.Provider("https://zksync-era.blockpi.network/v1/rpc/public");
    const ethProvider = ethers.getDefaultProvider();

    // const signer = new zksync.Wallet(privateKey, zkSyncProvider, ethProvider);

    const address = await signer.getAddress();

    const router = new ethers.Contract(
        routerAddress,
        routerAbi,
        signer
    );
    
    const etherscanProvider = new ethers.providers.EtherscanProvider();
    const ethPrice = await etherscanProvider.getEtherPrice();
    // console.log(ethPrice);

    amount = amount / ethPrice;
    let amountIn = ethers.utils.parseEther(
        amount.toFixed(6)
    );
    const iface = new ethers.utils.Interface(routerAbi);
    let paramsv2 = {
        tokenIn: WETH,
        tokenOut: USDC,
        pool: '0x41c8cf74c27554a8972d3bf3d2bd4a14d8b604ab',
        recipient: address,
        deadline: 1e13,
        amountIn: amountIn,
        amountOutMinimum: 0,
        sqrtPriceLimitD18: 0,
    };
    const encodedData = iface.encodeFunctionData("exactInputSingle", [paramsv2]);
    let data = [encodedData];
    // let amount2 = ethers.utils.parseEther('0');
    const overrides = {
        value: amountIn,
        gasLimit: 2303039,
    };
    try {
        router.multicall(data, overrides).then((res) => {
            const result = res.wait();
            return (result.transactionHash);
            // console.log(result.transactionHash);
        });
    } catch (err) {
        return false;
        // console.log(err);
    }
};
