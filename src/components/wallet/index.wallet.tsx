import Link from "next/link";
import { routes } from "@/app/utils/routes";
import { TokensList } from "@/components/tokens/tokens.list";
import { motion } from "framer-motion";
import { useDollar } from "@/utils/constants";
import { Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { getNativePrice } from "@/app/contracts/price";
import useTokenList from "@/app/hooks/useTokens";
import { toast } from "react-toastify";
import { cryptopin_network } from "@/app/contracts/native";
import { privateKeyToAccount } from "viem/accounts";
import { getDomain } from "@/app/contracts/dns";

const AccountWalletComp = (function AccountWalletComp() {
  const [network] = useLocalStorage("network", networkSettings[defaultNetwork]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [show, setShow] = useState(true);
  const [pubKey] = useLocalStorage("pubKey", "");
  const [username, setUsername] = useState<string>("");

  const { tokenList } = useTokenList({ network: network?.name });

  useEffect(() => {
    const out = Object.values(tokenList).map((data) => {
      return +data.usd_balance;
    });
    const summed = out.reduce((sum, value) => sum + value, 0);
    setTotalBalance(summed);
  }, [tokenList]);


  const getUsername = async () => {
    return await getDomain(pubKey);
  };
  useEffect(() => {
    getUsername().then((data) => {
      setUsername(`${data}.camp.send`);
    });
  }, [network]);

  return (
    <motion.div
      className="relative min-h-fit bg-gray-50 border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Add/Withdraw Buttons */}
        <div className="flex justify-center gap-3 mb-8">
          <Link
            href={routes.topup}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded border-3 border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M12 19L16 15M12 19L8 15"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add
          </Link>
          <button
            onClick={() => toast.warn("Coming soon.")}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded border-3 border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M12 5L16 9M12 5L8 9"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Withdraw
          </button>
        </div>

        {/* Balance Display */}
        <div className="text-center mb-8">
          <div onClick={() => setShow(!show)} className="flex items-center cursor-pointer justify-center gap-4">
            {show ? (
              <h1 className="text-6xl font-black text-black">
                ${useDollar(totalBalance)?.replace("$", "")}
              </h1>
            ) : (
              <h1 className="text-6xl font-black text-black">
                $
                {totalBalance > 3
                  ? "*".repeat(
                      String(useDollar(totalBalance)?.replace("$", "")).length
                    )
                  : "*****"}
              </h1>
            )}
            {/* <button
              onClick={() => setShow(!show)}
              className="p-2 rounded-full transition-all"
            >
              {show ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href={routes.send()}
            className="flex items-center gap-2 px-8 py-4 bg-pink-400 rounded border border-[#111] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-black"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M12 5L16 9M12 5L8 9"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Send
          </Link>
          <Link
            href={routes.receive()}
            className="flex items-center gap-2 px-8 py-4 bg-pink-400 rounded border border-[#111] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-black"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M12 19L16 15M12 19L8 15"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Request
          </Link>
        </div>

        {/* Cryptopin Section */}
        {typeof (
          // @ts-ignore
          cryptopin_network[network?.name?.toLowerCase()]
        ) === "string" ? (
          <Link
            href={`/cryptopin`}
            className="block mb-8 p-4 bg-white rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M12.667 21H7.66699C7.13656 21 6.62785 20.7893 6.25278 20.4142C5.87771 20.0391 5.66699 19.5304 5.66699 19V13C5.66699 12.4696 5.87771 11.9609 6.25278 11.5858C6.62785 11.2107 7.13656 11 7.66699 11H17.667C18.1974 11 18.7061 11.2107 19.0812 11.5858C19.4563 11.9609 19.667 12.4696 19.667 13M8.66699 11V7C8.66699 5.93913 9.08842 4.92172 9.83856 4.17157C10.5887 3.42143 11.6061 3 12.667 3C13.7279 3 14.7453 3.42143 15.4954 4.17157C16.2456 4.92172 16.667 5.93913 16.667 7V11"
                      stroke="black"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-black">Unlock Cryptopin</p>
                  <p className="text-sm text-gray-600">
                    Secure your crypto assets
                  </p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="black"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        ) : null}

        {/* Activity Section */}
        <div className="bg-white rounded border-3 border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-black">Activity</h2>
          </div>

          {/* Token List */}
          <TokensList searchTerm="" routePrefix={routes.token()} see={show} />
        </div>
      </div>
    </motion.div>
  );
});

export default AccountWalletComp;