import search from '../../assets/icons/search.svg'
import { Back } from '../global/back.global';
import { TokensList } from "@/components/tokens/tokens.list";
import { useState } from "react";
import { routes } from "@/app/utils/routes";
import { motion } from "framer-motion";

function ReceiveComp() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    
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
                        <h1 className="text-4xl font-black text-black mb-2">
                            Select Asset
                        </h1>
                        <p className="text-gray-600 font-medium">
                            Choose which token you want to receive
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <div className="w-8 h-8 bg-green-300 rounded-full border-2 border-black flex items-center justify-center">
                                    <img src={search?.src} alt="Search" className="w-4 h-4" />
                                </div>
                            </div>
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                placeholder="Search for asset (e.g., CAMP, USDC)"
                                className="w-full pl-16 pr-4 py-4 text-lg font-bold border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 bg-white text-black placeholder:text-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                            />
                        </div>
                    </div>

                    {/* Tokens List Card */}
                    <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                       
                        
                        <TokensList searchTerm={searchTerm} routePrefix={routes.receive()} />
                    </div>

                    {/* Info Card */}
                    {!searchTerm && (
                        <div className="bg-purple-100 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-6">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-purple-400 rounded-full border-3 border-black flex items-center justify-center">
                                        <span className="text-xl">📱</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-black text-black mb-2">How to Receive</h4>
                                    <p className="text-sm text-gray-700 font-medium">
                                        Select an asset to view your wallet address and QR code. Share them with the sender to receive funds directly to your wallet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}

export default ReceiveComp;