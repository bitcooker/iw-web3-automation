import { Actions, Tokens, TransactionType } from '@/types';
import { ZKSYNC_ABI } from './abis';

export const strategy1: TransactionType[] = [
    {
        id: '1',
        action: Actions.Bridge,
        amount: 100,
        token: Tokens.ETH,
        platform: 'http://bridge.zksync.io/', // todo remove
        amount2: 1, // todo remove
        token2: Tokens.ETH
    },
    {
        id: '2',
        action: Actions.Buy,
        amount: 5,
        token: Tokens.USDC,
        platform: 'http://syncswap.xyz/',
        amount2: 1,
        token2: Tokens.ETH
    },
    {
        id: '3',
        action: Actions.Buy,
        amount: 5,
        token: Tokens.USDC,
        platform: 'http://mute.io/',
        amount2: 1,
        token2: Tokens.ETH
    },
    {
        id: '4',
        action: Actions.Buy,
        amount: 5,
        token: Tokens.USDC,
        platform: 'https://app.mav.xyz/pools?chain=324',
        amount2: 1,
        token2: Tokens.ETH
    },
    {
        id: '5',
        action: Actions.Liquidity,
        amount: 15,
        token: Tokens.USDC,
        platform: 'http://syncswap.xyz/',
        amount2: 15,
        token2: Tokens.ETH
    },
    {
        id: '6',
        action: Actions.Lend,
        amount: 20,
        token: Tokens.ETH,
        platform: 'https://app.reactorfusion.xyz/',
        amount2: 1,
        token2: Tokens.ETH
    },
    {
        id: '7',
        action: Actions.Borrow,
        amount: 3,
        token: Tokens.USDT,
        platform: 'https://app.reactorfusion.xyz/',
        amount2: 1,
        token2: Tokens.ETH
    },
]