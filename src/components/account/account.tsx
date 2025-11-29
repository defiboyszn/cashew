import { useState } from 'react';
import { Back } from '../global/back.global';
import { motion } from "framer-motion";
import { Avatar } from './dropdown';

function AccountComp({ username }: {
    username: string
}) {
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
                        <h1 className="text-4xl font-black text-black mb-2">Profile</h1>
                        <p className="text-gray-600 font-medium">
                            Your account information
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 overflow-hidden flex items-center justify-center">
                                    <Avatar username={username} width="110" height="110" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-full border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M5 13L9 17L19 7"
                                            stroke="black"
                                            strokeWidth={3}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-purple-200 border-2 border-black px-4 py-2 rounded-full">
                                <span className="text-black text-sm font-bold uppercase tracking-wider">
                                    Verified Account
                                </span>
                            </div>
                        </div>

                        {/* Username Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-black uppercase tracking-wide">
                                Username
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-4 text-lg font-bold border-4 border-black rounded-xl bg-gray-100 text-black cursor-not-allowed"
                                    disabled
                                    value={username.replace(".camp.send", "")}
                                />
                                <div className="px-4 py-4 bg-cyan-300 border-4 border-black rounded-xl font-black text-black whitespace-nowrap">
                                    .camp.send
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600 mt-2">
                                Your unique username on the platform
                            </p>
                        </div>
                    </div>

                    {/* Account Stats Card */}
                    <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                        <div className="mb-4">
                            <div className="inline-flex items-center gap-2 bg-blue-200 border-2 border-black px-3 py-2 rounded-lg">
                                <span className="text-xl">📊</span>
                                <span className="text-black text-sm font-bold uppercase tracking-wider">
                                    Account Details
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Full Username */}
                            <div className="flex justify-between items-center py-3 border-b-3 border-gray-200">
                                <span className="font-bold text-gray-700">Full Username</span>
                                <span className="font-black text-black">{username}</span>
                            </div>

                            {/* Status */}
                            <div className="flex justify-between items-center py-3">
                                <span className="font-bold text-gray-700">Status</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                                    <span className="font-black text-black">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-yellow-100 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-6">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-yellow-400 rounded-full border-3 border-black flex items-center justify-center">
                                    <span className="text-xl">ℹ️</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-black text-black mb-2">About Your Username</h4>
                                <p className="text-sm text-gray-700 font-medium">
                                    Your username is unique and cannot be changed. It's used to identify your account across the platform and can be shared with others to receive funds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default AccountComp;