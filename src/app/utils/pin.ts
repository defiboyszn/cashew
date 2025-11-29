import { createPublicClient, createWalletClient, http } from "viem"
import { monadTestnet } from "viem/chains";

const  rpcUrl = "https://testnet-rpc.monad.xyz/";


export const RedeemPubClient = createPublicClient({
    chain: monadTestnet,
    transport: http(rpcUrl)
})

export const RedeemWalletClient = createWalletClient({
    chain: monadTestnet,
    transport: http(rpcUrl)
})