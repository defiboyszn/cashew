import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/skeletons/account.index";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { getDomain } from "@/app/contracts/dns";
import AccountComp from "@/components/account/account";

export default function Swap() {
    const [loading, setLoading] = useState<boolean>(true);
    const [pubKey,] = useLocalStorage("pubKey", "");
    const [username, setUsername] = useState<string>("")
    const [network, setNetwork] = useLocalStorage<any>('network', networkSettings[defaultNetwork]);

    const getUsername = async () => {
        return await getDomain(pubKey);
    }
    useEffect(() => {
        setLoading(true)
        getUsername().then(data => {
            setLoading(false)
            setUsername(data)
        })
    }, [network]);

    return (
        loading ? <SkeletonLoader /> : <AccountComp username={`${username}.camp.send`} />
    )
}
