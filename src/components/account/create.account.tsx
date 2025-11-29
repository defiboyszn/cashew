import React, { useState } from "react";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import GlobalLoading from "../global/loading.global";
import SeedPhraseInput from "./import.components/seedphrase";
import {
  downloadWordsAsTxt,
  encryptWithPassphrase,
  isValidDomainName,
} from "@/app/utils/functions";
import axios from "axios";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkDomain } from "@/app/contracts/dns";
import { z, ZodType } from "zod";
import { AccountValidationSchema } from "@/app/utils/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function RegisterComp() {
  const [formStep, setFormStep] = useState(0);
  const [seedErrors, setSeedErrors] = useState<{ terms: string; seed: string }>({
    terms: "You must accept terms",
    seed: "The seed phrase selection is required",
  });
  const [see, setSee] = useState(false);
  const [allSeedWords, setAllSeedWords] = useState<string[]>([]);
  const router = useRouter();
  const [attemptedForm2Submit, setAttemptedForm2Submit] = useState<boolean>(false);

  const [, setWalletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const [, setPubKey] = useLocalStorage<string | undefined>("pubKey", undefined);
  const [, setAuthPassword] = useBrowserSession<string>("authPassword", "");

  const generateWallet = () => {
    const mnemonic = generateMnemonic(english);
    setAllSeedWords(mnemonic.split(" "));
  };

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
        message: "Invalid username. username cannot have special characters, and cannot start or end with an hyphen",
      }
    )
    .refine(
      async (data) => {
        const domainAddress = await checkDomain(data.username);
        return parseInt(domainAddress) === 0;
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
    formState: { errors },
  } = useForm<AccountValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const submit = async (data: { username: string; password: string }) => {
    const { username, password } = data;
    if (formStep > 2 && username !== "") {
      const account = mnemonicToAccount(allSeedWords.join(" "));
      axios
        .post("/api/wallet", { address: account.address, username: username.toLowerCase() })
        .then((response) => {
          if (response.status === 200) {
            setPubKey(account.address);
            setWalletMnemonic(encryptWithPassphrase(allSeedWords.join(" "), password));
            setAuthPassword(password);
            router.push("/");
          }
        });
      setFormStep((curr) => curr + 1);
    } else {
      alert("Username is empty");
    }
  };

  const stepAction = () => {
    if (formStep === 0) {
      generateWallet();
    }
    if (formStep === 2) {
      setAttemptedForm2Submit(true);
      if (seedErrors.seed || seedErrors.terms) {
        return;
      }
      setFormStep((curr) => curr + 1);
    } else if (formStep === 3) {
      return;
    } else {
      setFormStep((curr) => curr + 1);
    }
    if (formStep !== 2) {
      setAttemptedForm2Submit(false);
    }
    return;
  };

  const renderButton = () => {
    if (formStep === 0) {
      return (
        <button
          type="button"
          className="w-full py-4 bg-purple-400 hover:bg-purple-500 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
          onClick={stepAction}
        >
          Create My Wallet
        </button>
      );
    } else if (formStep === 1) {
      return (
        <div className="w-full flex flex-col gap-3">
          <button
            className="w-full py-4 bg-cyan-300 hover:bg-cyan-400 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
            type="button"
            onClick={() => downloadWordsAsTxt(allSeedWords, "seed-phrase.txt")}
          >
            📥 Download Seed Phrase
          </button>
          <button
            type="button"
            className="w-full py-4 bg-green-400 hover:bg-green-500 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
            onClick={stepAction}
          >
            ✓ Saved Securely
          </button>
        </div>
      );
    } else if (formStep === 2) {
      return (
        <button
          type="button"
          className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
          onClick={stepAction}
        >
          Continue →
        </button>
      );
    } else if (formStep === 3) {
      return (
        <button
          type="submit"
          className="w-full py-4 bg-purple-400 hover:bg-purple-500 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide"
          onClick={handleSubmit(submit)}
        >
          🚀 Get Started
        </button>
      );
    } else {
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          {/* Step 0: Welcome */}
          {formStep === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-black text-black mb-2">
                  Get Started 🎉
                </h1>
                <p className="text-gray-600 font-medium">
                  Create your Cashew by Sendtokens account in minutes
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Backup Seed Phrase */}
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
                <h2 className="text-3xl font-black text-black mb-2">
                  🔐 Backup Seed Phrase
                </h2>
                <p className="text-gray-600 font-medium">
                  Your seed phrase is the key to your wallet. Store it securely! Never share it with anyone.
                </p>
              </div>

              <div className="bg-yellow-100 border-4 border-black rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allSeedWords.map((word, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-black px-3 py-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-black text-center"
                    >
                      <span className="text-xs text-gray-600 mr-1">{index + 1}.</span>
                      {word}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-100 border-3 border-red-500 rounded-xl p-4">
                <p className="font-bold text-red-800 text-sm">
                  ⚠️ Never share your seed phrase! Anyone with these words can access your funds.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Verify Seed Phrase */}
          {formStep === 2 && (
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
                <h2 className="text-3xl font-black text-black mb-2">
                  ✓ Verify Seed Phrase
                </h2>
                <p className="text-gray-600 font-medium">
                  Select your seed phrase to verify you've backed it up correctly
                </p>
              </div>

              <SeedPhraseInput
                allSeedWords={allSeedWords}
                seedError={seedErrors.seed}
                attempt={attemptedForm2Submit}
                setAttemptedForm2Submit={setAttemptedForm2Submit}
                setSeedErrors={(val: string) =>
                  setSeedErrors({ ...seedErrors, seed: val })
                }
              />

              <div className="bg-blue-100 border-3 border-black rounded-xl p-4">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setAttemptedForm2Submit(false);
                      setSeedErrors({
                        ...seedErrors,
                        terms: e.target.checked ? "" : "You must accept terms",
                      });
                    }}
                    className="w-6 h-6 accent-purple-500 border-2 border-black rounded"
                  />
                  <span className="font-bold text-black text-sm">
                    I understand that if I lose my secret words, I will not be able to access my wallet
                  </span>
                </label>
                {seedErrors.terms && attemptedForm2Submit && (
                  <p className="mt-2 text-sm font-bold text-red-600 bg-red-100 border-2 border-red-500 px-3 py-1 rounded-lg inline-block">
                    ⚠️ {seedErrors.terms}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Complete Account Creation */}
          {formStep === 3 && (
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
                <h2 className="text-3xl font-black text-black mb-2">
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      {...register("username")}
                      placeholder="yourname"
                      className="flex-1 px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold text-black placeholder:text-gray-400"
                    />
                    <div className="px-4 py-3 bg-purple-300 border-4 border-black rounded-xl font-black text-black whitespace-nowrap flex items-center">
                      .camp.send
                    </div>
                  </div>
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
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={see ? "text" : "password"}
                      placeholder="Enter secure password"
                      className="w-full px-4 py-3 pr-12 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold text-black placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setSee(!see)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-cyan-300 border-2 border-black rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                      {see ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
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
                    className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold text-black placeholder:text-gray-400"
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

          {/* Step 4: Loading */}
          {formStep === 4 && (
            <div className="flex flex-col items-center justify-center py-12">
              <GlobalLoading />
              <p className="font-black text-black text-xl mt-6">
                Setting up your account...
              </p>
            </div>
          )}

          {/* Buttons */}
          {formStep !== 4 && (
            <div className="mt-8">
              {renderButton()}
            </div>
          )}

          {/* Import Wallet Option (Step 0) */}
          {formStep === 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-4 my-6">
                <div className="h-1 bg-black flex-1"></div>
                <span className="font-bold text-black uppercase text-sm">Or</span>
                <div className="h-1 bg-black flex-1"></div>
              </div>
              <Link
                href="/import"
                className="block w-full py-4 bg-white hover:bg-gray-100 text-black font-black text-lg border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wide text-center"
              >
                Import Existing Wallet
              </Link>
              <p className="text-center text-sm text-gray-600 font-medium mt-3">
                Already have a wallet? Import it here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterComp;