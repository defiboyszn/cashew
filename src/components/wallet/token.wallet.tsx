import { Back } from "../global/back.global";
import NoTransaction from "../../assets/icons/no-transaction.svg";
import sent from "@/assets/icons/sent.svg";
import received from "@/assets/icons/received.svg";
import { motion } from "framer-motion";
import Link from "next/link";
import { routes } from "@/app/utils/routes";
import Icon from "@/components/global/icons";
import NetworkIcon from "@/components/global/network.icon";
import React, { useEffect, useState } from "react";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import {
  getSymbol,
  getTokenCurrency,
  getTokenName,
  getTransactionErc20,
} from "@/app/contracts/erc20";
import {
  getNativeBalance,
  getNativeCurrency,
  getTransactionNative,
  cryptopin_network,
  getTxnRedeemed,
  getTxn,
} from "@/app/contracts/native";
import { getTokenBalance } from "@/app/contracts/erc20";
import { formatEther, fromHex } from "viem";
import { roundNumber, shortenAddress, useDollar } from "@/utils/constants";
import SkeletonLoader from "../skeletons/token.index";
import { getDomain } from "@/app/contracts/dns";
import { toast } from "react-toastify";

const Tnx = function Tnx({
  address,
  symbol,
}: {
  address: string;
  symbol: string;
}) {
  const [domain, setDomain] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDomain(address);
        setDomain(result);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching domain:", error);
      }
    }

    fetchData();
  }, [address]);

  return address?.toLowerCase() ===
    "0xded46Fb03F046D881CaB71A3cD330b6ce6d09931" &&
    symbol?.toLowerCase() === "hlusd" ? (
    <span>Topup</span>
  ) : domain !== "" ? (
    <span>{domain}.send</span>
  ) : (
    <span>{shortenAddress(address)}</span>
  );
};

