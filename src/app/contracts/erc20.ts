import { stakeAbi } from "@/app/contracts/abi/stake.abi";
import { ABI } from "@/app/contracts/abi/erc20-abi";
import {
  Address,
  HDAccount,
  PrivateKeyAccount,
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  parseEther,
  parseUnits,
} from "viem";
import { getNetwork } from "@/app/config/networks";
import { $fetch, roundNumber } from "@/utils/constants";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
// import { mnemonicToAccount } from "@/utils/mnemonic";
import { getShardAddressChildNode } from "@/utils/mnemonic";
export const getSymbol = async (contractAddress: string, network = "") => {
  const chain = getNetwork(network);
  const publicClient = createPublicClient({
    chain: getNetwork(network),
    transport: http(),
  });
  try {
      return (await publicClient.readContract({
        address: contractAddress as Address,
        abi: ABI,
        functionName: "symbol",
        args: [],
      })) as string;
  } catch (error) {
    console.error("Error reading symbol:", error);
    return "";
  }
};

export const getDecimal = async (contractAddress: string, network = "") => {
  const chain = getNetwork(network);
  const publicClient = createPublicClient({
    chain: getNetwork(network),
    transport: http(),
  });
  try {
      return (await publicClient.readContract({
        address: contractAddress as Address,
        abi: ABI,
        functionName: "decimals",
        args: [],
      })) as string;
  } catch (error) {
    console.error("Error reading symbol:", error);
    return "0";
  }
};

export const getTokenName = async (contractAddress: string, network = "") => {
  const chain = getNetwork(network);
  const publicClient = createPublicClient({
    chain: getNetwork(network),
    transport: http(),
  });
  try {
      return (await publicClient.readContract({
        address: contractAddress as Address,
        abi: ABI,
        functionName: "name",
        args: [],
      })) as string;
  } catch (error) {
    console.error("Error reading token name:", error);
    return "";
  }
};

export const getTokenBalance = async (
  contractAddress: string,
  walletAddress: string,
  network = ""
) => {
  const chain = getNetwork(network.toLowerCase());
  const publicClient = createPublicClient({
    chain: getNetwork(network),
    transport: http(),
  });
  try {
      const decimalsResponse = (await publicClient.readContract({
        address: contractAddress as Address,
        abi: ABI, // Replace with the ABI of your contract
        functionName: "decimals", // Use the appropriate function name for decimals retrieval
        args: [],
      })) as string;

      const tokenDecimals = parseInt(decimalsResponse);

      const balanceResponse = (await publicClient.readContract({
        address: contractAddress as Address,
        abi: ABI, // Replace with the ABI of your contract
        functionName: "balanceOf", // Use the appropriate function name for balance retrieval
        args: [walletAddress], // Pass the wallet address as an argument
      })) as string;

      const balanceNumber = parseFloat(balanceResponse);
      const adjustedBalance = balanceNumber / Math.pow(10, tokenDecimals);

      return roundNumber(parseFloat(adjustedBalance.toFixed(6))); // Round down to 6 decimal places
  } catch (error) {
    console.error("Error reading token balance:", error);
    return 0; // Return 0 if there's an error
  }
};

export const sendToken = async ({
  mnemonic,
  privateKey,
  address,
  accountTo,
  network,
  amount,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }

  const decimal = parseInt(await getDecimal(address, network));
  amount = parseUnits(amount.toString(), decimal);

  if (!account) {
    return {
      error: "account not connected",
    };
  }
  const client = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: getNetwork(network.toLowerCase()),
    transport: http(),
  });

  try {
      const { request } = await publicClient.simulateContract({
        address,
        abi: ABI,
        functionName: "transfer",
        args: [accountTo, amount],
        account,
      });

      const hash = await client.writeContract(request);

      return {
        success: "transaction was sent successfully",
        successData: hash,
      };
  } catch (e) {
    return {
      error: "error while trying to send transaction",
      errorData: e as any,
    };
  }
};

