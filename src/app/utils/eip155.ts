export const EIP155_TEST_CHAINS = {
    'eip155:5001': {
      chainId: 5001,
      name: 'Mantle Testnet',
      logo: '/src/assets/logos/mnt.svg',
      rgb: '99, 125, 234',
      rpc: 'https://rpc.testnet.mantle.xyz'
    },
    'eip155:666888': {
      chainId: 666888,
      name: 'Hela Chain',
      logo: '/src/assets/logos/hlusd.svg',
      rgb: '232, 65, 66',
      rpc: 'https://testnet-rpc.helachain.com/'
    },
    'eip155:41': {
      chainId: 41,
      name: 'telosTestnet',
      logo: '/src/assets/logos/tlos.svg',
      rgb: '235, 0, 25',
      rpc: 'https://testnet.telos.net/evm'
    },
    'eip155:97': {
      chainId: 97,
      name: 'zkSync Era Testnet',
      logo: '/src/assets/logos/bnb.svg',
      rgb: '242, 242, 242',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545'
    },
    'eip155:54321': {
      chainId: 54321,
      name: 'Toronet',
      logo: '/src/assets/logos/torog.svg',
      rgb: '242, 242, 242',
      rpc: 'http://testnet.toronet.org/rpc/'
    },
    'eip155:245022926': {
      chainId: 245022926,
      name: 'Neon',
      logo: '/src/assets/logos/neon.svg',
      rgb: '242, 242, 242',
      rpc: 'https://devnet.neonevm.org'
    },
  }

/**
 * Methods
 */
export const EIP155_SIGNING_METHODS = {
    PERSONAL_SIGN: 'personal_sign',
    ETH_SIGN: 'eth_sign',
    ETH_SIGN_TRANSACTION: 'eth_signTransaction',
    ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
    ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
    ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
    ETH_SEND_TRANSACTION: 'eth_sendTransaction'
  }