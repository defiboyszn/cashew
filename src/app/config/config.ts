import { bsc, bscTestnet, localhost, mainnet, sepolia,creatorTestnet, baseSepolia } from "viem/chains";
import { Hex } from "viem";
import { NetworkConfig } from "@/app/utils/types";
import { campTestnet } from "./networks";


// 0xb68643C2940d692b4106b50dDDD3009F7B706acF

export const getDNS = () => {
  let network: NetworkConfig, rpcUrl: string, contractAddress: Hex;
  let address: string;

  switch (process.env.NEXT_PUBLIC_DNS_NETWORK) {
    case "camp-testnet":
      rpcUrl = process.env.NEXT_PUBLIC_DNS_CAMP_TESTNET_RPC ?? "";
      address = process.env.NEXT_PUBLIC_DNS_CAMP_TESTNET_CONTRACT_ADDRESS
        ? process.env.NEXT_PUBLIC_DNS_CAMP_TESTNET_CONTRACT_ADDRESS
        : "";
      contractAddress = `0x${address.substring(2) ?? ""}`;
      network = campTestnet;
      break;
    case "local":
      rpcUrl = process.env.NEXT_PUBLIC_DNS_LOCAL_RPC ?? "";
      address = process.env.NEXT_PUBLIC_DNS_LOCAL_CONTRACT_ADDRESS
        ? process.env.NEXT_PUBLIC_DNS_LOCAL_CONTRACT_ADDRESS
        : "";
      contractAddress = `0x${address.substring(2) ?? ""}`;
      network = localhost;
      break;
    default:
      rpcUrl = process.env.NEXT_PUBLIC_DNS_LOCAL_RPC ?? "";
      address = process.env.NEXT_PUBLIC_DNS_LOCAL_CONTRACT_ADDRESS
        ? process.env.NEXT_PUBLIC_DNS_LOCAL_CONTRACT_ADDRESS
        : "";
      contractAddress = `0x${address.substring(2) ?? ""}`;
      network = localhost;
  }

  return { network, rpcUrl, contractAddress };
};
