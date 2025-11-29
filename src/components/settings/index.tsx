import { Back } from "../global/back.global";
import { motion } from "framer-motion";
import Link from "next/link";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { useState } from "react";
import Html5QrcodePlugin from "../global/qrscanner";
import { pair } from "@/app/utils/connect";
import { useRouter } from "next/router";

function SettingsComp() {
  const [$logout, setLogout] = useState<boolean>(false);
  const [qrModal, setQrModal] = useState(false);
  const [walletMnemonic, setWalletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const router = useRouter();
  const [privateKey, setPrivateKey] = useLocalStorage<string>("privateKey", "");

  const logout = () => {
    setWalletMnemonic("");
    setPrivateKey("");
    setLogout(false);
    router.push("/");
  };

  const openModal = () => {
    setQrModal(true);
  };

  const closeModal = () => {
    setQrModal(false);
  };

  const onNewScanResult = async (res: string) => {
    try {
      await pair({ uri: res });
    } catch (err: unknown) {
      alert(err);
    }
  };

  // Settings menu item component
  const SettingsItem = ({ 
    href, 
    icon, 
    title, 
    description, 
    onClick,
    isExternal = false,
    badge = null,
    iconBg = "bg-purple-300"
  }: any) => {
    const content = (
      <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${iconBg} border-2 border-black rounded-lg flex items-center justify-center group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-black text-base">{title}</h3>
            <p className="text-sm text-gray-600 font-medium">{description}</p>
          </div>
        </div>
        {badge || (
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <path d="M7.5 14.9999L12.5 9.99994L7.5 4.99994" stroke="black" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    );

    if (onClick) {
      return <button onClick={onClick} className="w-full text-left">{content}</button>;
    }

    return isExternal ? (
      <Link href={href} target="_blank">{content}</Link>
    ) : (
      <Link href={href}>{content}</Link>
    );
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {$logout && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-black/70 fixed inset-0 z-10" onClick={() => setLogout(false)}></div>
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20 max-w-[90%] w-[450px] p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-300 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-3xl font-black text-black mb-3">Remove Account?</h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                This will require you to re-import your mnemonic phrase or private key. Are you sure you want to continue?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-red-400 hover:bg-red-500 text-black font-black text-lg border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-wide"
                onClick={logout}
              >
                Remove
              </button>
              <button
                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-black font-black text-lg border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-wide"
                onClick={() => setLogout(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {qrModal && (
        <Html5QrcodePlugin
          fps={1}
          qrbox={250}
          disableFlip={false}
          close={closeModal}
          qrCodeSuccessCallback={onNewScanResult}
        />
      )}

      <motion.div
        className="flex flex-col w-full min-h-screen pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-2xl mx-auto w-full px-4 py-8">
          <div className="mb-6">
            <Back />
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-black text-black mb-2">Settings ⚙️</h1>
            <p className="text-gray-600 font-medium">Manage your account and preferences</p>
          </div>

          {/* General Section */}
          <div className="mb-8">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-blue-200 border-2 border-black px-3 py-2 rounded-lg">
                <span className="text-xl">👤</span>
                <span className="text-black text-sm font-bold uppercase tracking-wider">General</span>
              </div>
            </div>
            <div className="space-y-3">
              <SettingsItem
                href="/account"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z" />
                  </svg>
                }
                title="Personal Information"
                description="Manage your details"
                iconBg="bg-blue-300"
              />
              <div className="p-4 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-300 border-2 border-black rounded-lg flex items-center justify-center">
                      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                        <path d="M15.8327 17.4999L9.99935 13.3332L4.16602 17.4999V4.16658C4.16602 3.72455 4.34161 3.30062 4.65417 2.98806C4.96673 2.6755 5.39065 2.49991 5.83268 2.49991H14.166C14.608 2.49991 15.032 2.6755 15.3445 2.98806C15.6571 3.30062 15.8327 3.72455 15.8327 4.16658V17.4999Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-base">Add Wallet</h3>
                      <p className="text-sm text-gray-600 font-medium">Add a new wallet</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-200 border-2 border-black rounded-full font-bold text-black text-xs uppercase">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mb-8">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-green-200 border-2 border-black px-3 py-2 rounded-lg">
                <span className="text-xl">🔒</span>
                <span className="text-black text-sm font-bold uppercase tracking-wider">Security</span>
              </div>
            </div>
            <SettingsItem
              href="/settings/seed-phrase"
              icon={
                <svg width={20} height={20} viewBox="0 0 16 14" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1 2.73701V11.263C1.00159 11.7255 1.18689 12.1683 1.51511 12.4941C1.84332 12.8199 2.28755 13.0019 2.75 13H13.25C13.7124 13.0019 14.1567 12.8199 14.4849 12.4941C14.8131 12.1683 14.9984 11.7255 15 11.263V2.73701C14.9984 2.27457 14.8131 1.83171 14.4849 1.50593C14.1567 1.18015 13.7124 0.998154 13.25 1.00001H2.75C2.28755 0.998154 1.84332 1.18015 1.51511 1.50593C1.18689 1.83171 1.00159 2.27457 1 2.73701Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 5.85498C15.4142 5.85498 15.75 5.51919 15.75 5.10498C15.75 4.69077 15.4142 4.35498 15 4.35498V5.85498ZM1 4.35498C0.585786 4.35498 0.25 4.69077 0.25 5.10498C0.25 5.51919 0.585786 5.85498 1 5.85498V4.35498ZM8.875 8.93398C9.28921 8.93398 9.625 8.59819 9.625 8.18398C9.625 7.76977 9.28921 7.43398 8.875 7.43398V8.93398ZM1 7.43398C0.585786 7.43398 0.25 7.76977 0.25 8.18398C0.25 8.59819 0.585786 8.93398 1 8.93398V7.43398ZM12.375 8.93398C12.7892 8.93398 13.125 8.59819 13.125 8.18398C13.125 7.76977 12.7892 7.43398 12.375 7.43398V8.93398ZM11.5 7.43398C11.0858 7.43398 10.75 7.76977 10.75 8.18398C10.75 8.59819 11.0858 8.93398 11.5 8.93398V7.43398ZM15 4.35498H1V5.85498H15V4.35498ZM8.875 7.43398H1V8.93398H8.875V7.43398ZM12.375 7.43398H11.5V8.93398H12.375V7.43398Z" fill="currentColor" />
                </svg>
              }
              title="Seed Phrase"
              description="View your account details"
              iconBg="bg-green-300"
            />
          </div>

          {/* Support Section */}
          <div>
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-pink-200 border-2 border-black px-3 py-2 rounded-lg">
                <span className="text-xl">💬</span>
                <span className="text-black text-sm font-bold uppercase tracking-wider">Support</span>
              </div>
            </div>
            <div className="space-y-3">
              <SettingsItem
                onClick={() => setLogout(true)}
                icon={
                  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 17.4999H4.16667C3.72464 17.4999 3.30072 17.3243 2.98816 17.0118C2.67559 16.6992 2.5 16.2753 2.5 15.8333V4.16661C2.5 3.72458 2.67559 3.30065 2.98816 2.98809C3.30072 2.67553 3.72464 2.49994 4.16667 2.49994H7.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.334 14.1666L17.5007 9.99995L13.334 5.83328" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5 9.99994H7.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                title="Remove Account"
                description="Remove your account from this device"
                iconBg="bg-red-300"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default SettingsComp;