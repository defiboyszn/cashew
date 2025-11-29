import {ReceiveTokens} from "@/components/wallet/tokens.receive.account";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getSymbol} from "@/app/contracts/erc20";
import SkeletonLoader from "@/components/skeletons/receive.token";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import {defaultNetwork, networkSettings} from "@/app/config/settings";

export default function IndividualTokenReceive() {
    const router = useRouter();
    const [symbol, setSymbol] = useState("");
    const [network] = useLocalStorage<any>('network', networkSettings[defaultNetwork]);


    useEffect(() => {
        const init = async () => {
            router.query.token === "native" ? setSymbol(network.symbol) : setSymbol(await getSymbol(router.query.token as string, network?.name) as string)
        }
        if (router.query.token)
            init().then();
    }, [router.query.token]);


    return (
        symbol === "" ? <SkeletonLoader/> : <ReceiveTokens symbol={symbol} address={router.query.token as string}/>)
}
