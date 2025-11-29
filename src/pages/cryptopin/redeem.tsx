
import RedeemCryptopinComp from "@/components/wallet/cryptopin/redeem.index";
import { useRouter } from "next/router";
// import { getSymbol } from "@/app/contracts/erc20";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/skeletons/redeem.cryptopin.index";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { cryptopin_network } from "@/app/contracts/native";

export default function Cryptopin() {
  return <RedeemCryptopinComp />
}
