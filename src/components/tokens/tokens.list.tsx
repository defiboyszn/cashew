import React, { useEffect, useState } from "react";
import { TokensButton, TokensButton1 } from "@/components/tokens/token-btn";
import useTokenList from "@/app/hooks/useTokens";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import {
  defaultNetwork,
  defaultTokens,
  networkSettings,
} from "@/app/config/settings";
import { useRouter } from "next/router";

interface TokensListProps {
  searchTerm?: string;
  routePrefix?: string;
  onClick?: any;
  see?: boolean;
}

export const TokensList: React.FC<TokensListProps> = ({
  searchTerm = "",
  routePrefix = "",
  onClick,
  see = true
}) => {
  const [network] = useLocalStorage("network", networkSettings[defaultNetwork]);
  const { tokenList, filterTokens } = useTokenList({ network: network?.name });
  const default_tokens = defaultTokens[network?.name.toLowerCase()];
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    filterTokens(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (tokenList?.length >= default_tokens?.length && loading) {
      setLoading(false);
    } else if (!loading && tokenList?.length === 0) {
      setLoading(true);
    }
  }, [tokenList]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full rounded-xl overflow-hidden">
        {!loading
          ? (router.asPath === "/" ? tokenList?.slice(0, 4) : tokenList).map(
              (data, index) => (
                router.asPath === "/" ? 
                <TokensButton1
                  data={data}
                  network={network}
                  key={index}
                  routePrefix={routePrefix}
                  see={see}
                  {...onClick}
                /> 
                :
                <TokensButton
                  data={data}
                  network={network}
                  key={index}
                  routePrefix={routePrefix}
                  see={see}
                  {...onClick}
                />
              )
            )
          : Array.from({ length: 4 }, (_, index) => (
              <div className="animate-pulse p-4 bg-white border-3 border-black mb-3 rounded-xl last:mb-0" key={index}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-300 border-2 border-black w-12 h-12"></div>
                    <div className="flex flex-col gap-2">
                      <div className="w-24 h-4 bg-gray-300 rounded-full border-2 border-black"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded-full border-2 border-black"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-20 h-4 bg-gray-300 rounded-full border-2 border-black"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded-full border-2 border-black"></div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};