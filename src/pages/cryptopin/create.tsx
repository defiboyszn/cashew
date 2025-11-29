import CryptoPinIndComp from "@/components/wallet/cryptopin/cryptopin.index";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/skeletons/create.cryptopin.index";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { cryptopin_network } from "@/app/contracts/native";

export default function IndividualTokenCryptopin() {
 return <CryptoPinIndComp />;
}
