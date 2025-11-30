import RootLayout from "@/layout";
import AuthNavbar from "@/components/account/navbar.auth";
import { AnimatePresence, motion } from "framer-motion";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import { useEffect, useState } from "react";
import LockScreenPage from "@/components/wallet/screens/lockScreenPage";
import { useRouter } from "next/router";
import { NetworkComp } from "@/components/global/network";

const AccountLayout = function AccountLayout({ children }: any) {
  const [walletMnemonic, setWM] = useLocalStorage<string>("walletMnemonic", "");
  const [privateKey, setPK] = useLocalStorage<string>("privateKey", "");
  const [authPassword, setAuthPassword] = useBrowserSession<string>(
    "authPassword",
    ""
  );
  const [locked, setLocked] = useState<boolean>(false);
  const [inactiveMessage, setInactiveMessage] = useState<string>("");
  const router = useRouter();

  const timeoutDuration = 10 * 60 * 1000;
  let timeoutId: any;

  const resetTimeout = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setAuthPassword("");
      setInactiveMessage("Your session timed out due to inactivity");
      setLocked(true);
    }, timeoutDuration);
  };

  useEffect(() => {
    resetTimeout();
    const resetOnActivity = () => {
      resetTimeout();
    };
    window.addEventListener("mousemove", resetOnActivity);
    window.addEventListener("keydown", resetOnActivity);
    window.addEventListener("click", resetOnActivity);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetOnActivity);
      window.removeEventListener("keydown", resetOnActivity);
      window.removeEventListener("click", resetOnActivity);
    };
  }, [timeoutId]);

  useEffect(() => {
    setLocked(!authPassword && !!(walletMnemonic || privateKey));
    if (!(walletMnemonic || privateKey)) {
      router.push("/new");
    }
    if (!locked) {
      setInactiveMessage("");
      resetTimeout();
    }
  }, [locked, walletMnemonic, privateKey]);

  return (
    <RootLayout>
      <AuthNavbar
      />
      <AnimatePresence mode={"wait"}>
        <motion.div
          key={router.route}
          initial="initialState"
          animate="animateState"
          exit="exitState"
          transition={{
            type: "tween",
            duration: 0.5,
          }}
          variants={{
            initialState: {
              opacity: 0,
            },
            animateState: {
              opacity: 1,
            },
            exitState: {
              opacity: 0,
            },
          }}
          className="min-h-screen w-full pt-5"
        >
          <div className="max-w-2xl px-4 block mx-auto">
            {locked ? (
              <LockScreenPage
                inactiveMessage={inactiveMessage}
                setAuthPassword={setAuthPassword}
                setLocked={setLocked}
                setPrivateKey={setPK}
                setWalletMnemonic={setWM}
                cred={walletMnemonic ? walletMnemonic : privateKey}
              />
            ) : (
              children
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </RootLayout>
  );
};

export default AccountLayout;
