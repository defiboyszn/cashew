import CryptoPinComp from "@/components/wallet/cryptopin";
import { useRouter } from "next/router";
// import { getSymbol } from "@/app/contracts/erc20";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/skeletons/cryptopin.index";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { cryptopin_network } from "@/app/contracts/native";
// import { useSearchParams } from "next/navigation";

export default function Cryptopin() {

  return <CryptoPinComp />;
}
