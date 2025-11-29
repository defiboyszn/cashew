import TopupComp from "@/components/wallet/topup";
import { useRouter } from "next/router";
import { getSymbol } from "@/app/contracts/erc20";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/skeletons/send.token";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { useSearchParams } from "next/navigation";

export default function Topup() {

    const [symbol, setSymbol] = useState("");
    const [network] = useLocalStorage<any>('network', networkSettings[defaultNetwork]);
    const router = useRouter()


    useEffect(() => {
        const init = async () => {
            setSymbol(network?.symbol)
        }
        if (network?.symbol) {
            init().then();
        }
        if (network?.symbol?.toLowerCase() !== "hlusd") {
            init().then();
        } else if (network?.symbol?.toLowerCase() !== "mnt") {
            init().then();
        } else {
            router.back();
        }
    }, [network?.symbol]);


    return (
        symbol === "" ? <SkeletonLoader /> : <TopupComp />
    )
}
