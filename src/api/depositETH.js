import { sign } from "crypto";
import {ethers} from "ethers";
import * as zksync from "zksync-web3";

export const depositETH = async function (signer, amount) {
    // providers
    const zkSyncProvider = new zksync.Provider("https://zksync-era.blockpi.network/v1/rpc/public");
    const ethProvider = ethers.getDefaultProvider();

    // walletss
    // const ethWallet = new ethers.Wallet(privateKey, ethProvider);
    // const zkSyncWallet = new zksync.Wallet(privateKey, zkSyncProvider, ethProvider);

    const etherscanProvider = new ethers.providers.EtherscanProvider();
    const ethPrice = await etherscanProvider.getEtherPrice();
    console.log(ethPrice);

    const bridgeaddress = await zkSyncProvider.getDefaultBridgeAddresses();
    console.log(bridgeaddress);

    const address = await signer.getAddress();
    console.log(address)

    const provider = new zksync.Web3Provider(window.ethereum);
    const zksyncSigner = zksync.L1Signer.from(provider.getSigner(), zkSyncProvider);   

    const _etherBalance = await ethProvider.getBalance(address);;
    const etherBalance = ethers.utils.formatEther(_etherBalance);
    console.log("ether balance", etherBalance);
    
    const amountIn = amount / ethPrice;

    if (etherBalance < amountIn) {
        console.log('Insufficient funds');
        return
    }

    console.log("depositing...");
    try {
        const depositHandle = await zksyncSigner.deposit({
            token: zksync.utils.ETH_ADDRESS,
            amount: ethers.utils.parseEther(amountIn.toFixed(6)),
        });
        console.log(`Deposit transaction sent ${depositHandle.hash}`);
        console.log(`Waiting for deposit to be processed in L2...`);
        await depositHandle.wait();
        console.log(deposit);
    }
    catch (e) {
        console.log(e); 
        return false;
    }
}