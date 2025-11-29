import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/skeletons/settings.index";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import SettingsComp from "@/components/settings";

export default function Swap() {

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
        symbol === "" ? <SkeletonLoader /> : <SettingsComp />
    )
}
