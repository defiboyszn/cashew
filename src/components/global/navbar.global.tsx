import React, { useEffect, useState } from "react";
import Logo from "../../assets/icons/sendtokenlogo.svg";
import Link from "next/link";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { useRouter } from "next/router";
import CustomDropdown from "@/components/global/dropdown";

function GlobalNavbar() {
  const [network, setNetwork] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const handleNetworkChange = (value: any) => {
    const selectedNetwork = networkSettings[value.toLowerCase()];
    setNetwork(selectedNetwork);
    router.reload();
  };

  useEffect(() => {
    setLoading(false);
  }, [network]);

  return (
    <>
     <div className="fixed top-0 left-0 z-50 w-full px-4 h-20 bg-yellow-300 border-b-4 border-black sm:px-10 flex items-center justify-between shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <Link href="/" className="flex items-center">
          <div className="bg-white border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-lg">
            <img src={Logo.src} className="h-6" alt="Cashew by Sendtokens Logo" />
          </div>
        </Link>
        
        <div className="flex gap-3 items-center">
          {!loading && (
            <div className="bg-white border-3 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <CustomDropdown
                options={networkSettings}
                defaultValue={network?.name.toLowerCase()}
                onChange={handleNetworkChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GlobalNavbar;