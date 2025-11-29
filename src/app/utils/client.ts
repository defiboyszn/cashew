import {createPublicClient, createWalletClient, http} from 'viem'
import {getDNS} from "@/app/config/config";

const {network, rpcUrl} = getDNS();
export const publicClient = createPublicClient({
    chain: network,
    transport: http(rpcUrl)
})

export const walletClient = createWalletClient({
    chain: network,
    transport: http(rpcUrl)
})
