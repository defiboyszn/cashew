import {
  createPublicClient,
  http,
  formatEther,
  Address,
  parseEther,
  createWalletClient,
  fromHex,
  PrivateKeyAccount,
  decodeEventLog,
} from "viem";
// import { publicClient as RedeemPubClient, walletClient as RedeemWalletClient } from "@/app/utils/client";
import { getNetwork } from "@/app/config/networks";
import { $fetch, roundNumber } from "@/utils/constants";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import axios from "axios";
import { getNativePrice } from "./price";
import { cryptopinAbi } from "./abi/cryptopin.abi";
import { getShardAddressChildNode } from "@/utils/mnemonic";
import { providers, quais, utils, Wallet } from "quais";
import { pollFor } from "quais-polling";
import { NativeStakeAbi } from "./abi/native_staking.abi";
import { getPrivateKey } from "@/app/utils/keys";
import { remove0xPrefix } from "@/app/utils/functions";
import { RedeemPubClient, RedeemWalletClient } from "../utils/pin";


export const getNativeBalance = async (walletAddress: string, network = "") => {
  const publicClient = createPublicClient({
    chain: getNetwork(network),
    transport: http(),
  });

  try {
    const balance = await publicClient.getBalance({
      address: walletAddress as Address,
    });
    return roundNumber(formatEther(balance) as any);
  } catch (error) {
    return 0; // Return 0 if there's an error
  }
};

