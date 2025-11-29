import { Back } from "../global/back.global";
import copy from '../../assets/icons/copy.svg'
import copied_img from '../../assets/icons/copied.svg'
import info from '../../assets/icons/info.svg'
import send from '@/assets/logos/send-rounded-bordered.svg'
import { useState } from "react";
import dynamic from 'next/dynamic'
import useLocalStorage from "@/app/hooks/useLocalStorage";
import Address from "@/components/global/address.global"
import { motion } from "framer-motion";
import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { toast } from 'react-toastify';

// noinspection TypeScriptValidateTypes
const QrCodeComponent = dynamic(() => import('@/components/wallet/qrcode'), {
    ssr: false,
});

export function ReceiveTokens(props: any) {

    const [copied, setCopied] = useState<boolean>(false);
    const [pubKey,] = useLocalStorage("pubKey", "");
    const [network] = useLocalStorage<any>('network', networkSettings[defaultNetwork]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                toast.success("Copied")
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(error => {
                console.error('Error copying to clipboard:', error);
            });
    };

    return (
        <>
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
                        <h1 className="text-4xl font-black text-black capitalize">
                            Receive {props.symbol}
                        </h1>
                        <p className="text-gray-600 font-medium mt-2">
                            Scan QR code or copy address to receive funds
                        </p>
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
                        {/* QR Code Section */}
                        <div className="p-8 bg-gradient-to-br from-purple-100 to-blue-100 flex justify-center items-center border-b-4 border-black">
                            <div className="bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <QrCodeComponent data={pubKey} url={send.src} />
                            </div>
                        </div>

                        {/* Address Section */}
                        <button 
                            onClick={() => copyToClipboard(pubKey)}
                            className="w-full p-6 bg-white hover:bg-yellow-50 transition-colors text-left"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        {props.symbol} Address
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-black text-lg break-all">
                                            <Address address={pubKey} />
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-cyan-300 border-3 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                        {copied ? (
                                            <img src={copied_img?.src} alt="Copied" className="w-6 h-6" />
                                        ) : (
                                            <img src={copy?.src} alt="Copy" className="w-6 h-6" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Warning Card */}
                    <div className="bg-orange-100 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-orange-300 rounded-full border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <img src={info?.src} alt="Info" className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-black text-black mb-2 text-lg">⚠️ Important</h3>
                                <p className="text-gray-800 font-medium leading-relaxed">
                                    Send only <span className="font-black text-black">{props.symbol}</span> on the{" "}
                                    <span className="font-black text-black">{network?.name}</span> network to this address. 
                                    Sending any other token to this address may result in{" "}
                                    <span className="font-black text-red-600">permanent loss of your funds</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                   
                </div>
            </motion.div>
        </>
    )
}