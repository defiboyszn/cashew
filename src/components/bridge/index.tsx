import { ReactNode, useEffect, useState } from "react";
import { Back } from "../global/back.global";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultNetwork,
  defaultTokens,
  networkSettings,
} from "@/app/config/settings";
import { getNativeBalance } from "@/app/contracts/native";
import { getTokenBalance } from "@/app/contracts/erc20";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { getDomainAddress } from "@/app/contracts/dns";
import { isValidWalletAddress } from "@/app/utils/functions";
import { useForm } from "react-hook-form";
import useTokenList, { Token } from "@/app/hooks/useTokens";
import Icon from "../global/icons";
type Props = {};

function BridgeComp(props: Props) {
  const [balance, setBalance] = useState(0);
  const [toBal, setToBal] = useState([] as unknown as Token);
  const [fromBal, setFromBal] = useState([] as unknown as Token);
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [pubKey] = useLocalStorage<string>("pubKey", "");
  const [symbol, setSymbol] = useState(network?.symbol);
  const [token, setToken] = useState(network?.name?.toLowerCase() === "hela" ? "usdh" : "wusdh");
  const { tokenList, filterTokens } = useTokenList({ network: network?.name });
  const { tokenList: ll_token } = useTokenList({ network: "lightlink" });


  useEffect(() => {
    // const updateBalance = async () => {
    //   const bal = await getTokenBalance(
    //     "0xDE46E2d8E5F49Cc620A9f22d970af7382Dca541E" as string,
    //     pubKey,
    //     network?.name
    //   );
    //   setBalance(bal as number);
    // };

    setFromBal(tokenList.filter((data)=> data.symbol.toLowerCase() === token)[0])
    setToBal(ll_token.filter((data)=> data.symbol.toLowerCase() === "wusdh")[0])
  }, [tokenList,fromBal]);

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
  });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SendValidationSchema) });

  // const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <>
      {/* <TokenSwapModal swappableTokens={tokenList} isOpen={fromModal} onClose={() => setFromModal(!fromModal)} enableToken={(token: any) => setSelectedFromToken(token)} />
            <TokenSwapModal swappableTokens={tokenList} isOpen={toModal} onClose={() => setToModal(!toModal)} enableToken={(token: any) => setSelectedToToken(token)} /> */}
      <motion.div
        className="flex flex-col w-full pb-4 sm:pt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="sticky z-10 pt-5 pb-3 top-20 bg-cgray-25">
          <Back />
          <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
            <h1 className="self-stretch text-cgray-900 text-[28px] font-medium leading-9">
              Bridge
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center w-full gap-6">
              <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
                <div
                  className={`self-stretch px-4 py-2 bg-white rounded-lg border-2 justify-start items-center gap-2 flex flex-col`}
                >
                  <div
                    className={`px-4 py-2 w-full justify-between items-center sm:gap-2 flex flex-row`}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <h1 className="text-xl font-gt-light text-black">
                          From
                        </h1>
                        <div className="flex flex-row gap-1 justify-between items-center">
                          <Icon
                            className="h-auto w-8 bg-base-100 bg-opacity-60 rounded-full"
                            name={network?.symbol?.toLowerCase()}
                          />
                          <h1 className="text-lg font-gt-regular text-black">
                            {network?.name}
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                          />
                        </svg>
                        <h1 className="text-xl font-gt-light text-black">
                          {fromBal?.balance} {fromBal?.symbol}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg w-full justify-start items-center sm:gap-2 inline-flex`}
                  >
                    <input
                      type="number"
                      placeholder="From"
                      {...register("amount", {
                        valueAsNumber: true,
                        required: true,
                      })}
                      defaultValue={0}
                      min={0}
                      className="text-2xl appearance-none w-full leading-tight text-gray-500 grow shrink focus:outline-none basis-0"
                    />
                    <div className="flex items-start justify-start gap-2">
                      <button className="flex gap-2 items-center px-2 py-2 rounded-lg bg-black/20 text-gray-700 font-semibold focus:outline-none">
                        <Icon
                          className="h-[24px] w-[24px] bg-base-100 bg-opacity-60 rounded-full"
                          name={"usdh"}
                        />
                        <h1 className="text-xl font-gt-light text-black">
                          {fromBal?.balance} {fromBal?.symbol}
                        </h1>
                      </button>
                    </div>
                  </div>
                </div>
                {errors.amount && (
                  <div className="text-red-500 text-sm">
                    {errors.amount.message as ReactNode}
                  </div>
                )}
              </div>
            </div>

            {/* <div className="relative flex flex-col justify-center items-center">
              <div
                onClick={switchTokens}
                className={
                  "absolute cursor-pointer w-11 h-11 p-2.5 bg-white rounded-3xl border-2 border-gray-300 justify-center items-center gap-2.5 inline-flex"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <g id="tabler-icon-switch-vertical">
                    <path
                      id="Vector"
                      d="M3 8.02246L7 4.02246M7 4.02246L11 8.02246M7 4.02246V13.0225M13 16.0225L17 20.0225M17 20.0225L21 16.0225M17 20.0225V10.0225"
                      stroke="#8363EE"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
            </div> */}
            <div className="flex flex-col items-center w-full gap-6">
              <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
                <div
                  className={`self-stretch px-4 py-2 bg-white rounded-lg border-2 justify-start items-center gap-2 flex flex-col`}
                >
                  <div
                    className={`px-4 py-2 w-full justify-between items-center sm:gap-2 flex flex-row`}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <h1 className="text-xl font-gt-light text-black">
                          From
                        </h1>
                        <div className="flex flex-row gap-1 justify-between items-center">
                          <Icon
                            className="h-auto w-8 bg-base-100 bg-opacity-60 rounded-full"
                            name={"lightlink".toLowerCase()}
                          />
                          <h1 className="text-lg font-gt-regular text-black">
                            Lightlink
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                          />
                        </svg>
                        <h1 className="text-xl font-gt-light text-black">
                          {toBal?.balance} {toBal?.symbol}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg w-full justify-start items-center sm:gap-2 inline-flex`}
                  >
                    <input
                      type="number"
                      placeholder="From"
                      {...register("amount", {
                        valueAsNumber: true,
                        required: true,
                      })}
                      defaultValue={0}
                      min={0}
                      className="text-2xl appearance-none w-full leading-tight text-gray-500 grow shrink focus:outline-none basis-0"
                    />
                    <div className="flex items-start justify-start gap-2">
                      <button className="flex gap-2 items-center px-2 py-2 rounded-lg bg-black/20 text-gray-700 font-semibold focus:outline-none">
                        <Icon
                          className="h-[24px] w-[24px] bg-base-100 bg-opacity-60 rounded-full"
                          name={"usdh"}
                        />
                        <h1 className="text-xl font-gt-light text-black">
                          {toBal?.balance} {toBal?.symbol}
                        </h1>
                      </button>
                    </div>
                  </div>
                </div>
                {errors.amount && (
                  <div className="text-red-500 text-sm">
                    {errors.amount.message as ReactNode}
                  </div>
                )}
              </div>
            </div>

            <button className="w-full mt-2 px-4 py-5 bg-primary rounded-lg justify-center items-center gap-2 inline-flex">
              <p className="text-base font-medium leading-tight text-center text-violet-100">
                Bridge
              </p>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default BridgeComp;