const top_up_address = "0xded46Fb03F046D881CaB71A3cD330b6ce6d09931";
const Token = function Token(props: any) {
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [balance, setBalance] = useState<number>(0);
  const [symbol, setSymbol] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [modal_data, setModalData] = useState({} as any);

  const [transactions, setTransactions] = useState([] as any);
  const [usd_balance, setUsdBalance] = useState<number>(0);
  const cryptopin_address =
    // @ts-ignore
    cryptopin_network[network?.name?.toLowerCase()];

  const [pubKey] = useLocalStorage("pubKey", "");

  useEffect(() => {
    props.data.token === "native" &&
      getTxn(pubKey, network, (_data: any) => {
        setTransactions(_data);
      }).then(() => {});
    props.data.token !== "native" &&
      getTransactionErc20(pubKey, network?.name, props.data.token).then(
        (data) => {
          setTransactions(data);
        }
      );

    if (props.data.token) {
      const setToken = async () => {
        if (props.data.token === "native") {
          const bal = await getNativeBalance(pubKey, network?.name);
          setBalance(bal as number);
          setSymbol(network.symbol);
          setUsdBalance((await getNativeCurrency(network?.name)) as any);
        } else {
          const bal = await getTokenBalance(
            props.data.token as string,
            pubKey,
            network?.name
          );
          setBalance(bal as number);
          const symbol = await getSymbol(props.data.token, network?.name);
          setUsdBalance(
            (await getTokenCurrency(
              symbol?.toLowerCase(),
              network?.name
            )) as any
          );
          setSymbol(symbol);
        }
      };

      setToken().then();
    }
  }, [props.data.token, transactions, symbol, network?.name, usd_balance]);
  return symbol ? (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className={`sticky z-[50] gap-y-6 grid grid-cols-1 sm:flex sm:flex-col sm:gap-y-6 w-full justify-center pt-5 pb-3 sm:pb-8 top-20 bg-cgray-25 ${
          transactions?.length < 1 && "border-b"
        } sm:pt-12`}
      >
        <div className="pt-5 w-full">
          <Back />
        </div>
        <div className="flex justify-center">
          <p className="text-center text-gray-500 text-sm font-medium font-gt-medium uppercase leading-tight tracking-wide">
            {symbol.toUpperCase()} balance
          </p>
        </div>
        <div className="flex justify-center">
          {symbol.toLowerCase() === network.symbol.toLowerCase() ? (
            <Icon
              className="w-16 h-16"
              name={network.symbol}
              cName={network?.name}
            />
          ) : (
            <NetworkIcon
              className="w-16 h-16"
              cName={network?.name}
              miniClassName={"w-5 h-5"}
              network={network.symbol}
              token={symbol.toLowerCase()}
            />
          )}
        </div>
        <div className="flex flex-col items-center bg-cgray-25 ">
          <div className="font-gt-medium text-gray-900">
            <div className="text-4xl font-bold text-center">
              <p>
                {balance?.toLocaleString()}{" "}
                <span className="text-lg">{symbol.toUpperCase()}</span>
              </p>
              <p className="text-sm">{useDollar(balance * usd_balance || 0)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-8 md:gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={routes.send(props.data.token)}
              className="flex flex-col justify-center items-center"
            >
              <div className="py-2 px-2 bg-primary-light border-primary border text-primary flex flex-row justify-between items-center gap-1 rounded-full">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M12 5L16 9M12 5L8 9"
                    stroke="#8363EE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className={`inline-block text-sm`}>Send</span>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => {
                toast.warn("Coming soon.");
              }}
              className="py-2 px-2 bg-primary-light border-primary border text-primary flex flex-row justify-between items-center gap-1 rounded-full"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3L20 7M20 7L16 11M20 7H10M8 13L4 17M4 17L8 21M4 17H13"
                  stroke="#8363EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8363EE" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg> */}
            </button>
            <span className={`inline-block text-sm`}>Swap</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link
              href={routes.receive(props.data.token)}
              className="py-2 px-2 bg-primary-light border-primary border text-primary flex flex-row justify-between items-center gap-1 rounded-full"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M12 19L16 15M12 19L8 15"
                  stroke="#8363EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <span className={`inline-block text-sm`}>Receive</span>
          </div>
        </div>
      </div>
      {/* assets */}

      {transactions?.length < 1 ? (
        <div className="flex flex-col items-center mt-16">
          <img src={NoTransaction.src} className={"opacity-60"} alt="404" />
          <span>No Transactions yet..</span>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-start mt-8">
          <h1 className="text-gray-500 text-xs font-medium uppercase leading-none tracking-wide">
            Recent Transactions
          </h1>

          <div className="flex flex-col assets-container mt-4 rounded">
            {transactions?.length > 0 &&
              transactions?.map((data: any, i: number) => (
                <>
                  <button
                    key={i}
                    onClick={() => {
                      setModalData({
                        amount: roundNumber(
                          Number(
                            formatEther(
                              props.data.token !== "native"
                                ? data?.amount || data?.value
                                : data?.value
                            )
                          )
                        )?.toLocaleString(),
                        sent:
                          data?.from?.toLowerCase() === pubKey?.toLowerCase(),
                        received:
                          data?.from?.toLowerCase() !== pubKey?.toLowerCase(),
                        symbol:
                          props.data.token !== "native"
                            ? symbol
                            : network?.symbol,
                        nSymbol: network?.symbol,
                        network: network?.name,
                        dollar: useDollar(
                          roundNumber(
                            Number(
                              formatEther(
                                props.data.token !== "native"
                                  ? data?.amount || data?.value
                                  : data?.value
                              )
                            )
                          ) * usd_balance || 0
                        ),
                        sender: shortenAddress(data.to),
                        receiver: shortenAddress(data.from),
                        from: data.from,
                        to: data.to,
                        gas:
                          network?.symbol?.toLowerCase() === "inj"
                            ? data?.gas_used
                            : network?.name?.toLowerCase() === "morph"
                            ? data?.gas_used
                            : network?.symbol?.toLowerCase() === "wbtc"
                            ? data?.gas_used
                            : data?.gasUsed,
                        gasPrice:
                          network?.symbol?.toLowerCase() === "inj"
                            ? data?.gas_price
                            : network?.name?.toLowerCase() === "morph"
                            ? data?.gas_price
                            : network?.symbol?.toLowerCase() === "wbtc"
                            ? data?.gas_used
                            : data?.gasPrice,
                        usd: usd_balance,
                      });
                      setOpen(true);
                    }}
                    className="p-1 md:p-3 px-3 py-4 justify-between items-center gap-4 flex flex-row"
                  >
                    <div className="p-1 md:p-3 justify-start items-center gap-2 flex flex-row">
                      <div className="p-2 bg-violet-100 rounded-[32px] justify-center items-center gap-2 flex">
                        <img
                          src={
                            data?.from?.toLowerCase() === pubKey?.toLowerCase()
                              ? sent?.src
                              : received?.src
                          }
                          alt={
                            data?.from?.toLowerCase() === pubKey?.toLowerCase()
                              ? "sent"
                              : "received"
                          }
                        />
                      </div>
                      <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                        {data?.from?.toLowerCase() ===
                          top_up_address?.toLowerCase() &&
                        symbol.toLowerCase() === "hlusd" ? (
                          <span className="self-stretch text-gray-900 text-sm font-medium leading-[16.80px]">
                            Topup of{" "}
                            {props.data.token === "native"
                              ? network?.symbol
                              : symbol.toLowerCase()}
                          </span>
                        ) : data?.from?.toLowerCase() ===
                          cryptopin_address?.toLowerCase() ? (
                          <span className="self-stretch text-gray-900 text-sm font-medium leading-[16.80px]">
                            Redeemed a cryptopin
                          </span>
                        ) : data?.from?.toLowerCase() ===
                            pubKey?.toLowerCase() &&
                          data?.to?.toLowerCase() ===
                            cryptopin_address?.toLowerCase() ? (
                          <span className="self-stretch text-gray-900 text-sm font-medium leading-[16.80px]">
                            Created a cryptopin
                          </span>
                        ) : (
                          <div className="self-stretch text-gray-900 text-sm font-medium leading-[16.80px]">
                            {data?.from?.toLowerCase() === pubKey?.toLowerCase()
                              ? "Sent"
                              : "Received"}{" "}
                            {props.data.token !== "native"
                              ? symbol
                              : network?.symbol}{" "}
                            {data?.from?.toLowerCase() === pubKey?.toLowerCase()
                              ? `to`
                              : `from`}{" "}
                            {data?.from?.toLowerCase() ===
                            pubKey?.toLowerCase() ? (
                              <Tnx
                                symbol={symbol.toLowerCase()}
                                address={data?.to}
                              />
                            ) : (
                              <Tnx
                                symbol={symbol.toLowerCase()}
                                address={data?.from}
                              />
                            )}
                          </div>
                        )}
                        {/* <Tnx address={data?.from} /><Tnx address={data?.to} /> */}
                      </div>
                    </div>
                    <div className="flex-col justify-start items-end gap-0.5 inline-flex">
                      <div className="self-stretch text-right text-gray-900 text-sm font-medium leading-[16.80px]">
                        {roundNumber(
                          Number(
                            formatEther(
                              props.data.token !== "native"
                                ? data?.amount || data?.value
                                : data?.value
                            )
                          )
                        )?.toLocaleString()}{" "}
                        {props.data.token !== "native"
                          ? symbol
                          : network?.symbol}
                      </div>
                      {/* <div className="self-stretch text-right text-zinc-500 text-sm font-light leading-tight">$300.25</div> */}
                    </div>
                  </button>
                </>
              ))}
          </div>
        </div>
      )}
      <div>
        {open && (
          <Modal
            {...modal_data}
            open={setOpen}
            cp={
              typeof cryptopin_address === "string"
                ? cryptopin_address.toLowerCase()
                : ""
            }
          />
        )}
      </div>
      {/* getting started */}
    </motion.div>
  ) : (
    <>
      <SkeletonLoader />
    </>
  );
};

