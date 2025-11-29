import { Core } from '@walletconnect/core'
import { ICore } from '@walletconnect/types'
import { Web3Wallet, IWeb3Wallet } from '@walletconnect/web3wallet'
export let web3wallet: IWeb3Wallet
export let core: ICore = new Core({
    logger: 'debug',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    // relayUrl: relayerRegionURL ?? process.env.NEXT_PUBLIC_RELAY_URL
})
export async function createWeb3Wallet(relayerRegionURL: string) {

    web3wallet = await Web3Wallet.init({
        core,
        metadata: {
            name: 'Cashew by Sendtokens',
            description: 'Client for Cashew by Sendtokens connect wallet',
            url: 'www.Cashew by Sendtokens.xyz',
            icons: ['https://avatars.githubusercontent.com/u/132999472']
        }
    })
}

export async function pair(params: { uri: string }) {
    return await core.pairing.pair({ uri: params.uri })
}