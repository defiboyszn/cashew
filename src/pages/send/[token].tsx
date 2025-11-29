import {SendToken} from "@/components/wallet/send.tokens.wallet";
import {useRouter} from "next/router";
import {getSymbol} from "@/app/contracts/erc20";
import {useState, useEffect} from "react";
import SkeletonLoader from "@/components/skeletons/send.token";
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
        symbol === "" ? <SkeletonLoader/> : <SendToken symbol={symbol} address={router.query.token as string}/>
    )
}
