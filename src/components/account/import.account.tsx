import React, { useEffect, useState } from "react";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import GlobalLoading from "../global/loading.global";
import {
  encryptWithPassphrase,
  isValidDomainName,
  remove0xPrefix,
} from "@/app/utils/functions";
import axios from "axios";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import Link from "next/link";
import { checkDomain, getDomain } from "@/app/contracts/dns";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { Account } from "viem";
import { AccountValidationSchema } from "@/app/utils/types";
import { toast } from "react-toastify";

function ImportAccount() {
  const [formStep, setFormStep] = useState(0);
  const router = useRouter();
  const [see, setSee] = useState(false);
  const [allSeedWords, setAllSeedWords] = useState<string>("");
  const [isSeedPhrase, setIsSeedPhrase] = useState<boolean>(true);
  const [domainExists, setDomainExists] = useState<boolean>(false);
  const [keyError, setKeyError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [, setWalletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const [, setPrivateKey] = useLocalStorage<string>("privateKey", "");
  const [pubKey, setPubKey] = useLocalStorage<string | undefined>("pubKey", "");
  const [, setAuthPassword] = useBrowserSession<string>("authPassword", "");
  const [account, setAccount] = useState<Account | undefined>();

  const validationSchema: ZodType<AccountValidationSchema> = z
    .object({
      username: z.string().min(1, { message: "username is required" }),
      password: z.string().min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
    })
    .refine(
      async (data) => {
        return isValidDomainName(data.username);
      },
      {
        path: ["username"],
        message: "Invalid domain name. Domain cannot have special characters, and cannot start or end with an hyphen",
      }
    )
    .refine(
      async (data) => {
        const domainAddress = await checkDomain(data.username);
        return (
          (parseInt(domainAddress) !== 0 && domainExists) ||
          parseInt(domainAddress) === 0
        );
      },
      {
        path: ["username"],
        message: "Username is not available",
      }
    )
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Password do not match",
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const getAccount = () => {
    try {
      if (allSeedWords.split(" ").length > 1) {
        return mnemonicToAccount(allSeedWords);
      }
      setIsSeedPhrase(false);
      const key = remove0xPrefix(allSeedWords);
      return privateKeyToAccount(`0x${key}`);
    } catch (e) {
      setKeyError("Invalid Private Key or Seed Phrase");
    }
  };

  const seedIsValid = () => {
    try {
      getAccount();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getUsername = async () => {
    return await getDomain(account?.address);
  };

  useEffect(() => {
    const confirm = async () => {
      setLoading(true);
      const username = await getUsername();
      if (username.length > 0) {
        setDomainExists(true);
        setValue("username", username);
        setLoading(false);
      }
      setFormStep((curr) => curr + 1);
    };
    if (allSeedWords && formStep === 0 && seedIsValid()) {
      confirm().then();
    }
  }, [account]);

  const stepAction = async () => {
    if (formStep === 0) {
      setAccount(getAccount());
    }
  };

  const renderButton = () => {
    if (formStep === 0) {
      return (
        <button
          type="button"
          disabled={loading}
          className="w-full py-4 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide flex items-center justify-center gap-2"
          onClick={stepAction}
        >
          {loading && (
            <span className="border-x-black w-5 animate-spin h-5 border-4 rounded-full border-y-blue-200"></span>
          )}
          {loading ? "Importing..." : "📥 Import Wallet"}
        </button>
      );
    } else if (formStep === 1) {
      return (
        <button
          type="submit"
          className="w-full py-4 bg-purple-400 hover:bg-purple-500 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
          onClick={stepAction}
        >
          🚀 Get Started
        </button>
      );
    } else {
      return;
    }
  };

  const submit = async (data: { username: string; password: string }) => {
    const { username, password } = data;

    if (formStep > 0 && username.length > 0) {
      const domainAddress = await checkDomain(username);
      if (parseInt(domainAddress) !== 0 && !domainExists) {
        alert("unavailable");
        return;
      }
      console.log(domainAddress);
      
      axios
        .post("/api/wallet", { address: account?.address, username })
        .then((response) => {
          if (true) {
            if (isSeedPhrase) {
              setWalletMnemonic(encryptWithPassphrase(allSeedWords, password));
            }
            setPubKey(account?.address);
            setAuthPassword(password);
            router.push("/");
          }
        });
      setFormStep((curr) => curr + 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
          <form onSubmit={handleSubmit(submit)}>
            {/* Step 0: Import Wallet */}
            {formStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-black mb-2">
                    Import Wallet 📂
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Import your existing Cashew by Sendtokens wallet to continue
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    Seed Phrase (12 words)
                  </label>
                  <textarea
                    value={allSeedWords || ""}
                    onChange={(e) => setAllSeedWords(e.target.value)}
                    placeholder="Enter your 12-word seed phrase..."
                    rows={4}
                    className="w-full px-4 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-black placeholder:text-gray-400 resize-none"
                  />
                  {keyError && (
                    <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                      ⚠️ {keyError}
                    </p>
                  )}
                </div>

                <div className="bg-yellow-100 border-3 border-yellow-500 rounded-xl p-4">
                  <p className="font-bold text-yellow-800 text-sm">
                    ⚠️ Never share your seed phrase! Make sure you're entering it in a secure location.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Complete Account */}
            {formStep === 1 && (
              <div className="space-y-6">
                <button
                  type="button"
                  className="flex items-center gap-2 font-bold text-black hover:text-purple-600 transition-colors"
                  onClick={() => setFormStep((curr) => curr - 1)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M5 12L9 16M5 12L9 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">
                    👤 Complete Account
                  </h2>
                  <p className="text-gray-600 font-medium">
                    Choose your username and secure password
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Username
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly={domainExists}
                        type="text"
                        {...register("username")}
                        placeholder="yourname"
                        className={`flex-1 min-w-0 px-3 sm:px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold text-black placeholder:text-gray-400 ${
                          domainExists ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                      <div className="flex-shrink-0 px-2 sm:px-4 py-3 bg-purple-300 border-4 border-black rounded-xl font-black text-black text-xs sm:text-base whitespace-nowrap">
                        .camp.send
                      </div>
                    </div>
                    {domainExists && (
                      <p className="mt-2 text-sm font-bold text-green-600 bg-green-100 border-2 border-green-500 px-3 py-1 rounded-lg inline-block">
                        ✓ Username found for this wallet
                      </p>
                    )}
                    {errors.username && (
                      <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                        ⚠️ {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        {...register("password")}
                        type={see ? "text" : "password"}
                        placeholder="Enter secure password"
                        className="flex-1 min-w-0 px-3 sm:px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold text-black placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setSee(!see)}
                        className="flex-shrink-0 px-3 sm:px-4 py-3 bg-cyan-300 border-4 border-black rounded-xl hover:bg-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      >
                        {see ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                        ⚠️ {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Confirm Password
                    </label>
                    <input
                      {...register("confirmPassword")}
                      type={see ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="w-full px-3 sm:px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold text-black placeholder:text-gray-400"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                        ⚠️ {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Loading */}
            {formStep === 2 && (
              <div className="flex flex-col items-center justify-center py-12">
                <GlobalLoading />
                <p className="font-black text-black text-xl mt-6">
                  Importing your account...
                </p>
              </div>
            )}

            {/* Buttons */}
            {formStep !== 2 && (
              <div className="mt-8">
                {renderButton()}
              </div>
            )}

            {/* Generate New Wallet Option (Step 0) */}
            {formStep === 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-4 my-6">
                  <div className="h-1 bg-black flex-1"></div>
                  <span className="font-bold text-black uppercase text-sm">Or</span>
                  <div className="h-1 bg-black flex-1"></div>
                </div>
                <Link
                  href="/new"
                  className="block w-full py-4 bg-white hover:bg-gray-100 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide text-center"
                >
                  Generate New Wallet
                </Link>
                <p className="text-center text-sm text-gray-600 font-medium mt-3">
                  Don't have a wallet? Create a new one
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImportAccount;