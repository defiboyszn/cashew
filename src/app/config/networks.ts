import { Chain, defineChain } from "viem";

export const campTestnet = defineChain({
  id: 123420001114,
  name: 'Camp Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Camp',
    symbol: 'CAMP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-campnetwork.xyz/'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://basecamp.cloud.blockscout.com/' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  testnet: true,
})



export const getNetwork = (network: string) => {
  let selectedNet;
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    switch (network.toLowerCase()) {
      case "camp":
        selectedNet = campTestnet;
        break;

      default:
        selectedNet = campTestnet;
        break;
    }
  } else {
    switch (network.toLowerCase()) {
      case "camp":
        selectedNet = campTestnet;
        break;

      default:
        selectedNet = campTestnet;
        break;
    }
    return selectedNet;
  }
};
