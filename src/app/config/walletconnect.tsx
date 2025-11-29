import { Core } from '@walletconnect/core'
import { Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'


const core = new Core({
    projectId: '2173efe0a1d8acc38836e4bcc48aa5cb'
})

const metadata = {
    name: 'Cashew by Sendtokens',
    description: 'Cashew by Sendtokens is a self custody wallet with super powers.',
    url: 'https://my.Cashew by Sendtokens.xyz', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const web3wallet = await Web3Wallet.init({
    core, // <- pass the shared 'core' instance
    metadata
})


async function onSessionProposal({ id, params }: Web3WalletTypes.SessionProposal){
  try{
    // ------- namespaces builder util ------------ //
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          chains: ['eip155:1', 'eip155:137'],
          methods: ['eth_sendTransaction', 'personal_sign'],
          events: ['accountsChanged', 'chainChanged'],
          accounts: [
            'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
            'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'
          ]
        }
      }
    })
    // ------- end namespaces builder util ------------ //

    const session = await web3wallet.approveSession({
      id,
      namespaces: approvedNamespaces
    })
  }catch(error){
    // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
    await web3wallet.rejectSession({
      id: 0,
      reason: getSdkError("USER_REJECTED")
    })
  }
}


web3wallet.on('session_proposal', onSessionProposal)
const {topic, uri} = await core.pairing.create()

await web3wallet.core.pairing.pair({ uri });