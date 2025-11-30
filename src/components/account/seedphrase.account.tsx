import { useEffect, useState } from "react";
import { Back } from "../global/back.global";
import { motion } from "framer-motion";
import { Avatar } from "./dropdown";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import React from "react";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import { decryptWithPassphrase } from "@/app/utils/functions";
import PinCodeComp from "./pincode.account";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function SeedComp({}: {}) {
  const [seed] = useLocalStorage<string>("walletMnemonic", "");
  const [authPassword, setAuthPassword] = useBrowserSession<string>(
    "authPassword",
    ""
  );

  const [allSeedWords, setAllSeedWords] = useState([""]);
  const [error, setError] = useState<string>("");
  const [see, setSee] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotModal, setForgotModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [locked, setLocked] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const router = useRouter();

  const go_back = () => router.back();

  const unlock = (e: any) => {
    setLoading(true);
    setTimeout(async () => {
      if (password === "") {
        setError("Password cannot be empty");
        setLoading(false);
        return;
      }
      try {
        const dec = await decryptWithPassphrase(seed, password);
        setAllSeedWords(dec.split(" "));
        if (!dec) {
          setError("Incorrect Password");
        } else {
          setLocked(false);
        }
      } catch (e) {
        setError("Incorrect Password");
      }

      setLoading(false);
    }, 500);
    e.preventDefault();
  };

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [password]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success("Copied");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  const handleUnlockClick = () => {
    unlock({ preventDefault: () => {} });
  };

  return (
    <>
      {locked ? (
        <motion.div 
          className="flex flex-col w-full min-h-screen pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="max-w-2xl mx-auto w-full px-4 py-8">
            <div className="mb-6">
              <Back onBack={go_back} />
            </div>

            <div className="flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                        {/* Lock Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-purple-300 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={40}
                                    height={40}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                                        fill="black"
                                        stroke="black"
                                        strokeWidth={2}
                                    />
                                    <path
                                        d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11M5 11H19C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11Z"
                                        stroke="black"
                                        strokeWidth={2.5}
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-black mb-2">Unlock Account</h1>
                            <p className="text-gray-600 font-medium">
                                Enter your password to unlock
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={(e) => unlock(e)} className="space-y-6">
                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={see ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-4 pr-12 text-lg font-bold border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 bg-gray-50 text-black placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSee(!see)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-cyan-300 border-2 border-black rounded-lg hover:bg-cyan-400 transition-colors"
                                    >
                                        {see ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                                        ⚠️ {error}
                                    </p>
                                )}
                            </div>

                            {/* Unlock Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-purple-400 hover:bg-purple-500 disabled:bg-gray-300 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <span className="border-x-black w-5 animate-spin h-5 border-4 rounded-full border-y-purple-200"></span>
                                )}
                                {loading ? "Unlocking..." : "Unlock Account"}
                            </button>
                        </form>

                        {/* Forgot Password Link */}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setForgotModal(true)}
                                className="text-purple-600 hover:text-purple-800 font-bold text-sm underline decoration-2 hover:decoration-4 transition-all"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-100 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-6">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-400 rounded-full border-3 border-black flex items-center justify-center">
                                    <span className="text-xl">🔒</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-black text-black mb-2">Security Notice</h4>
                                <p className="text-sm text-gray-700 font-medium">
                                    Your account has been locked for security. Enter your password to continue using the wallet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col w-full min-h-screen pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="max-w-2xl mx-auto w-full px-4 py-8">
            <div className="mb-6">
              <Back onBack={go_back} />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-black mb-2">
                Backup Seed Phrase
              </h1>
              <p className="text-gray-600 font-medium">
                Your seed phrase acts as the key to your wallet. You must store
                it somewhere secure, such as a password manager. This phrase
                would allow you to recover your wallet and funds if lost.
              </p>
            </div>

            {/* Seed Phrase Display Card */}
            <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
              {/* Warning Banner */}
              <div className="mb-6 p-4 bg-orange-200 border-3 border-black rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-black text-black mb-1">Keep it Secret!</p>
                    <p className="text-sm font-medium text-gray-800">
                      Never share your seed phrase with anyone. Store it safely offline.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seed Words Grid */}
              <div className="min-h-[200px] p-6 bg-yellow-50 border-3 border-black rounded-xl mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {allSeedWords.map((word, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-300 border-2 border-black rounded-full text-xs font-black">
                        {index + 1}
                      </span>
                      <span className="font-bold text-black truncate">{word}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => copyToClipboard(allSeedWords.join(" "))}
                  className="w-full py-4 bg-blue-300 hover:bg-blue-400 text-black font-black text-base border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                  {copied ? "Copied!" : "Copy Seed Phrase as Text"}
                </button>

                <button
                  type="button"
                  onClick={() => go_back()}
                  className="w-full py-4 bg-green-400 hover:bg-green-500 text-black font-black text-base border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
                >
                  ✓ Okay, I've Copied It
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default SeedComp;