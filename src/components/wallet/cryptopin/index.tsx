import search from "@/assets/icons/search.svg";
import cryptopin from "@/assets/icons/cryptopin.png";
import { Back } from "@/components/global/back.global";
import { TokensList } from "@/components/tokens/tokens.list";
import { useEffect, useState } from "react";
import { routes } from "@/app/utils/routes";
import { AnimatePresence, motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import {
  cryptopin_network,
  getPinDetailsForUser,
  getUserCryptopin,
} from "@/app/contracts/native";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { decryptWithPassphrase } from "@/app/utils/functions";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { MdOutlineClose } from "react-icons/md";
import { HiExclamationCircle } from "react-icons/hi";
import styles from "@/styles/toast.module.css";
import classNames from "classnames";
import { formatEther } from "viem";
import { getDomain } from "@/app/contracts/dns";
import { copyToClipboard } from "./cryptopin.index";

const transition = { type: "spring", duration: 0.8 };
const fadeAnimation = {
  initial: {
    opacity: 0,
    transition: { ...transition, delay: 0.5 },
  },
  animate: {
    opacity: 1,
    transition: { ...transition, delay: 0 },
  },
  exit: {
    opacity: 0,
    transition: { ...transition, delay: 0 },
  },
};

const copied = () => toast.success("Copied");
type Pin = {
  pin: string | number;
  balance: bigint;
  creationDate: bigint;
  isActive: boolean;
  redeemedBy: string;
  redemptionDate: bigint;
};
function CryptoPinComp() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [step, setStep] = useState(0);
  const [cryptopins, setCryptopins] = useState(0);
  const [active_cryptopin, setActiveCryptopin] = useState<Pin[]>([]);
  const [redeemed_cryptopin, setRedeemedCryptopin] = useState<Pin[]>([]);
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
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
  useEffect(() => {
    async function init() {
      const data = await getUserCryptopin({
        mnemonic: decWM,
        privateKey: decPK,
        network: network?.name?.toLowerCase(),
      });
      setCryptopins((data?.successData as [])?.length || 0);

      if ((data?.successData as [])?.length > 0) {
        const $data = data?.successData as Pin[];
        setActiveCryptopin($data.filter((data) => data.isActive === true));
        setRedeemedCryptopin($data.filter((data) => data.isActive === false));
      }
    }
    init().then();
  }, [decWM, decPK, cryptopins]);

  // useEffect(() => {
  //   if (
  //     typeof 
  //     // @ts-ignore
  //     cryptopin_network[
  //       network?.symbol?.toLowerCase()
  //     ] === "string"
  //   ) {
  //     router.push("/");
  //   }
  // }, []);
  return (
    <>
      <motion.div
        className="flex flex-col w-full pb-4 sm:pt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="z-10 pt-5 pb-3 top-20 bg-cgray-25">
          <Back
            onBack={(back) => {
              if (step < 1) {
                back();
              } else {
                setStep(step - 1);
              }
            }}
          />
          {/* {step === 1 ? (
                        <>
                            <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
                                <h1 className="self-stretch text-cgray-900 text-[28px] font-medium leading-9">All Assets</h1>
                            </div>

                            <div className="inline-flex flex-col items-start justify-start w-full gap-2 h-14">
                                <div
                                    className="w-full h-14 px-4 py-[18px] bg-cgray-25 rounded-lg border border-gray-300 justify-start items-center gap-2 inline-flex">
                                    <img src={search?.src} alt="Search" />
                                    <input type="text" value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for asset"
                                        className="text-sm font-light leading-tight text-gray-500 grow shrink basis-0 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : null} */}
        </div>
        <div className="flex flex-col gap-4 justify-start items-start pt-8">
          {/* <img src={cryptopin?.src} alt="cryptopin" className="w-[120px] h-[120px]" /> */}
          <div className="w-full flex-row justify-between items-center gap-2 flex">
            <h1 className="self-stretch text-gray-900 text-[28px] font-medium font-gt-medium leading-9">
              Cryptopin
            </h1>

            <div className="flex flex-row justify-center md:justify-between items-center gap-3">
              <Link
                href="/cryptopin/create"
                className="w-full h-12 px-4 py-3 bg-violet-500 rounded-lg justify-center items-center gap-2 inline-flex"
              >
                <span className="text-center text-white text-base font-light font-gt-light leading-tight">
                  Create
                </span>
              </Link>
              <Link
                href="/cryptopin/redeem"
                className="w-full h-12 px-4 py-3 bg-violet-100 rounded-lg border border-violet-500 justify-center items-center gap-2 inline-flex"
              >
                <span className="text-center text-violet-500 text-base font-light font-gt-light leading-tight">
                  Redeem
                </span>
              </Link>
            </div>
          </div>
          <div>
            <span className="text-center text-black text-base font-light font-gt-light leading-tight">
              Generated Cryptopin ({cryptopins})
            </span>
          </div>
          <Tab.Group>
            <Tab.List
              className={`flex flex-row items-center justify-between gap-3`}
            >
              <Tab>
                {({ selected }) => (
                  <button
                    className={
                      selected
                        ? "w-full h-12 px-4 py-3 bg-violet-100 rounded-2xl text-violet-500"
                        : ""
                    }
                  >
                    Active
                  </button>
                )}
              </Tab>
              <Tab>
                {({ selected }) => (
                  <button
                    className={
                      selected
                        ? "w-full h-12 px-4 py-3 bg-violet-100 rounded-2xl text-violet-500"
                        : ""
                    }
                  >
                    Redeemed
                  </button>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className={"w-full"}>
              <Tab.Panel className={"w-full flex flex-col gap-3"}>
                {active_cryptopin?.map((data, i) => (
                  <Cryptopin index={i} pin={data} network={network} />
                ))}
              </Tab.Panel>
              <Tab.Panel className={"w-full flex flex-col gap-3"}>
                {redeemed_cryptopin?.map((data, i) => (
                  <Cryptopin index={i} pin={data} network={network} />
                ))}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </motion.div>
    </>
  );
}

export default CryptoPinComp;

const Cryptopin = ({
  index,
  pin,
  network,
}: {
  index: number;
  pin: Pin;
  network: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [$copied, setCopied] = useState<boolean>(false);

  const toggleOpen = () => {
    // setIsOpen(false);
    setIsOpen(!isOpen);
  };
  return (
    <section
      key={index}
      className={`${
        isOpen ? "pb-6" : ""
      } flex flex-col items-start justify-between bg-white rounded-lg border border-gray-300 w-full lg:w-full h-[fit] px-4 mb-2 text-[18px] font-medium tracking-normal cursor-pointer sm:text-lg font-gt-regular`}
    >
      <div
        onClick={toggleOpen}
        className="w-full p-5 justify-between items-center inline-flex"
      >
        <div className="justify-start items-center gap-6 flex">
          <div className="text-gray-500 text-sm font-light font-gt-light leading-tight">
            {pin?.pin}
          </div>

          <button
            onClick={() => {
              copyToClipboard(String(pin?.pin));
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
        <AnimatePresence>
          {isOpen ? (
            <motion.button className="w-6 h-6 relative">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={25}
                height={24}
                viewBox="0 0 25 24"
                fill="none"
                className="transfrom rotate-180"
              >
                <g id="tabler-icon-chevron-down">
                  <path
                    id="Vector"
                    d="M6.5 9L12.5 15L18.5 9"
                    stroke="#667085"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </motion.svg>
            </motion.button>
          ) : (
            <motion.button className="w-6 h-6 relative">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={25}
                height={24}
                viewBox="0 0 25 24"
                fill="none"
              >
                <g id="tabler-icon-chevron-down">
                  <path
                    id="Vector"
                    d="M6.5 9L12.5 15L18.5 9"
                    stroke="#667085"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </motion.svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // className="flex items-center justify-between w-[902px] h-[112px] px-4 [box-shadow:0px_2px_4px_rgba(16,24,40,0.08)] mb-2 text-base font-medium tracking-normal cursor-pointer sm:text-lg font-inter"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="font-gt-regular font-[400] text-[18px] leading-[28px] px-5 text-[#344054]"
          >
            <div className="flex flex-col gap-3 items-start">
              {pin.isActive ? (
                <p className="text-gray-500 text-sm font-light font-gt-light leading-tight">
                  Created Date:{" "}
                  <span className="font-bold">
                    {new Date(
                      Number(BigInt(pin?.creationDate) * BigInt(1000))
                    ).toLocaleString()}
                  </span>
                </p>
              ) : (
                <p className="text-gray-500 text-sm font-light font-gt-light leading-tight">
                  Redeemed Date:{" "}
                  <span className="font-bold">
                    {new Date(
                      Number(BigInt(pin?.redemptionDate) * BigInt(1000))
                    ).toLocaleString()}
                  </span>
                </p>
              )}
              <p className="text-gray-500 text-sm font-light font-gt-light leading-tight">
                Amount:{" "}
                <span className="font-bold">
                  {formatEther(pin?.balance)} {network?.symbol}
                </span>
              </p>
              <p className="text-gray-500 text-sm font-light font-gt-light leading-tight">
                Status:{" "}
                {pin?.isActive ? (
                  <span className="text-[#8363EE] font-bold">Active</span>
                ) : (
                  <span className="text-[#8363EE] font-bold">Redeemed</span>
                )}
              </p>
              {pin.isActive === false && (
                <p className="text-gray-500 text-sm font-light font-gt-light leading-tight">
                  Redeemed By:{" "}
                  <span className="font-bold">
                    <Dname address={pin.redeemedBy} />
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Dname = ({ address }: { address: `${string}` }) => {
  const [name, setName] = useState("");
  useEffect(() => {
    getDomain(address).then((data) => {
      setName(data);
    });
  }, []);
  return <>{name}.send</>;
};
