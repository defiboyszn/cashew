import {
  Address,
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  parseUnits,
} from "viem";
import { getNetwork } from "@/app/config/networks";
import { $fetch, roundNumber } from "@/utils/constants";
import { privateKeyToAccount } from "viem/accounts";
import { quizAbi } from "./abi/quiz.abi";
import { getDomain } from "./dns";
import { mnemonicToAccount } from "@/utils/mnemonic";

export const sendPoints = async ({
  mnemonic,
  privateKey,
  network,
  _points,
}: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic, {
      path: `m/44'/994'/0'/0`,
      startingIndex: 0,
    });
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
    const username = await getDomain(account as unknown as string);
    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      address: "0x394d175f0FAe45df1566CE6d1FbE155E073A0346",
      abi: quizAbi,
      functionName: "sendPoints",
      account,
      args: [_points, `${username}.send`, account],
    });
    const hash = await client.writeContract(request);
    return {
      success: "points sent successfully",
      successData: hash,
    };
  } catch (e) {
    return {
      error: "error while trying to send transaction",
      errorData: e,
    };
  }
};

export const getUserData = async ({ mnemonic, privateKey, network }: any) => {
  const chain = getNetwork(network);
  let account;
  if (mnemonic) {
    account = mnemonicToAccount(mnemonic, {
      path: `m/44'/994'/0'/0`,
      startingIndex: 0,
    });
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
      address: "0x394d175f0FAe45df1566CE6d1FbE155E073A0346",
      abi: quizAbi,
      functionName: "points",
      account,
      // args: [account],
    });
    const hash = await client.writeContract(request);
    return {
      success: "Successfully fetched data",
      successData: hash,
    };
  } catch (e) {
    return {
      error: "error while trying to send transaction",
      errorData: e,
    };
  }
};
