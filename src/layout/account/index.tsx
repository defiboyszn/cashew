import RootLayout from "@/layout";
import {AnimatePresence} from "framer-motion"
import useLocalStorage from "@/app/hooks/useLocalStorage";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import GlobalNavbar from "@/components/global/navbar.global";

function AuthLayout({children}: any) {

    const [walletMnemonic, setWM] = useLocalStorage<string>('walletMnemonic', '');
    const [privateKey, setPK] = useLocalStorage<string>('privateKey', '');
    const router = useRouter();

    useEffect(() => {
        if (!!(walletMnemonic || privateKey)) {
            router.push("/");
        }
    }, [walletMnemonic, privateKey])

    return (
        <RootLayout>
            {/* <GlobalNavbar/> */}
            <AnimatePresence>
                <div className="pt-5 pb-12 auth-flex">{children}</div>
            </AnimatePresence>
        </RootLayout>

    )
}

export default AuthLayout