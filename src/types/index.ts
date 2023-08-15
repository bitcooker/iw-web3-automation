export enum Actions {
    Buy = "Buy",
    Deposit = "Deposit",
    Liquidity = "Liquidity",
    Lend = "Lend",
    Borrow = "Borrow",
    Bridge = "Bridge",
    Nft = "Nft"
}

export enum Tokens {
    USDC = "USDC",
    ETH = "ETH",
    USDT = "USDT"
}

export type TransactionType = {
    id: string;
    action: Actions;
    amount: number;
    token: Tokens;
    platform: string;
    amount2: number;
    token2: Tokens;
}