import search from "@/assets/icons/search.svg";
import cryptopin from "@/assets/icons/cryptopin.png";
import { Back } from "@/components/global/back.global";
import { TokensList } from "@/components/tokens/tokens.list";
import { routes } from "@/app/utils/routes";
import { motion } from "framer-motion";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import cryptopin_img from "@/assets/icons/confetti.svg";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import send from "@/assets/icons/stsend.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import sent from "@/assets/icons/confetti.svg"
import classNames from "classnames";
import { toast } from "react-toastify";
import { MdOutlineClose } from "react-icons/md";
import { HiExclamationCircle } from "react-icons/hi";
import styles from "@/styles/toast.module.css";
import { decryptWithPassphrase } from "@/app/utils/functions";
import {
  redeemCryptopin,
  getNativeBalance,
  getPinDetailsForUser,
  getUserCryptopin,
  getEventFromRedeemedCryptopin,
} from "@/app/contracts/native";
import { getTokenBalance } from "@/app/contracts/erc20";
import { formatEther } from "viem";

const error = (text: string) => toast.error(text);

function RedeemCryptopinComp(props: any) {
  const [pubKey] = useLocalStorage("pubKey", "");
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [successDeposit, setSuccessDeposit] = useState<boolean>(false);
  const [password] = useBrowserSession<any>("authPassword", "");
  const [walletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const [privateKey] = useLocalStorage<string>("privateKey", "");
  const [decWM, setDecWM] = useState<string>("");
  const [decPK, setDecPK] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // setTimeout(() => {
    if (!(decPK || decWM)) {
      if (walletMnemonic) {
        setDecWM(decryptWithPassphrase(walletMnemonic, password));
      } else if (privateKey) {
        setDecPK(decryptWithPassphrase(privateKey, password));
      } else {
        router.push("/").then();
      }
    }
    // }, 100)
  }, []);

  const SendValidationSchema = z.object({
    pin: z
      .number()
      .min(0, { message: "pin must be greater than 0" })
      .refine((value) => value > 0, {
        message: "Amount must be greater than 0",
      }),
  });

  const getError = (text: string) => {
    const insufficient = /insufficient balance to pay fees/;
    const invalidoralready = /Invalid or already redeemed PIN/;
    const extractedMessage = text?.match(insufficient);
    const extractedMessage1 = text?.match(invalidoralready);

    if (extractedMessage) {
      return extractedMessage[0];
    } else if (extractedMessage1) {
      return extractedMessage1[0];
    } else {
      return "Error Redeeming Cryptopin!";
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SendValidationSchema) });
  async function redeem() {
    setLoading(true);
    const data = await redeemCryptopin({
      mnemonic: decWM,
      privateKey: decPK,
      network: network?.name,
      _pin: getValues()?.pin,
    });
    if (data.success) {
      setLoading(false);
      setSuccessDeposit(true);
      //   getUserCryptopin({
      //     mnemonic: decWM,
      //     privateKey: decPK,
      //     network: network?.name,
      //   }).then(({ successData }) => {
      //     setStep(1);
      //     setBalance(
      //       Number(
      //         formatEther(
      //           (successData as any).filter(
      //             (_data: any) => String(_data.pin) === String(getValues()?.pin)
      //           )[0]?.balance
      //         )
      //       )
      //     );
      //   });
      // } else {
        setStep(1);
        setBalance(Number(data.successData.amount));
      // }
    } else if (data.error) {
      error(getError(JSON.stringify(data?.errorData) as string) as string);
      setLoading(false);
      console.log(data.error, data.errorData);
      
    }
  }

  return (
    <>
      <motion.div
        className="flex flex-col w-full pb-4 sm:pt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="z-10 pt-5 pb-3 top-20 bg-cgray-25">
          <Back />
          {step === 0 ? (
            <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
              <h1 className="self-stretch text-gray-900 text-[28px] font-medium leading-9 capitalize">
                Redeem Cryptopin
              </h1>
            </div>
          ) : null}
        </div>

        <div>
          {step === 0 ? (
            <div className="w-full">
              <div className="w-full flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch text-sm leading-tight text-gray-800">
                  Pin
                </div>
                <div
                  className={`self-stretch px-4 py-5 bg-white rounded-lg border justify-start items-center gap-2 flex`}
                >
                  <input
                    type="number"
                    placeholder="Enter pin to redeem"
                    {...register("pin", {
                      valueAsNumber: true,
                      required: true,
                    })}
                    className="text-sm appearance-none leading-tight text-gray-500 grow shrink focus:outline-none basis-0"
                  />
                </div>

                <button
                  // onClick={}
                  onClick={handleSubmit(redeem)}
                  className="w-full px-4 py-5 bg-primary rounded-lg justify-center items-center gap-2 inline-flex"
                >
                  {loading && (
                    <span className="border-x-white mr-1 w-4 animate-spin h-4 opacity-60 border-4 rounded-full border-y-primary-light/40"></span>
                  )}
                  <p className="text-base font-medium leading-tight text-center text-violet-100">
                    Redeem
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full">
                <div className="w-full flex-col justify-center items-center gap-10 flex">
                  <h1 className="text-gray-900 text-[28px] font-medium leading-9 capitalize">
                    Cryptopin Redeemed
                  </h1>
                  <div className="flex flex-col justify-center items-center gap-2">
                    <img
                      src={cryptopin_img?.src}
                      alt={"Created"}
                      className="w-20 h-20 relative"
                    />
                    <div className="flex flex-row justify-between items-center gap-4">
                      <p className="text-center self-stretch text-gray-900 text-2xl font-gt-regular font-bold leading-tight">
                        {balance} {network?.symbol}
                      </p>
                    </div>
                    <p className="text-center self-stretch text-gray-500 leading-tight">
                      has been successfully deposited into your wallet from
                      cryptopin.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/")}
                    className="w-fit h-12 px-4 py-3 bg-violet-100 rounded-lg border border-violet-500 justify-center items-center gap-2 inline-flex"
                  >
                    <span className="text-center text-violet-500 text-base font-light font-gt-regular leading-tight">
                      View Wallet
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default RedeemCryptopinComp;
