import React, { ReactNode, useEffect, useState } from "react";
import { Back } from "../global/back.global";
import { motion } from "framer-motion";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import {
  getGasEstimate,
  getNativeBalance,
  sendNative,
} from "@/app/contracts/native";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import {
  getContractGasEstimate,
  getTokenBalance,
  sendToken,
} from "@/app/contracts/erc20";
import sending from "@/assets/icons/sending.svg";
import sent from "@/assets/icons/confetti.svg";
import { useRouter } from "next/router";
import {
  decryptWithPassphrase,
  isValidWalletAddress,
} from "@/app/utils/functions";
import Html5QrcodePlugin from "@/components/global/qrscanner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { OneIDSearch, ZNSSearch, roundNumber } from "@/utils/constants";
import { formatEther } from "viem";
import Address from "@/components/global/address.global";
import { routes } from "@/app/utils/routes";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import { getDomainAddress } from "@/app/contracts/dns";
import receiptBg from "@/assets/img/receipt-bg.png";
import { ZeroAddress } from "ethers";
import Icon from "../global/icons";

interface TokenSendPageProps {
  symbol: string;
  address: string;
}

export const SendToken: React.FC<TokenSendPageProps> = ({
  symbol,
  address: tokenAddress,
}) => {
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [password] = useBrowserSession<any>("authPassword", "");
  const [walletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const [privateKey] = useLocalStorage<string>("privateKey", "");
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState(0);
  const [qrModal, setQrModal] = useState(false);
  const [data, setData] = useState<any>({});
  const [pubKey] = useLocalStorage("pubKey", "");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSending, setisSending] = useState<boolean>(false);
  const router = useRouter();
  const [decWM, setDecWM] = useState<string>("");
  const [decPK, setDecPK] = useState<string>("");
  const [sendError, setSendError] = useState<string>("");
  const [toAddress, setToAddress] = useState("");

  useEffect(() => {
    const updateBalance = async () => {
      const bal =
        tokenAddress === "native"
          ? await getNativeBalance(pubKey, network?.name)
          : await getTokenBalance(tokenAddress as string, pubKey, network?.name);
      setBalance(bal as number);
    };

    updateBalance().then();
  }, [network]);

  useEffect(() => {
    const update = async () => {
      if (data?.address) {
        if (isValidWalletAddress(data.address)) {
          setToAddress(data.address);
        } else {
          setToAddress(await getAddress(data.address));
        }
      }
    };
    update().then();
  }, [data?.address]);

  const onNewScanResult = (res: string) => {
    setValue("address", res);
  };

  const goToFinalPage = async (data: any) => {
    setLoading(true);
    setSendError("");
    setData({ ...data, networkFee: 0 });
    setTimeout(() => {
      if (!(decPK || decWM)) {
        if (walletMnemonic) {
          setDecWM(decryptWithPassphrase(walletMnemonic, password));
        } else if (privateKey) {
          setDecPK(decryptWithPassphrase(privateKey, password));
        } else {
          router.push("/").then();
        }
      }
      const setNetworkFee = async () => {
        let networkFee;
        if (tokenAddress === "native") {
          networkFee = await getGasEstimate({
            mnemonic: decWM,
            privateKey: decPK,
            accountTo: toAddress,
            network: network?.name,
            amount: data.amount,
          });
        } else {
          networkFee = await getContractGasEstimate({
            mnemonic: decWM,
            privateKey: decPK,
            accountTo: toAddress,
            network: network?.name,
            amount: data.amount,
          });
        }
        const total = Number(networkFee);

        
        setData({ ...data, networkFee: Number((total).toFixed(6)) });
        
        setLoading(false);
      };
      setNetworkFee().then();
    }, 100);
    setStep(step + 1);
  };

  const openModal = () => {
    setQrModal(true);
  };
  const closeModal = () => {
    setQrModal(false);
  };

  const getTotal = () => {
    let total = "";
    if (tokenAddress === "native") {
      total = (data?.amount ?? 0) + (data?.networkFee ?? 0) + " " + symbol;
    } else {
      total =
        (data?.amount ?? 0) +
        " " +
        symbol +
        " + " +
        (data?.networkFee ?? 0) +
        " " +
        network.symbol;
    }

    return total;
  };

  const send = async () => {
    setSendError("");
    setisSending(true);
    let res;
    if (tokenAddress === "native") {
      res = await sendNative({
        mnemonic: decWM,
        privateKey: decPK,
        accountTo: toAddress,
        network: network?.name,
        amount: data.amount,
      });
    } else {
      res = await sendToken({
        mnemonic: decWM,
        privateKey: decPK,
        accountTo: toAddress,
        address: tokenAddress,
        network: network?.name,
        amount: data.amount,
      });
    }
    if (
      res?.errorData?.shortMessage ===
      "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
    ) {
      setSendError("Balance not enough for network fee and send value.");
      setisSending(false);
      return;
    } else if (res?.errorData) {
      setSendError("An unknown error occured.");
      setisSending(false);
      return;
    }
    setisSending(false);
    setStep(step + 1);
  };

  const getAddress = async (username: string) => {
    try {
      const sendtag = await getDomainAddress(username);
      const oneidtag = await OneIDSearch(username);

      if (
        sendtag === ZeroAddress &&
        (network?.symbol.toLowerCase() === "vic" ||
          network?.symbol.toLowerCase() === "inj" ||
          network?.name?.toLowerCase() === "base")
      ) {
        const oneidtag = await OneIDSearch(username);
        return oneidtag?.address;
      } else {
        return sendtag;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const SendValidationSchema = z.object({
    amount: z
      .number()
      .min(0, { message: "Amount must be greater than 0" })
      .refine((value) => value > 0, {
        message: "Amount must be greater than 0",
      })
      .refine(
        (value) => {
          return value <= balance;
        },
        { message: "Insufficient balance" }
      ),
    address: z
      .string()
      .min(1, { message: "The address field is required" })
      .refine(
        async (val) => {
          return (
            isValidWalletAddress(val) || parseInt(await getAddress(val)) !== 0
          );
        },
        {
          message: "Invalid wallet address or user does not exist",
        }
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SendValidationSchema) });

  return (
    <>
      <motion.div
        className="flex flex-col w-full min-h-screen pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {qrModal && (
          <Html5QrcodePlugin
            fps={1}
            qrbox={250}
            disableFlip={false}
            close={closeModal}
            qrCodeSuccessCallback={onNewScanResult}
          />
        )}
        
        <div className="max-w-2xl mx-auto w-full px-4 py-8">
          <div className="mb-6">
            <Back
              onBack={(back) => {
                if (step < 1 || step == 2) {
                  back();
                } else {
                  setStep(step - 1);
                }
              }}
            />
          </div>

          {step === 0 ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-black text-black capitalize">
                  Send {symbol}
                </h1>
              </div>

              <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0.00"
                      {...register("amount", {
                        valueAsNumber: true,
                        required: true,
                      })}
                      defaultValue={0}
                      min={0}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-3 sm:py-4 text-lg sm:text-xl font-bold border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 bg-gray-50 text-black placeholder:text-gray-400"
                    />
                    <div className="flex-shrink-0 px-3 sm:px-4 py-3 sm:py-4 bg-blue-300 border-3 border-black rounded-xl font-black text-black">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8" name={symbol} />
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-bold text-gray-600">
                    Balance: {balance as any} {symbol}
                  </p>
                  {errors.amount && (
                    <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                      ⚠️ {errors.amount.message as ReactNode}
                    </p>
                  )}
                </div>

                {/* Recipient Input */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    Recipient
                  </label>
                  <p className="text-xs text-gray-600 mb-2 font-medium">
                    Sendtag {"\n\n"}
                    {(network?.symbol?.toLowerCase() === "vic" ||
                      network?.symbol.toLowerCase() === "inj" ||
                      network?.name?.toLowerCase() === "base") &&
                      ", OneID username"}
                     or wallet address
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      {...register("address")}
                      type="text"
                      placeholder="Enter sendtag or address"
                      className="flex-1 min-w-0 px-3 sm:px-4 py-3 border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-black placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={openModal}
                      className="flex-shrink-0 px-3 sm:px-4 py-3 bg-purple-300 border-3 border-black rounded-xl hover:bg-purple-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2Zm14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1ZM20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3ZM2 9a1 1 0 0 0 1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1Zm8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1Zm1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Zm-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1 1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1Zm4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Zm-4 4a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z" />
                      </svg>
                    </button>
                  </div>
                  {errors.address && (
                    <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                      ⚠️ {errors?.address?.message as ReactNode}
                    </p>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleSubmit(goToFinalPage)}
                  className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-black font-black text-lg border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  {isSending && (
                    <span className="border-x-black w-5 animate-spin h-5 border-4 rounded-full border-y-pink-200"></span>
                  )}
                  {isSending ? "Loading..." : "Continue"}
                </button>
              </div>
            </>
          ) : step === 1 ? (
            <>
              <div className="mb-8 text-center">
                <div className="inline-flex mb-4">
                  <div className="w-16 h-16 bg-purple-300 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <img src={sending?.src} alt="Sending" className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-black">Review & Send</h2>
                <p className="text-gray-600 font-medium mt-2">
                  You're sending {symbol}
                </p>
              </div>

              <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
                <div className="space-y-4">
                  {/* Receiver */}
                  <div className="flex justify-between items-start py-3 border-b-3 border-gray-200">
                    <span className="font-bold text-gray-700">Receiver</span>
                    <div className="text-right font-bold text-black">
                      {toAddress === data.address ? (
                        <Address address={data?.address} />
                      ) : (
                        <>
                          {data.address} (<Address address={toAddress} />)
                        </>
                      )}
                    </div>
                  </div>

                  {/* Network */}
                  <div className="flex justify-between items-center py-3 border-b-3 border-gray-200">
                    <span className="font-bold text-gray-700">Network</span>
                    <span className="font-black text-black">{network?.name}</span>
                  </div>

                  {/* Amount */}
                  <div className="flex justify-between items-center py-3 border-b-3 border-gray-200">
                    <span className="font-bold text-gray-700">Amount</span>
                    <span className="font-black text-black">
                      {data?.amount} {symbol}
                    </span>
                  </div>

                  {/* Network Fees */}
                  <div className="flex justify-between items-center py-3 border-b-3 border-gray-200">
                    <span className="font-bold text-gray-700">Network Fees</span>
                    <span className="font-black text-black">
                      {data?.networkFee} {network.symbol}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-4 bg-yellow-200 border-3 border-black rounded-xl px-4">
                    <span className="font-black text-black uppercase text-lg">
                      Total
                    </span>
                    <span className="font-black text-black text-xl">
                      {getTotal()}
                    </span>
                  </div>
                </div>
              </div>

              {sendError && (
                <div className="mb-4 p-4 bg-red-100 border-3 border-red-500 rounded-xl">
                  <p className="font-bold text-red-600">⚠️ {sendError}</p>
                </div>
              )}

              <button
                onClick={send}
                disabled={loading}
                className="w-full py-4 bg-green-400 hover:bg-green-500 disabled:bg-gray-300 text-black font-black text-lg border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide flex items-center justify-center gap-2"
              >
                {isSending && (
                  <span className="border-x-black w-5 animate-spin h-5 border-4 rounded-full border-y-green-200"></span>
                )}
                {isSending ? "Sending..." : "Confirm & Send"}
              </button>
            </>
          ) : step === 2 ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-6">
                  {/* Success Icon */}
                  <div className="mb-6 inline-flex">
                    <div className="w-20 h-20 bg-green-400 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <img src={sent?.src} alt="Success" className="w-12 h-12" />
                    </div>
                  </div>

                  {/* Success Message */}
                  <h2 className="text-3xl font-black text-black mb-4">
                    Transfer Complete!
                  </h2>

                  {/* Amount Display */}
                  <div className="bg-green-100 border-3 border-black rounded-xl p-4 mb-6">
                    <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                      Amount Sent
                    </p>
                    <p className="text-4xl font-black text-black">
                      {data?.amount}
                    </p>
                    <p className="text-xl font-bold text-black mt-1">{symbol}</p>
                  </div>

                  <p className="text-gray-600 font-medium">
                    Successfully transferred to{" "}
                    <span className="font-bold text-black">
                      <Address address={data?.address} />
                    </span>
                  </p>
                </div>

                <button
                  onClick={async () => router.push("/").then()}
                  className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-black font-black text-lg border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
                >
                  Back to Wallet
                </button>
              </motion.div>
            </>
          ) : null}
        </div>
      </motion.div>
    </>
  );
};