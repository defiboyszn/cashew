import {
  Hela_ABI as ABI,
  hlusd_address,
  Bnb_ABI as ABI1,
  bnb_address,
} from "@/app/contracts/abi/oracle-abi";
import {
  Address,
  createPublicClient,
  formatEther,
  http,
  parseUnits,
} from "viem";
import { getNetwork } from "@/app/config/networks";
import { $fetch, roundNumber } from "@/utils/constants";

export const getNativePrice = async (network = "") => {
 
  
    return "0";

};

export const getPrice = async (network: string) => {
  const getData = async (network: string) => {
    const network_ = getNetwork(network);
     if (network_?.id === 123420001114) {
      return null;
    } else {
      return null;
    }
  };
  // const data = await getData(network);
  // const todayPrice = data?.Price;
  // const yesterdayPrice = data?.PriceYesterday;

  // const percentageChange =
  //   ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100;

  // if (yesterdayPrice > todayPrice) {
  //   return {
  //     value: `-${Math.abs(percentageChange).toFixed(2)}%`,
  //     pnl: "lost",
  //   };
  // } else {
    return {
      value: `+0%`,
      pnl: "gain",
    };
  // }
};
export const getTokenPrice = async (network: string, symbol: string) => {
  const getData = async (network: string) => {
    const network_ = getNetwork(network);
     if (network_?.id === 123420001114) {
      if (symbol === "usdt") {
        const req = await $fetch(
          `https://api.diadata.org/v1/assetQuotation/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7`
        );
        const res = await req;
        return res;
      } else if (symbol === "usdc") {
        const req = await $fetch(
          `https://api.diadata.org/v1/assetQuotation/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
        );
        const res = await req;
        return res;
      } else if (symbol === "btc") {
        const req = await $fetch(
          `https://api.diadata.org/v1/assetQuotation/Bitcoin/0x0000000000000000000000000000000000000000`
        );
        const res = await req;
        return res;
      } else if (symbol === "eth") {
        const req = await $fetch(
          `https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000`
        );
        const res = await req;
        return res;
      }
    }
  };
  const data = await getData(network);
  const todayPrice = data?.Price;
  const yesterdayPrice = data?.PriceYesterday;

  const percentageChange =
    ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100;

  if (yesterdayPrice > todayPrice) {
    return {
      value: `-${Math.abs(percentageChange).toFixed(2)}%`,
      pnl: "lost",
    };
  } else {
    return {
      value: `+${Math.abs(percentageChange).toFixed(2)}%`,
      pnl: "gain",
    };
  }
};