export { Token };
const Modal = function Modal(props: any) {
  return (
    <div>
      <div className="w-full md:w-[400px] h-[532px] fixed left-0 md:right-10 bottom-0 z-[999999999] pt-8 pb-6 bg-white rounded-t-2xl md:rounded-2xl shadow flex-col justify-center items-center flex">
        <div className="w-10 h-10 p-3 bg-violet-100 rounded-[40px] justify-center items-center gap-2 inline-flex">
          {props.cp == props.to || props?.from === props.cp ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={24}
              viewBox="0 0 25 24"
              fill="none"
            >
              <g id="tabler-icon-lock-share">
                <path
                  id="Vector"
                  d="M12.667 21H7.66699C7.13656 21 6.62785 20.7893 6.25278 20.4142C5.87771 20.0391 5.66699 19.5304 5.66699 19V13C5.66699 12.4696 5.87771 11.9609 6.25278 11.5858C6.62785 11.2107 7.13656 11 7.66699 11H17.667C18.1974 11 18.7061 11.2107 19.0812 11.5858C19.4563 11.9609 19.667 12.4696 19.667 13M8.66699 11V7C8.66699 5.93913 9.08842 4.92172 9.83856 4.17157C10.5887 3.42143 11.6061 3 12.667 3C13.7279 3 14.7453 3.42143 15.4954 4.17157C16.2456 4.92172 16.667 5.93913 16.667 7V11M16.667 22L21.667 17M21.667 17V21.5M21.667 17H17.167M11.667 16C11.667 16.2652 11.7723 16.5196 11.9599 16.7071C12.1474 16.8946 12.4018 17 12.667 17C12.9322 17 13.1866 16.8946 13.3741 16.7071C13.5616 16.5196 13.667 16.2652 13.667 16C13.667 15.7348 13.5616 15.4804 13.3741 15.2929C13.1866 15.1054 12.9322 15 12.667 15C12.4018 15 12.1474 15.1054 11.9599 15.2929C11.7723 15.4804 11.667 15.7348 11.667 16Z"
                  stroke="#8363EE"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          ) : (
            <img
              src={props.received ? received?.src : sent?.src}
              alt={"received"}
            />
          )}
        </div>
        <span className="w-full text-center text-gray-500 text-sm font-medium font-gt-regular leading-tight">
          You{" "}
          {props?.from?.toLowerCase() === top_up_address?.toLowerCase() &&
          props.symbol.toLowerCase() === "hlusd"
            ? "topped up"
            : props?.to === props.cp
            ? "created a cryptopin"
            : props?.from === props.cp
            ? "redeemed a cryptopin"
            : props.sent
            ? "sent"
            : "received"}
        </span>
        <p className="text-center">
          <span className="text-gray-900 text-2xl font-bold font-gt-bold leading-loose">
            {props.amount}{" "}
          </span>
          <span className="text-gray-900 text-base font-medium font-gt-medium leading-tight">
            {props.symbol}{" "}
          </span>
        </p>
        <div className="w-full text-center text-zinc-500 text-sm font-light font-gt-regular leading-tight">
          ~{props.dollar}
        </div>

        <div className="w-[343px] mt-6 h-fit p-4 bg-gray-100 rounded-lg flex-col justify-start items-center gap-4 inline-flex">
          <div className="self-stretch justify-start items-start inline-flex">
            <div className="grow shrink basis-0 text-gray-500 text-sm font-light font-gt-regular leading-tight">
              Status
            </div>
            <div className="h-5 justify-end items-center gap-0.5 flex">
              <div className="text-right text-violet-500 text-sm font-normal font-gt-medium leading-tight">
                Completed
              </div>
            </div>
          </div>
          {props?.from?.toLowerCase() === top_up_address?.toLowerCase() &&
          props.symbol.toLowerCase() === "hlusd" ? null : props?.to ===
            props.cp ? null : props?.from === props.cp ? null : (
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="grow shrink basis-0 text-gray-500 text-sm font-light font-gt-regular leading-tight">
                {props.sent ? "Receiver" : "Sender"}
              </div>
              <div className="w-[189px] text-right text-gray-900 text-sm font-light font-gt-regular leading-tight">
                <Tnx
                  symbol={props.symbol.toLowerCase()}
                  address={props.sent ? props.to : props.from}
                />
              </div>
            </div>
          )}
          <div className="self-stretch justify-start items-start inline-flex">
            <div className="grow shrink basis-0 text-gray-500 text-sm font-light font-gt-regular leading-tight">
              Network
            </div>
            <div className="w-[189px] text-right text-gray-900 text-sm font-light font-gt-regular leading-tight">
              {props.network} (ERC-20)
            </div>
          </div>
          {props.network.toLowerCase() === "telos" ? null : (
            <div className="self-stretch justify-start items-start inline-flex">
              <div className="grow shrink basis-0 text-gray-500 text-sm font-light font-gt-regular leading-tight">
                Fees
              </div>
              <div className="h-5 justify-end items-center gap-1 flex">
                <div className="text-right text-gray-900 text-sm font-light font-gt-regular leading-tight">
                  {formatEther(
                    BigInt(Number(props?.gas) * Number(props?.gasPrice))
                  )}{" "}
                  {props?.nSymbol} / (
                  {useDollar(
                    roundNumber(
                      Number(
                        formatEther(
                          BigInt(Number(props?.gas) * Number(props?.gasPrice))
                        )
                      ) * Number(props?.usd)
                    )
                  )}
                  )
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        onClick={() => props.open(false)}
        className="glassmorphism w-full h-screen fixed overflow-hidden left-0 right-0 top-0 z-[9999] transition-all duration-500"
      />
    </div>
  );
};