export const getContractGasEstimate = async ({
  mnemonic,
  privateKey,
  accountTo,
  network,
  amount,
}: any) => {
  const chain = getNetwork(network);
  let account;
  
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  
  if (!account) {
    return "0";
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  try {
    // Estimate gas units for the contract call
    const gasEstimate = await publicClient.estimateContractGas({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: ABI,
      functionName: "transfer",
      args: [accountTo, amount],
      account: account.address,
    });

    // Get current gas price
    const gasPrice = await publicClient.getGasPrice();

    // Calculate total gas cost
    const totalGasCost = gasEstimate * gasPrice;

    return formatEther(totalGasCost);
  } catch (e) {
    console.log('Contract gas estimation error:', e);
    return "0";
  }
};

export const getTransactionErc20 = async (
  address: string,
  network: string,
  contractAddress: string
) => {
  const network_ = getNetwork(network);
  if (network_?.id === 123420001114) {
    
    return null;
  } else {
    return [];
  }
};

export const getTokenCurrency = async (symbol: string, network: string) => {
  const network_ = getNetwork(network);
  if (network_?.id === 123420001114) {
    if (symbol === "usdt") {
      const req = await $fetch(
        `https://api.diadata.org/v1/assetQuotation/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7`
      );
      const res = await req?.Price;
      return Number(res);
    } else if (symbol === "usdc") {
      const req = await $fetch(
        `https://api.diadata.org/v1/assetQuotation/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
      );
      const res = await req?.Price;
      return Number(res);
    } else if (symbol === "btc") {
      const req = await $fetch(
        `https://api.diadata.org/v1/assetQuotation/Bitcoin/0x0000000000000000000000000000000000000000`
      );
      const res = await req?.Price;
      return Number(res);
    } else if (symbol === "wbtc") {
      const req = await $fetch(
        `https://api.diadata.org/v1/assetQuotation/Bitcoin/0x0000000000000000000000000000000000000000`
      );
      const res = await req?.Price;
      return Number(res);
    } else if (symbol === "eth") {
      const req = await $fetch(
        `https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000`
      );
      const res = await req?.Price;
      return Number(res);
    }
  } else {
    return Number(0);
  }
  return Number(0);
};
// v0 - 0xc8C9b3Ff7036D693033C4cd87c66d9C55A546770
export const stake = async ({
  amount,
  mnemonic,
  privateKey,
  address,
}: {
  amount: any;
  mnemonic: string;
  privateKey: `0x${string}`;
  address: `0x${string}`;
}) => {
  const chain = getNetwork("hela");
  let account: any;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }

  const decimal = parseInt(
    await getDecimal("0x0cbc330781fb83D7B29Dc4c885C8e5D1409dd1e9", "hela")
  );
  amount = parseUnits(amount.toString(), decimal);

  if (!account) {
    return {
      error: "account not connected",
    };
  }
  const client = createWalletClient({
    account,
    chain,
    transport: http(),
  });
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  try {
    const data = await publicClient.simulateContract({
      address: "0x0cbc330781fb83D7B29Dc4c885C8e5D1409dd1e9",
      abi: ABI,
      functionName: "approve",
      args: [address, parseEther(amount.toString())],
      account,
    });
    // @ts-ignore
    const $$data = await client.writeContract(data.request);
    // console.log($$data);

    const { request } = await publicClient.simulateContract({
      address: "0xE3484A14161022D6E56414e8Cba903c2a083d1Ef",
      abi: stakeAbi,
      functionName: "stake",
      value: parseEther(String(amount).toString()),
      account,
    });
    // @ts-ignore
    const hash = await client.writeContract(request);

    return {
      success: "stake was successfully",
      successData: hash,
    };
  } catch (e) {
    return {
      error: "error while trying to stake",
      errorData: e as any,
    };
  }
};

export const getStakers = async ({ address }: { address: string }) => {
  const chain = getNetwork("hela");

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  try {
    const data = (await publicClient.readContract({
      address: "0xE3484A14161022D6E56414e8Cba903c2a083d1Ef",
      abi: stakeAbi,
      args: [address],
      functionName: "stakers",
    })) as any;

    return {
      success: "stake details successfully gotten",
      data: data,
    };
  } catch (e) {
    return {
      error: "error while trying to get stakers",
      errorData: e as any,
    };
  }
};
