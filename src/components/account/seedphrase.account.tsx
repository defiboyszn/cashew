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

  //   const allSeedWords = decryptWithPassphrase(seed, authPassword).split(" ");

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
    }, 500); // Use a minimal delay of 0 milliseconds
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

  return (
    <>
      {locked ? (
        <div className="flex flex-col items-center">
          <form
            onSubmit={(e) => unlock(e)}
            className="flex flex-col items-center w-full gap-6"
          >
            <div className="w-full">
              <p className="text-[28px] text-cgray-900 font-medium leading-[56px]">
                Unlock Account
              </p>
              <p>Enter your password to see your seedphrase.</p>
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <p>Password</p>
              <div className="flex items-center p-[18px_16px] w-full rounded-[8px] border space-x-[8px]">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={see ? "text" : "password"}
                  className="outline-none w-full placeholder:text-[#667085]"
                  placeholder="Enter secure password"
                />
                <button type="button" onClick={() => setSee(!see)}>
                  {see ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>

            <button className="w-full text-base font-medium leading-tight text-center text-violet-100  mt-8 py-[18px] bg-violet-500 rounded-lg justify-center items-center gap-2 inline-flex">
              {loading && (
                <span className="border-x-white mr-1 w-4 animate-spin h-4 opacity-60 border-4 rounded-full border-y-primary-light/40"></span>
              )}
              <span>Continue</span>
            </button>
          </form>
        </div>
      ) : (
        <motion.div
          className="flex flex-col w-full pb-4 sm:pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="sticky z-10 pt-5 pb-3 top-20 bg-cgray-25">
            <Back />
            <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
              <h1 className="self-stretch text-cgray-900 text-[28px] font-medium leading-9">
                Profile
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center ">
            <div className="">
              <p className="text-[28px] font-medium leading-[56px] text-cgray-900">
                Backup seed phrase
              </p>
              <p>
                Your seed phrase acts as the key to your wallet. You must store
                it somewhere secure, such as a password manager. This phrase
                would allow you to recover your wallet and funds if lost.{" "}
              </p>

              <div className="mt-4">
                <div className="min-h-[180px] resize-none p-1 py-4 w-full border rounded-[8px] content-center flex items-center justify-center">
                  <div className="text-center">
                    {allSeedWords.map((word, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && index % 4 === 0 && (
                          <div className="mb-3"></div>
                        )}
                        <span className="inline-block p-1 my-1 ml-2 text-xs text-center rounded-full cursor-pointer sm:text-sm bg-cgray-100">
                          <span className="pr-1 font-medium">{index + 1}:</span>
                          {word}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="w-full flex flex-col pt-5 space-y-[8px]">
                  <button
                    className="p-[18px_16px] border border-primary text-primary w-full rounded-[8px]"
                    type="button"
                    onClick={() => copyToClipboard(allSeedWords.join(" "))}
                  >
                    Copy seed phrase as text
                  </button>
                  <button
                    type="button"
                    className="p-[18px_16px] bg-primary text-white rounded-[8px] w-full mt-[16px]"
                    onClick={() => go_back()}
                  >
                    Okay, I've copied it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default SeedComp;
