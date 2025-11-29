import { ReactNode, useEffect, useState } from 'react';
import { Back } from '../global/back.global';
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultNetwork, defaultTokens, networkSettings } from '@/app/config/settings';
import { getNativeBalance } from '@/app/contracts/native';
import { getTokenBalance } from '@/app/contracts/erc20';
import useLocalStorage from '@/app/hooks/useLocalStorage';
import { getDomainAddress } from '@/app/contracts/dns';
import { isValidWalletAddress } from '@/app/utils/functions';
import { useForm } from 'react-hook-form';
import SwapDropdown from './swap/dropdown';
import useTokenList from '@/app/hooks/useTokens';
import { TokenSwapModal } from './swap/Modal';
import Icon from '../global/icons';
type Props = {

}


function SwapComp(props: Props) {
    const [balance, setBalance] = useState(0);
    const [toToken, setToToken] = useState(0);
    const [network] = useLocalStorage<any>('network', networkSettings[defaultNetwork]);
    const [pubKey] = useLocalStorage<string>('pubKey', '');
    const [symbol, setSymbol] = useState(network?.symbol);
    const { tokenList, filterTokens } = useTokenList({ network: network?.name });
    const [fromModal, setFromModal] = useState(false)
    const [toModal, setToModal] = useState(false)
    const [selectedFromToken, setSelectedFromToken] = useState(tokenList[0]);
    const [selectedToToken, setSelectedToToken] = useState(tokenList[tokenList.length > 2 ? 2 : 1]);
    const [from, setFrom] = useState({ symbol: tokenList[0]?.symbol, bal: 0, address: tokenList[0]?.address });
    const [to, setTo] = useState({ symbol: tokenList[tokenList.length > 2 ? 2 : 1]?.symbol, bal: 0, address: tokenList[tokenList.length > 2 ? 2 : 1]?.address });

    useEffect(() => {
        const updateBalance = async () => {
            const from_bal = tokenList[0]?.address === "" ? await getNativeBalance(pubKey, network?.name) : await getTokenBalance(tokenList[0]?.address as string, pubKey, network?.name)
            setFrom({ symbol: tokenList[0]?.symbol, bal: from_bal, address: tokenList[0]?.address });
            const bal = tokenList[tokenList.length > 2 ? 2 : 1]?.address === "" ? await getNativeBalance(pubKey, network?.name) : await getTokenBalance(tokenList[tokenList.length > 2 ? 2 : 1]?.address as string, pubKey, network?.name)
            setTo({ symbol: tokenList[tokenList.length > 2 ? 2 : 1]?.symbol, bal, address: tokenList[tokenList.length > 2 ? 2 : 1]?.address });
        }

        // Make sure tokenList is available before updating state
        if (tokenList.length > 0) {
            setSelectedFromToken(tokenList[0])
            setSelectedToToken(tokenList[tokenList.length > 2 ? 2 : 1])
            updateBalance().then();
        }
    }, [tokenList[0]]);

    // useEffect(() => {
    //     setSelectedFromToken(tokenList[0])
    //     setSelectedToToken(tokenList[3])
    // }, [pubKey])

    const SendValidationSchema = z.object({
        amount: z.number().min(0, { message: "Amount must be greater than 0" }).refine((value) => value > 0, {
            message: "Amount must be greater than 0",
        }).refine(value => {
            return value <= balance
        }, { message: "Insufficient balance" }),
    });
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({ resolver: zodResolver(SendValidationSchema) });


    const switchTokens = () => {
        // Swap the values of 'from' and 'to'
        const temp = Number(getValues()?.amount);
        setValue("amount", toToken);
        setToToken(temp)
        const temp1 = selectedFromToken;
        setSelectedFromToken(selectedToToken);
        setSelectedToToken(temp1);
    }




    // const [searchTerm, setSearchTerm] = useState<string>("");
    return (
        <>
            <TokenSwapModal swappableTokens={tokenList} isOpen={fromModal} onClose={() => setFromModal(!fromModal)} enableToken={(token: any) => setSelectedFromToken(token)} />
            <TokenSwapModal swappableTokens={tokenList} isOpen={toModal} onClose={() => setToModal(!toModal)} enableToken={(token: any) => setSelectedToToken(token)} />
            <motion.div className="flex flex-col w-full pb-4 sm:pt-12" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <div className="sticky z-10 pt-5 pb-3 top-20 bg-cgray-25">
                    <Back />
                    <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
                        <h1 className="self-stretch text-cgray-900 text-[28px] font-medium leading-9">Swap assets</h1>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center w-full gap-6">
                            <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
                                <div
                                    className={`self-stretch px-4 py-2 bg-white rounded-lg border-2 justify-start items-center gap-2 flex flex-col`}>
                                    <div
                                        className={`px-4 py-2 rounded-lg w-full justify-start items-center sm:gap-2 inline-flex`}>
                                        <input type="number"
                                            placeholder="From" {...register("amount", {
                                                valueAsNumber: true, required: true
                                            })} defaultValue={0} min={0}
                                            className="text-2xl appearance-none w-full leading-tight text-gray-500 grow shrink focus:outline-none basis-0" />
                                        <div className="flex items-start justify-start gap-2">
                                            <button
                                                onClick={() => setFromModal(true)}
                                                className="flex gap-2 items-center px-2 py-2 rounded-lg text-gray-700 font-semibold focus:outline-none"
                                            >
                                                <Icon className="h-auto w-10 bg-base-100 bg-opacity-60 rounded-full" name={selectedFromToken?.symbol?.toLowerCase()} cName={selectedFromToken?.name} />
                                                <span className={"inline"}>{(selectedFromToken?.address === "" ? network?.symbol : selectedFromToken?.symbol) || (network?.symbol)}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-6 h-6 ${fromModal ? "transform rotate-180" : ""}`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>

                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex w-full flex-row justify-between items-end">
                                        <div
                                            className="self-stretch text-sm leading-tight text-gray-800"></div>
                                        <div
                                            className="self-stretch text-sm leading-tight text-gray-800">Bal: {(from.bal as any)} {selectedFromToken?.symbol !== "" ? selectedFromToken?.symbol : symbol}</div>
                                    </div>
                                </div>
                                {(errors.amount) &&
                                    <div
                                        className="text-red-500 text-sm">{errors.amount.message as ReactNode}</div>}
                            </div>
                        </div>



                        <div className="relative flex flex-col justify-center items-center">
                            <div onClick={switchTokens} className={"absolute cursor-pointer w-11 h-11 p-2.5 bg-white rounded-3xl border-2 border-gray-300 justify-center items-center gap-2.5 inline-flex"}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={30}
                                    height={30}
                                    viewBox="0 0 24 25"
                                    fill="none"
                                >
                                    <g id="tabler-icon-switch-vertical">
                                        <path
                                            id="Vector"
                                            d="M3 8.02246L7 4.02246M7 4.02246L11 8.02246M7 4.02246V13.0225M13 16.0225L17 20.0225M17 20.0225L21 16.0225M17 20.0225V10.0225"
                                            stroke="#8363EE"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                </svg>

                            </div>
                        </div>




                        <div className="flex flex-col items-center w-full gap-6 mt-3">
                            <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
                                <div
                                    className={`self-stretch px-4 py-2 bg-[#FAFAFA] rounded-lg border-2 justify-start items-center gap-2 flex flex-col`}>
                                    <div
                                        className={`px-4 py-2 rounded-lg w-full justify-start items-center sm:gap-2 inline-flex`}>
                                        <input type="number"
                                            placeholder="" disabled value={toToken} min={0}
                                            onChange={(e) => setToToken(Number(e.target.value))}
                                            className="text-2xl appearance-none w-full leading-tight disabled:bg-transparent text-gray-500 grow shrink focus:outline-none basis-0" />
                                        <div className="flex items-start justify-start gap-2">
                                            <button
                                                onClick={() => setToModal(true)}
                                                className="flex gap-2 items-center px-2 py-2 rounded-lg text-gray-700 font-semibold focus:outline-none"
                                            >
                                                <Icon className="h-auto w-10 bg-base-100 bg-opacity-60 rounded-full" name={selectedToToken?.symbol?.toLowerCase()} cName={selectedToToken?.name} />
                                                <span className={"inline"}>{(selectedToToken?.address === "" ? network?.symbol : selectedToToken?.symbol) || (network?.symbol)}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-6 h-6 ${toModal ? "transform rotate-180" : ""}`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>

                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex w-full flex-row justify-between items-end">
                                        <div
                                            className="self-stretch text-sm leading-tight text-gray-800"></div>
                                        <div
                                            className="self-stretch text-sm leading-tight text-gray-800">Bal: {(to.bal as any)} {selectedToToken?.symbol !== "" ? selectedToToken?.symbol : symbol}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full mt-2 px-4 py-5 bg-primary rounded-lg justify-center items-center gap-2 inline-flex">
                            {/* {loading && <span
                                className="border-x-white mr-1 w-4 animate-spin h-4 opacity-60 border-4 rounded-full border-y-primary-light/40"></span>} */}
                            <p className="text-base font-medium leading-tight text-center text-violet-100">Swap</p>
                        </button>
                    </div>

                </div>
            </motion.div >
        </>
    );
}

export default SwapComp;
