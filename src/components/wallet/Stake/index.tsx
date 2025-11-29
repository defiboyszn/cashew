import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { getTokenBalance } from "@/app/contracts/erc20";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import useLocalStorage from "@/app/hooks/useLocalStorage";
// import send from "@/assets/icons/stsend.svg";
import { Back } from "@/components/global/back.global";
// import { TokensList } from "@/components/tokens/tokens.list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import sent from "@/assets/icons/confetti.svg";
import classNames from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { HiExclamationCircle } from "react-icons/hi";
import styles from "@/styles/toast.module.css";
import { decryptWithPassphrase } from "@/app/utils/functions";
import Icon from "@/components/global/icons";
import useTokenList, { Token } from "@/app/hooks/useTokens";
import { formatEther, parseEther } from "viem";
import { claimReward, getStakers, stake, unstake } from "@/app/contracts/native";
import { roundNumber } from "@/utils/constants";

const errorStaking = (text: string) =>
  toast.custom(
    (t) => (
      <div
        className={classNames([
          styles.notificationWrapper,
          t.visible ? "top-0" : "-top-96",
        ])}
      >
        <div className={styles.iconWrapper}>
          <HiExclamationCircle />
        </div>
        <div className={styles.contentWrapper}>
          <h1>Error</h1>
          <p>{text}</p>
        </div>
        <div className={styles.closeIcon} onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "top-center" }
  );