export const getGasEstimate = async ({
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
  const publicClient = createPublicClient({
    chain,
    transport: http(),
    // @ts-ignore
    account,
  });
  if (!account) {
    return "0";
  }

  try {
    // Estimate gas units needed for the transaction
    const gasEstimate = await publicClient.estimateGas({
      account: account.address,
      to: accountTo,
      value: parseEther(amount.toString()),
    });

    // Get current gas price
    const gasPrice = await publicClient.getGasPrice();

    // Calculate total gas cost (gasEstimate * gasPrice)
    const totalGasCost = gasEstimate * gasPrice;

    return formatEther(totalGasCost);
  } catch (error) {
    console.log(error);

    return "0"; // Return 0 if there's an error
  }
};

export const sendNative = async ({
  mnemonic,
  privateKey,
  accountTo,
  network,
  amount,
}: any) => {
  const chain = getNetwork(network);
  let account: PrivateKeyAccount;
  if (mnemonic) {
    // @ts-ignore
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  // @ts-ignore
  if (!account) {
    return { error: "Account not connected" };
  }
  const client = createWalletClient({
    account,
    chain,
    transport: http(),
  });
  try {

    const hash = await client.sendTransaction({
      account,
      to: accountTo,
      value: parseEther(amount.toString()),
    });

    return {
      success: "transaction was sent successfully",
      successData: hash,
    };
  } catch (e) {
    return {
      error: "error while trying to send transaction",
      errorData: e,
    };
  }
};

// telos v2 cryptopin - 0x9F6c53A8a6a0089a0c01dF118f9fAa37D4D95048
// lightlink v2 // - 0xDE46E2d8E5F49Cc620A9f22d970af7382Dca541E

// v1 telos -0x66395f83CF4f39e467F1b26F9c2598a373Dac474
// v1 lightlink - 0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17
// v1 hela - 0x684f171A2E51F04bD387D64b380de5EE4c0a176c
// v1 latest -0xb68643C2940d692b4106b50dDDD3009F7B706acF

// v1-beta
// hela: "0xE1367e0e853e5FE52ea61f695579C3Ba110A9bf5",
//   telos: "0x74aA7C4A448dB36f2310E9007F5BB19cB02983DB",
//   lightlink: "0x66395f83CF4f39e467F1b26F9c2598a373Dac474",
//   arthera: "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17",
// camp: "0xa93Ab081aBd2102fff40d48e2FF05F4cE1E5f9A6"
// zap: "0xDE46E2d8E5F49Cc620A9f22d970af7382Dca541E"
// zircuit: "0xb68643C2940d692b4106b50dDDD3009F7B706acF"

export const cryptopin_network = {
  // hela: "0x8F6ce57BD187035a983C2b33201c2F2bFAD8ef92",
  // // telos: "0xa3c1fbA546A26C3Cc14F77Dc23c7858E43258B18",
  // lightlink: "0xEEd21DA670abC684D6A0aB91888a50742242a2D6",
  // arthera: "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17",
  // latest: "0x9F6c53A8a6a0089a0c01dF118f9fAa37D4D95048",
  // injective: "0xb68643C2940d692b4106b50dDDD3009F7B706acF",
  // viction: "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17",
  // base: "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17",
  // photon: "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17",
  // zap: "0xb68643C2940d692b4106b50dDDD3009F7B706acF",
  // zircuit: "0xa93Ab081aBd2102fff40d48e2FF05F4cE1E5f9A6",
  // camp: "0x66395f83CF4f39e467F1b26F9c2598a373Dac474",
  // morph: "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17",
  // taiko: "0xDE46E2d8E5F49Cc620A9f22d970af7382Dca541E",
  // "re.al": "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17"
  // shardeum: "0x66395f83CF4f39e467F1b26F9c2598a373Dac474",
  // creator: "0x62685d23980B83b1529295789cA7537943c88b1a",
  monad: "0x5045121a99BB6Fbf1D3e81bA6BEE8f34A9274d17"
};
export const createCryptopin = async ({
  mnemonic,
  privateKey,
  network,
  amount,
  _pin,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  if (!account) {
    return { error: "Account not connected" };
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
    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      address: cryptopin_network[network?.toLowerCase()],
      abi: cryptopinAbi,
      functionName: "deposit",
      account,
      args: [_pin],
      value: parseEther(amount.toString()),
    });
    const hash = await client.writeContract(request);
    return {
      success: "cryptopin was created successfully",
      successData: hash,
    };
  } catch (e) {
    return {
      error: "error while trying to send transaction",
      errorData: e,
    };
  }
};
export const redeemCryptopin = async ({
  mnemonic,
  privateKey,
  network,
  _pin,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  if (!account) {
    return { error: "Account not connected" };
  }

  const RedeemPK = remove0xPrefix(getPrivateKey());
  const redeemAccount = privateKeyToAccount(`0x${RedeemPK}`);


  // const client = createWalletClient({
  //   account,
  //   chain,
  //   transport: http(),
  // });
  // const publicClient = createPublicClient({
  //   chain,
  //   transport: http(),
  // });
  let topics;
  let logs;
  try {
    const { request } = await RedeemPubClient.simulateContract({
      // @ts-ignore
      address: cryptopin_network[network?.toLowerCase()],
      abi: cryptopinAbi,
      functionName: "redeem",
      account: redeemAccount,
      args: [_pin, account.address],
    });
    const hash = await RedeemWalletClient.writeContract(request);
    // if (network?.toLowerCase() !== "telos") {
    logs = await RedeemPubClient.waitForTransactionReceipt({ hash });
    topics = decodeEventLog({
      abi: cryptopinAbi,
      data: logs.logs[0].data,
      topics: logs.logs[0].topics,
    });
    // }
    // .getContractEvents({
    //   // @ts-ignore
    //   address: cryptopin_network[network?.toLowerCase()],
    //   abi: cryptopinAbi,
    //   eventName: "Redemption",
    // });
    return {
      success: "cryptopin was redeemed successfully",
      successData: {
        hash,
        logs: logs,
        amount:
          // network?.toLowerCase() === "telos"
          // @ts-ignore
          formatEther(topics.args?.amount),
        // : 0,
      },
    };
  } catch (e) {
    return {
      error: "error while trying to redeem cryptopin",
      errorData: e,
    };
  }
};

export const getEstGas = async ({ mnemonic, privateKey, network }: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  if (!account) {
    return { error: "Account not connected" };
  }
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  try {
    const gas = await publicClient.estimateContractGas({
      // @ts-ignore
      address: cryptopin_network[network?.toLowerCase()],
      abi: cryptopinAbi,
      functionName: "deposit",
      account,
    });

    return {
      success: "fetched successfully",
      successData: gas,
    };
  } catch (e) {
    return {
      error: "error while trying to get details",
      errorData: e,
    };
  }
};

export const getEventFromRedeemedCryptopin = async ({
  mnemonic,
  privateKey,
  network,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  if (!account) {
    return { error: "Account not connected" };
  }
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  try {
    const logs = await publicClient.getContractEvents({
      // @ts-ignore
      address: cryptopin_network[network?.toLowerCase()],
      abi: cryptopinAbi,
      eventName: "Redemption",
    });
    return {
      success: "cryptopin redeemed details fetched successfully",
      successData: logs,
    };
  } catch (e) {
    return {
      error: "error while trying to get reddemption details",
      errorData: e,
    };
  }
};

export const getUserCryptopin = async ({
  mnemonic,
  privateKey,
  network,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  if (!account) {
    return { error: "Account not connected" };
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
    const data = await publicClient.readContract({
      // @ts-ignore
      address: cryptopin_network[network?.toLowerCase()],
      abi: cryptopinAbi,
      functionName: "getUserPinDetails",
      account,
    });
    return {
      success: "cryptopin successfully listed",
      successData: data,
    };
  } catch (e) {
    return {
      error: "error while trying to list cryptopin",
      errorData: e,
    };
  }
};

export const getPinDetailsForUser = async ({
  mnemonic,
  privateKey,
  network,
  _pin,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  if (!account) {
    return { error: "Account not connected" };
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
    const data = await publicClient.readContract({
      // @ts-ignore
      address: cryptopin_network[network?.toLowerCase()],
      abi: cryptopinAbi,
      functionName: "getUserPinDetails",
      args: [_pin],
      account,
    });
    return {
      success: "cryptopin details successfully listed",
      successData: data,
    };
  } catch (e) {
    return {
      error: "error while trying to get cryptopin",
      errorData: e,
    };
  }
};

export const getUserCryptopinLength = async ({
  mnemonic,
  privateKey,
  network,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic);
  } else if (privateKey) {
    account = privateKeyToAccount(privateKey);
  }
  if (!account) {
    return { error: "Account not connected" };
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
    const data = await publicClient.readContract({
      // @ts-ignore
      address: cryptopin_network[network?.toLowerCase()],
      abi: cryptopinAbi,
      functionName: "getUserTotalPins",
      account,
    });
    return {
      success: "cryptopin successfully listed",
      successData: data,
    };
  } catch (e) {
    return {
      error: "error while trying to list cryptopin",
      errorData: e,
    };
  }
};

export const getTxnRedeemed = async (res: any[], network: string) => {
  const chain = getNetwork(network);
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  if (network.toLowerCase() !== "telos") {
    const redeemedTransactions = [];
    for (const data of res) {
      let logs = await publicClient.waitForTransactionReceipt({
        hash: data?.hash,
      });

      if (
        data?.to?.toLowerCase() ===
        // @ts-ignore
        cryptopin_network[network?.toLowerCase()]?.toLowerCase() &&
        logs.logs.length > 0
      ) {
        let $data = decodeEventLog({
          abi: cryptopinAbi,
          data: logs.logs[0].data,
          topics: logs.logs[0].topics,
        });

        const newData = {
          ...data,
          txn_type: $data.eventName,
          from: logs.to,
          to: logs.from,
          // @ts-ignore
          value: $data.args?.amount,
        };
        redeemedTransactions.push(newData);
      } else {
        redeemedTransactions.push(data);
      }
    }
    return redeemedTransactions;
  } else {
    return res;
  }
};

export const getTxn = async (pubKey: any, network: any, callback: any) => {
  getTransactionNative(pubKey, network?.name).then((data) => {
    getTxnRedeemed(data as any, network?.name).then((_data) => {
      callback(_data);
    });
  });
};

export const reformTxn = (data: any) => {
  return {
    ...data,
    from: data?.from?.hash,
    to: data?.to?.hash,
    value: formatEther(BigInt(data?.total?.value))
  }
}

export const getTransactionNative = async (
  address: string,
  network: string
) => {
  const network_ = getNetwork(network);
  if (network_?.id === 123420001114) {
    
    // @ts-ignore
    return {}
  } else {
    return [];
  }
};

export const getNativeCurrency = async (network: string) => {
  const network_ = getNetwork(network);
  if (network_?.id === 123420001114) {
   
    const res = 0;
    return Number(res);
  } else {
    return Number(0);
  }
};

// v1 - 0xEca1c3a9E5436aFB5FFB653Ee629B707f43C728C

const staking_contract = {
  hela: "",
};

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
    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      address: "0x846C6A386b57740D7De6E856EEEA2984EFDd3fE9",
      abi: NativeStakeAbi,
      functionName: "stake",
      args: [parseEther(String(amount).toString())],
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

export const unstake = async ({
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
    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      address: "0x846C6A386b57740D7De6E856EEEA2984EFDd3fE9",
      abi: NativeStakeAbi,
      functionName: "unstake",
      args: [parseEther(String(amount).toString())],
      account,
    });
    // @ts-ignore
    const hash = await client.writeContract(request);

    return {
      success: "unstaked was successfully",
      successData: hash,
    };
  } catch (e) {
    return {
      error: "error while trying to unstake",
      errorData: e as any,
    };
  }
};

export const claimReward = async ({
  mnemonic,
  privateKey,
  address,
}: {
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
    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      address: "0x846C6A386b57740D7De6E856EEEA2984EFDd3fE9",
      abi: NativeStakeAbi,
      functionName: "claimReward",
      account,
    });
    // @ts-ignore
    const hash = await client.writeContract(request);

    return {
      success: "reward claimed was successfully",
      successData: hash,
    };
  } catch (e) {
    return {
      error: "error while trying to claim reward",
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
      // @ts-ignore
      address: "0x846C6A386b57740D7De6E856EEEA2984EFDd3fE9",
      abi: NativeStakeAbi,
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
