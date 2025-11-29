import search from "../../assets/icons/search.svg";
import { ReactNode, useEffect, useState } from "react";
import { Back } from "../../global/back.global";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import axios from "axios";
import { $fetch, roundNumber } from "@/utils/constants";
import { usePaystackPayment } from "react-paystack";
import { getNativeCurrency, sendNative } from "@/app/contracts/native";
import { useRouter } from "next/router";
import {
  decryptWithPassphrase,
  isValidWalletAddress,
} from "@/app/utils/functions";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import { Hex, stringToHex } from "viem";
import { getPrice } from "@/app/contracts/price";
import { sendToken } from "@/app/contracts/erc20";

function calculatePercentage(amount: number, percentage = 10) {
  if (
    isNaN(amount) ||
    isNaN(percentage) ||
    percentage < 0 ||
    percentage > 100
  ) {
    return 0;
  }

  const result = (amount * percentage) / 100;
  const roundedResult = Math.round(result);
  return roundedResult;
}

function TopupComp() {
  const [step, setStep] = useState(0);
  const [rate, setRate] = useState({
    result: 1,
  });
  const [n_rate, setNRate] = useState(0);
  const [ngn_rate, setNGNRate] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [pubKey] = useLocalStorage("pubKey", "");
  const [password] = useBrowserSession<any>("authPassword", "");
  const [err, setErr] = useState<{
    input: boolean;
    minmax: boolean;
    pay?: boolean;
  }>({ input: false, minmax: false, pay: false });
  const [email, setEmail] = useState("");
  const [$amount, set$Amount] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  function calculatePercent(number: number) {
    return (number * 3) / 100;
  }

  const SendValidationSchema = z.object({
    amount: z
      .number()
      .min(0, { message: "Amount must be greater than 0" })
      .refine((value) => value >= 1000, {
        message: "Amount must be greater than ₦1000",
      }),
    email: z.string().email({ message: "Invalid email address" }),
  });

  useEffect(() => {
    $fetch("https://api.paycrest.io/v1/rates/usdt/1/ngn").then(
      (data) => {
        const ngn_usdt = roundNumber(Number(data.data));
        console.log(data);

        setNRate(1 / ngn_usdt);
        setNGNRate(ngn_usdt);
      }
    );

    setBuyAmount(
      nairaToKobo(Number($amount)) +
      nairaToKobo(0.3 * ngn_rate) +
      nairaToKobo(calculatePercent(Number($amount)))
    );
  }, []);

  function nairaToKobo(amountInNaira: number) {
    if (isNaN(amountInNaira)) {
      return 0;
    }
    const amountInKobo = amountInNaira * 100;
    return amountInKobo;
  }

  function koboToNaira(kobo: number) {
    if (isNaN(kobo)) {
      return 0;
    }
    return kobo / 100;
  }

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: buyAmount,
    publicKey: "pk_test_a45aadbd4dd3f0d0b4f98e2fd00487b4dc7f1afd",
  };
  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    if (reference?.status === "success") {
      sendToken({
        privateKey: ("0x" +
          (process.env.NEXT_PUBLIC_TOPUP_PRIVATE_KEY as string)) as Hex,
        accountTo: pubKey,
        network: network?.name,
        amount: amount,
        address: "0x27aB765e4c3FF46F803027cbF1d0fD7c9f141D98"

      })
        .then(({ successData }) => {
          setStep(1);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const onClose = () => {
    setLoading(false);
  };



  const checkRate = async () => {
    setIsCalculating(true)
    const amount = Number($amount);
    const req = await $fetch(
      "https://api.paycrest.io/v1/rates/usdt/1/ngn"
    );
    const ngn_dollar = await req?.data;
    const dollar = amount / Number(ngn_dollar);
    setAmount(roundNumber(dollar * rate?.result));

    setBuyAmount(
      nairaToKobo(Number($amount)) +
      nairaToKobo(0.5 * ngn_rate) +
      nairaToKobo(calculatePercent(Number($amount)))
    );
    setTimeout(() => {
      setIsCalculating(false);
    }, 300);
  };

  const buy = async () => {
    setLoading(true);
    initializePayment({
      // @ts-ignore
      onSuccess,
      onClose,
    });
  };

  // useEffect(() => {
  //   if (network?.symbol?.toLowerCase() !== "hlusd") {
  //     router.push("/");
  //   }
  // }, []);

  return step === 0 ? (
    <>
      <motion.div
        className="flex flex-col w-full pb-4 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-2xl mx-auto w-full px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Back />
            <h1 className="text-4xl font-black text-black mt-4 mb-2">
              Top-up Wallet
            </h1>
            <p className="text-gray-600 font-medium">
              Buy USDT with Naira via Paystack
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-3 border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-black placeholder:text-gray-400"
              />
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Top-up Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-black text-black">
                  ₦
                </span>
                <input
                  type="number"
                  onBlur={(e) => checkRate()}
                  placeholder="Enter amount (₦1,000 - ₦10,000)"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= 10000) {
                      set$Amount(e.target.value);
                    }
                  }}
                  min={1000}
                  value={$amount}
                  className={`w-full pl-12 pr-4 py-4 text-xl font-bold border-3 ${(Number($amount) < 1000 && Number($amount) > 0) || Number($amount) > 10000
                    ? "border-red-500 bg-red-50"
                    : "border-black bg-gray-50"
                    } rounded-xl focus:outline-none focus:ring-4 ${(Number($amount) < 1000 && Number($amount) > 0) || Number($amount) > 10000
                      ? "focus:ring-red-300"
                      : "focus:ring-yellow-300"
                    } text-black placeholder:text-gray-400`}
                />
              </div>
              {Number($amount) < 1000 && Number($amount) > 0 && (
                <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                  ⚠️ Minimum amount is ₦1,000
                </p>
              )}
              {Number($amount) > 10000 && (
                <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                  ⚠️ Maximum amount is ₦10,000
                </p>
              )}
            </div>

            {/* You'll Receive */}
            <div className="mb-6 p-4 bg-green-100 border-3 border-black rounded-xl">
              {/* {isCalculating && (
                <div className="absolute inset-0 bg-green-200/80 flex items-center justify-center backdrop-blur-sm z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold text-black text-sm">Calculating...</span>
                  </div>
                </div>
              )} */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black uppercase">
                  You'll Receive
                </span>
                <div className="text-right">
                  {isCalculating ?
                    <p className="text-2xl font-black text-black">
                      Calculating...
                    </p>
                    :
                    <p className="text-2xl font-black text-black">
                      {amount?.toFixed(1)} USDT
                    </p>
                  }
                  <p className="text-xs font-bold text-gray-600 bg-white border-2 border-black px-2 py-1 rounded-full inline-block mt-1">
                    Rate: $1 = 1 USDT
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            {/* {isCalculating && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-black text-black">Updating fees...</span>
                </div>
              </div>
            )} */}
            <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Order Details
            </h3>

            <div className="space-y-3">
              {/* Processing Fee */}
              <div className="flex justify-between items-center py-3 border-b-3 border-gray-200">
                <span className="font-bold text-gray-700">Processing Fee</span>
                <div className="text-right">
                  <p className="font-black text-black">
                    ₦
                    {(
                      roundNumber(

                        (ngn_rate * 0.5) + calculatePercent(Number($amount.replace(/,/g, "")))
                      )
                    )?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    3% + $0.5 = $
                    {roundNumber(

                      (0.5 + calculatePercent(Number($amount.replace(/,/g, ""))) /
                        ngn_rate)
                    )?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Processing Time */}
              <div className="flex justify-between items-center py-3 border-b-3 border-gray-200">
                <span className="font-bold text-gray-700">Processing Time</span>
                <span className="font-black text-black bg-blue-100 px-3 py-1 rounded-full border-2 border-black">
                  ~1 minute
                </span>
              </div>

              {/* Total Cost */}
              <div className="flex justify-between items-center py-4 bg-yellow-200 border-3 border-black rounded-xl px-4 mt-4">
                <span className="font-black text-black uppercase text-lg">
                  Total Cost
                </span>
                <span className="font-black text-black text-2xl">
                  ₦{koboToNaira(buyAmount)?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            disabled={Number($amount) < 1000 || Number($amount) > 10000 || !email || loading}
            onClick={buy}
            className="w-full py-4 bg-pink-400 hover:bg-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black text-lg border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:translate-x-[3px] disabled:translate-y-[3px] transition-all uppercase tracking-wide flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="border-x-black w-5 animate-spin h-5 border-4 rounded-full border-y-pink-200"></span>
            )}
            {loading ? "Processing..." : "Continue to Payment"}
          </button>

          {/* Info Card */}
          <div className="bg-blue-100 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-400 rounded-full border-3 border-black flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
              </div>
              <div>
                <h4 className="font-black text-black mb-2">How it works</h4>
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-black">1.</span>
                    Enter your email and amount (minimum ₦1,000)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-black">2.</span>
                    Complete payment via Paystack (card or bank transfer)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-black">3.</span>
                    USDT will be sent to your wallet automatically
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-black">4.</span>
                    Processing usually takes about 1 minute
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  ) : (
    <>
      <motion.div
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6 inline-flex">
              <div className="w-20 h-20 bg-green-400 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={48}
                  height={48}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="black"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-black text-black mb-4">
              Top-up Successful!
            </h2>

            {/* Amount Display */}
            <div className="bg-green-100 border-3 border-black rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                Added to your wallet
              </p>
              <p className="text-4xl font-black text-black">
                {amount?.toFixed(1)}
              </p>
              <p className="text-xl font-bold text-black mt-1">
                USDT
              </p>
            </div>

            <p className="text-gray-600 font-medium mb-6">
              Your wallet has been successfully topped up. You can now use your{" "}
              USDT for transactions.
            </p>

            {/* Continue Button */}
            <button
              onClick={async () => router.push("/").then()}
              className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-black font-black text-lg border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
            >
              Back to Wallet
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default TopupComp;