function StakeComp() {
  const [openStake, setOpenStake] = useState(false);
  const [openUnstake, setOpenUnstake] = useState(false);
  const [staked, setStaked] = useState(false);
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [password] = useBrowserSession<any>("authPassword", "");
  const [walletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const [privateKey] = useLocalStorage<string>("privateKey", "");
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState(0);
  const [pubKey] = useLocalStorage("pubKey", "");
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [decWM, setDecWM] = useState<string>("");
  const [decPK, setDecPK] = useState<string>("");
  const [reward, setReward] = useState<number>(0);
  const [staked_amount, setStakedAmount] = useState<number>(0);
  const { tokenList } = useTokenList({ network: network?.name });

  useEffect(() => {
    getStakers({ address: pubKey }).then((data) => {
      console.log(data,);
      setReward(Number(formatEther(data?.data[2])));
      setStakedAmount(Number(formatEther(data?.data[0])));
    });

    setBalance(
      tokenList.filter((data) => data.symbol.toLowerCase() === "hlusd")[0]
        ?.balance

    );
  }, [tokenList, balance]);

  useEffect(() => {
    if (!(decPK || decWM)) {
      if (walletMnemonic) {
        setDecWM(decryptWithPassphrase(walletMnemonic, password));
      } else if (privateKey) {
        setDecPK(decryptWithPassphrase(privateKey, password));
      } else {
        router.push("/").then();
      }
    }
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

  const handleStake = async () => {
    setLoading(true);
    stake({
      mnemonic: decWM,
      privateKey: decPK as `0x${string}`,
      amount: getValues()?.amount,
      address: pubKey as `0x${string}`,
    })
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.successData) {
          setOpenStake(false);
          setStaked(true);
        }
      })
      .catch((e: any) => {
        setLoading(false);
        errorStaking(`Something went wrong. ${e?.toString()}`);
      });
  };

  const handleUnStake = async () => {
    setLoading(true);
    unstake({
      mnemonic: decWM,
      privateKey: decPK as `0x${string}`,
      amount: getValues()?.unstake_amount,
      address: pubKey as `0x${string}`,
    })
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.successData) {
          setOpenStake(false);
          setStaked(true);
        }
      })
      .catch((e: any) => {
        setLoading(false);
        errorStaking(`Something went wrong. ${e?.toString()}`);
      });
  };
  const handleRewards = async () => {
    setLoading(true);
    claimReward({
      mnemonic: decWM,
      privateKey: decPK as `0x${string}`,
      address: pubKey as `0x${string}`,
    })
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.successData) {
          setOpenStake(false);
          setStaked(true);
        }
      })
      .catch((e: any) => {
        setLoading(false);
        errorStaking(`Something went wrong. ${e?.toString()}`);
      });
  };
  return (
    <>
      {/* Stake Modal */}
      {staked ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-opacity-70 fixed inset-0 bg-black z-10 backdrop-blur-[2px]"
            onClick={() => setStaked(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-20 max-w-[90%] w-[450px]">
            <div className="flex flex-col justify-center items-center">
              <img
                src={sent?.src}
                alt={"Sent"}
                className="w-20 h-20 relative"
              />
              <div className="text-center self-stretch text-gray-500 leading-tight">
                {getValues()?.amount || 0} HLUSD has been
                successfully staked.
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="w-24 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                onClick={() => setStaked(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {openStake ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-opacity-70 fixed inset-0 bg-black z-10 backdrop-blur-[2px]"
            onClick={() => setOpenStake(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-20 max-w-[90%] w-[450px]">
            <div className="w-full">
              <p className="text-[28px] text-cgray-900 font-medium leading-[56px] pb-4">
                Stake HLUSD
              </p>
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
                    min={0}
                    className="text-sm appearance-none leading-tight text-gray-500 grow shrink focus:outline-none basis-0"
                  />
                  <div className="flex items-start justify-start gap-2">
                    <div className="text-sm leading-tight text-gray-800">
                      HLUSD
                    </div>
                  </div>
                </div>
                <div className="self-stretch text-sm leading-tight text-gray-800">
                  Bal: {balance as any} HLUSD
                </div>
                {errors.amount && (
                  <div className="text-red-500 text-sm">
                    {errors.amount.message as ReactNode}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                disabled={loading}
                className="w-24 py-2 disabled:bg-primary/80 bg-primary text-white rounded-lg hover:bg-primary-dark"
                onClick={handleSubmit(handleStake)}
              >
                <p className="text-base font-medium leading-tight text-center text-violet-100">
                  Stake
                </p>
              </button>
              <button
                className="w-24 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenStake(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Unstake Modal */}
      {openUnstake ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-opacity-70 fixed inset-0 bg-black z-10 backdrop-blur-[2px]"
            onClick={() => setOpenUnstake(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-20 max-w-[90%] w-[450px]">
            <div className="w-full">
              <p className="text-[28px] text-cgray-900 font-medium leading-[56px] pb-4">
                Unstake HLUSD
              </p>
              <div className="w-full flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch text-sm leading-tight text-gray-800">
                  Amount
                </div>
                <div
                  className={`self-stretch px-4 py-5 bg-white rounded-lg border justify-start items-center gap-2 flex`}
                >
                  <input
                    type="number"
                    placeholder="Enter amount you want to unstake"
                    {...register("unstake_amount", {
                      valueAsNumber: true,
                      required: true,
                    })}
                    defaultValue={0}
                    min={0}
                    className="text-sm appearance-none leading-tight text-gray-500 grow shrink focus:outline-none basis-0"
                  />
                  <div className="flex items-start justify-start gap-2">
                    <div className="text-sm leading-tight text-gray-800">
                      HLUSD
                    </div>
                  </div>
                </div>
                <div className="self-stretch text-sm leading-tight text-gray-800">
                  Bal: {staked_amount as any} HLUSD
                </div>
                {errors.unstake_amount && (
                  <div className="text-red-500 text-sm">
                    {errors.unstake_amount.message as ReactNode}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="w-24 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                onClick={(handleUnStake)}
              >
                Unstake
              </button>
              <button
                className="w-24 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setOpenUnstake(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col w-full pb-4 sm:pt-12">
        <div className="z-10 pt-5 pb-3 top-20 bg-cgray-25">
          <Back />
          <div className="flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
            <h1 className="self-stretch text-cgray-900 text-[28px] font-medium leading-9">
              Staking
            </h1>
            <p className="text-zinc-400 text-[15px] font-normal leading-loose">
              Stake your HLUSD and get USDh
            </p>
          </div>
        </div>

        <div className="pt-10 flex flex-col justify-center items-center gap-4 h-full">
          <div className="flex flex-col justify-center items-center px-2 py-2 rounded-full border-none">
            <Icon name="usdh" />
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <p className="text-stone-900 text-[19px] font-medium capitalize leading-tight tracking-wider">
              Rewards
            </p>
            <p className="text-center text-stone-900 text-[28px] font-bold font-gt-medium leading-tight">
              {roundNumber(reward).toLocaleString()} USDh
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <div className="w-[287px] h-20 p-5 flex-col justify-center items-center flex bg-white rounded-lg border border-gray-300">
              <div className="text-zinc-400 text-sm font-light leading-tight">
                Staked
              </div>
              <div>
                <span className="text-violet-500 text-sm font-extrabold leading-tight">
                  {staked_amount?.toLocaleString()}
                </span>
                <span className="text-violet-500 text-sm font-light leading-tight">
                  {" "}
                  HLUSD
                </span>
              </div>
            </div>
            <div className="w-[287px] h-20 p-5 flex-col justify-center items-center flex bg-white rounded-lg border border-gray-300">
              <div className="text-zinc-400 text-sm font-light leading-tight">
                Balance
              </div>
              <div>
                <span className="text-violet-500 text-sm font-extrabold leading-tight">
                  {balance?.toLocaleString()}
                </span>
                <span className="text-violet-500 text-sm font-light leading-tight">
                  {" "}
                  HLUSD
                </span>
              </div>
            </div>
          </div>
          <div className="pt-10 flex flex-col justify-center items-center gap-1.5">
            <button
              onClick={() => setOpenStake(true)}
              className="w-[343px] h-12 px-4 py-3 bg-violet-100 rounded-lg border border-violet-500 justify-center items-center gap-2 flex"
            >
              <p className="text-center text-violet-500 text-base font-light font-['GT Walsheim Pro'] leading-tight">
                Stake HLUSD
              </p>
            </button>
            <button
              onClick={() => setOpenUnstake(true)}
              className="w-[343px] h-12 px-4 py-3 bg-violet-100 rounded-lg border border-violet-500 justify-center items-center gap-2 flex"
            >
              <p className="text-center text-violet-500 text-base font-light font-['GT Walsheim Pro'] leading-tight">
                Unstake HLUSD
              </p>
            </button>
            <button onClick={handleRewards} className="w-[343px] h-12 px-4 py-3 bg-violet-500 rounded-lg border border-violet-500 justify-center items-center gap-2 flex">
              <p className="text-center text-white text-base font-light font-['GT Walsheim Pro'] leading-tight">
                Claim Rewards
              </p>
            </button>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default StakeComp;
