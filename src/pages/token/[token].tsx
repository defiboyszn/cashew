import {Token} from "@/components/wallet/token.wallet";
import {useRouter} from "next/router";

export default function InvidiualTokenReceive() {
    const router = useRouter();

    const data = {
        token: router.query.token,
    }

    return (
        <Token data={data}/>
    )
}
