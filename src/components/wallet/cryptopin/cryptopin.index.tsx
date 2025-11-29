import search from "@/assets/icons/search.svg";
// import cryptopin from "@/assets/icons/cryptopin.png";
import { Back } from "@/components/global/back.global";
import { TokensList } from "@/components/tokens/tokens.list";
import { routes } from "@/app/utils/routes";
import { motion } from "framer-motion";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
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
import { createCryptopin, getEstGas, getNativeBalance } from "@/app/contracts/native";
import cryptopin_img from "@/assets/icons/confetti.svg";

// @ts-ignore
import nodePin from "node-pin";

const error = (text: string) => toast.error(text);

export const copyToClipboard = (text: string) => {
  navigator.clipboard
    ?.writeText(text)
    .then(() => {})
    .catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
};
const copied = () => toast.success("Copied");
function CryptoPinIndComp(props: any) {
  const [pubKey] = useLocalStorage("pubKey", "");
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [balance, setBalance] = useState(0);
  const [fees, setFees] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [successDeposit, setSuccessDeposit] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [step, setStep] = useState(0);
  const [gas, setGas] = useState(0);
  const [cryptopin, setCryptopin] = useState(0);
  const [password] = useBrowserSession<any>("authPassword", "");
  const [walletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const [privateKey] = useLocalStorage<string>("privateKey", "");
  const [decWM, setDecWM] = useState<string>("");
  const [decPK, setDecPK] = useState<string>("");
  const router = useRouter();
  const [$copied, setCopied] = useState<boolean>(false);

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
    // }, 100);
  }, []);
  useEffect(() => {
    const updateBalance = async () => {
      const bal = await getNativeBalance(pubKey, network?.name);
      setBalance(bal as number);
    };

    updateBalance().then();
  }, [network]);

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
  // useEffect(() => {
  async function create() {
    const generatedOTP = nodePin.generateRandPin(10);
    setLoading(true);
    const data = await createCryptopin({
      mnemonic: decWM,
      privateKey: decPK,
      network: network?.name,
      amount: getValues()?.amount,
      _pin: generatedOTP,
    });
    if (data.success) {
      setCryptopin(generatedOTP);
      setLoading(false);
      setSuccessDeposit(true);
      setStep(1);
    } else {
      setLoading(false);
      error(`Something went wrong. ${data.errorData}`);
    }
  }
  useEffect(() => {
    setFees((getValues()?.amount * 3) / 100);
  }, [getValues()?.amount, fees]);
  return (
    <>
      {/* {successDeposit ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-opacity-70 fixed inset-0 bg-black z-10 backdrop-blur-[2px]"
            onClick={() => setSuccessDeposit(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-20 max-w-[90%] w-[450px]">
            <div className="flex flex-col justify-center items-center">
              <img
                src={sent?.src}
                alt={"Sent"}
                className="w-20 h-20 relative"
              />
              <div className="text-center self-stretch text-gray-500 leading-tight">
                {getValues()?.amount || 0} {network?.symbol} has been
                successfully sent to Cryptopin.
                <br />
                PIN: {cryptopin}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="w-24 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                onClick={() => {
                  setSuccessDeposit(false);
                  router.push("/cryptopin");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )} */}

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
                Create Cryptopin
              </h1>
            </div>
          ) : null}
        </div>

        <div>
          {step === 0 ? (
            <div className="w-full">
              <div className="w-full flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch text-sm leading-tight text-gray-800">
                  Amount
                </div>
                <div
                  className={`self-stretch px-4 py-5 bg-white rounded-lg border justify-start items-center gap-2 flex`}
                >
                  <input
                    type="number"
                    placeholder="Enter amount you want to send"
                    {...register("amount", {
                      valueAsNumber: true,
                      required: true,
                    })}
                    defaultValue={0}
                    className="text-sm appearance-none leading-tight text-gray-500 grow shrink focus:outline-none basis-0"
                  />
                  <div className="flex items-start justify-start gap-2">
                    <div className="text-sm leading-tight text-gray-800">
                      {network?.symbol}
                    </div>
                  </div>
                </div>
                <div className="self-stretch text-sm leading-tight text-gray-800">
                  Bal: {balance as any} {network?.symbol}
                </div>
                {/* <div className="self-stretch text-sm leading-tight text-gray-800">
                  Fees: 3%
                </div> */}
                <div className="w-full pb-3 pt-2 h-fit flex-col justify-start items-start gap-[11px] text-start flex">
                  <div className="text-gray-800 text-sm font-medium font-dm-sans">
                    Cryptopin Details
                  </div>
                  <div className="w-full h-fit pb-1 relative border-t border-b border-black border-opacity-10">
                    <div className="justify-between w-full items-center gap-[115px] flex">
                      <div className="text-gray-800 text-sm font-medium font-dm-sans">
                        Processing Fee:
                      </div>
                      <div className="text-gray-800 text-sm font-medium font-dm-sans">
                        2%
                      </div>
                    </div>
                  </div>
                </div>
                {errors.amount && (
                  <div className="text-red-500 text-sm">
                    {errors.amount.message as ReactNode}
                  </div>
                )}

                <button
                  disabled={Number(balance) < 0}
                  // onClick={}
                  onClick={handleSubmit(create)}
                  className="w-full px-4 py-5 bg-primary rounded-lg justify-center items-center gap-2 inline-flex"
                >
                  {loading && (
                    <span className="border-x-white mr-1 w-4 animate-spin h-4 opacity-60 border-4 rounded-full border-y-primary-light/40"></span>
                  )}
                  <p className="text-base font-medium leading-tight text-center text-violet-100">
                    Create
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full">
                <div className="w-full flex-col justify-center items-center gap-10 flex">
                  <h1 className="text-gray-900 text-[28px] font-medium leading-9 capitalize">
                    Cryptopin Created
                  </h1>
                  <div className="flex flex-col justify-center items-center gap-2">
                    <img
                      src={cryptopin_img?.src}
                      alt={"Created"}
                      className="w-20 h-20 relative"
                    />
                    <div className="flex flex-row justify-between items-center gap-4">
                      <p className="text-center self-stretch text-gray-900 text-2xl font-gt-regular font-bold leading-tight">
                        {cryptopin}
                      </p>
                      <button
                        onClick={() => {
                          copyToClipboard(String(cryptopin));
                          copied();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={19}
                          height={18}
                          viewBox="0 0 19 18"
                          fill="none"
                        >
                          <path
                            id="Vector"
                            d="M13.5 5V3C13.5 2.46957 13.2893 1.96086 12.9142 1.58579C12.5391 1.21071 12.0304 1 11.5 1H3.5C2.96957 1 2.46086 1.21071 2.08579 1.58579C1.71071 1.96086 1.5 2.46957 1.5 3V11C1.5 11.5304 1.71071 12.0391 2.08579 12.4142C2.46086 12.7893 2.96957 13 3.5 13H5.5M5.5 7C5.5 6.46957 5.71071 5.96086 6.08579 5.58579C6.46086 5.21071 6.96957 5 7.5 5H15.5C16.0304 5 16.5391 5.21071 16.9142 5.58579C17.2893 5.96086 17.5 6.46957 17.5 7V15C17.5 15.5304 17.2893 16.0391 16.9142 16.4142C16.5391 16.7893 16.0304 17 15.5 17H7.5C6.96957 17 6.46086 16.7893 6.08579 16.4142C5.71071 16.0391 5.5 15.5304 5.5 15V7Z"
                            stroke="#8363EE"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-center self-stretch text-gray-500 leading-tight">
                      {getValues()?.amount || 0} {network?.symbol} has been
                      successfully transferred from your wallet to cryptopin.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/cryptopin")}
                    className="w-fit h-12 px-4 py-3 bg-violet-100 rounded-lg border border-violet-500 justify-center items-center gap-2 inline-flex"
                  >
                    <span className="text-center text-violet-500 text-base font-light font-gt-regular leading-tight">
                      Back to home
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

export default CryptoPinIndComp;
