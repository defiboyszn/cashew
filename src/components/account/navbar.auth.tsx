import React, { useEffect, useState } from "react";
import Logo from "../../assets/icons/sendtokenlogo.svg";
import LogoNoText from "../../assets/logos/send-logo-no-text.svg";
import Link from "next/link";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { getDomain } from "@/app/contracts/dns";
import Address from "@/components/global/address.global";
import CustomDropdown from "@/components/global/dropdown";
import NavDropdown from "./dropdown";

function AuthNavbar() {
  const [network, setNetwork] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [pubKey] = useLocalStorage("pubKey", "");
  const [username, setUsername] = useState<string>("");
  
  const handleNetworkChange = (value: any) => {
    const selectedNetwork = networkSettings[value.toLowerCase()];
    setNetwork(selectedNetwork);
    router.reload();
  };

  useEffect(() => {
    setLoading(false);
  }, [network]);

  const getUsername = async () => {
    return await getDomain(pubKey);
  };

  useEffect(() => {
    getUsername().then((data) => {
      setUsername(data);
    });
  }, [network]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[9999999] px-4 h-12 mt-4 sm:px-10 flex items-center justify-between">
        {/* <Link href="/">
          <div className="h-10 sm:h-8 bg-white border-3 border-black px-3 py-1">
            <img
              src={Logo.src}
              className="h-full block z-[9999999999999] relative"
              alt="logo"
            />
          </div>
        </Link> */}
        <div></div>

        <div className="flex gap-3 relative z-[99999999999999]">
          {username && (
            <NavDropdown options={undefined} username={`${username}.camp.send`}>
              <button className="flex flex-row items-center gap-2 justify-center rounded-none px-3 sm:px-5 py-2.5 font-bold text-black border-3 border-black">
                <div className="rounded-full w-8 sm:w-8 h-8 sm:h-8 bg-pink-400 border-2 border-black flex flex-row justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-black w-5 h-5 sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    id="user"
                  >
                    <path
                      fill="currentColor"
                      d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"
                    ></path>
                  </svg>
                </div>
                <span className="hidden sm:inline-block text-sm font-bold uppercase tracking-wide">
                  <Address
                    address={`${username}.camp.send`}
                  ></Address>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transform rotate-90 hidden sm:block"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="black"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </NavDropdown>
          )}
        </div>
      </div>
    </>
  );
}

export default AuthNavbar;