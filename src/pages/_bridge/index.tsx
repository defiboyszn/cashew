
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/skeletons/send.token";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { useSearchParams } from "next/navigation";
import BridgeComp from "@/components/bridge";

export default function Bridge() {
    const [symbol, setSymbol] = useState("");
    const [network] = useLocalStorage<any>('network', networkSettings[defaultNetwork]);


    useEffect(() => {
        const init = async () => {
            setSymbol(network?.symbol)
        }
        if (network?.symbol)
            init().then();
    }, [network?.symbol]);


    return (
        symbol === "" ? <SkeletonLoader /> : <BridgeComp />
    )
}
