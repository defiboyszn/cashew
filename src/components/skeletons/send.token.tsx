import React from 'react';
import { Back } from "@/components/global/back.global";

const SkeletonLoader = (function SkeletonLoader() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 pb-8">
            <div className="max-w-2xl mx-auto w-full px-4 py-8">
                <div className="mb-6">
                    <div className="h-8 w-20 bg-gray-300 rounded-lg border-2 border-black animate-pulse"></div>
                </div>

                <div className="mb-8">
                    <div className="h-10 w-48 bg-gray-300 rounded-xl border-2 border-black mb-2 animate-pulse"></div>
                    <div className="h-5 w-64 bg-gray-200 rounded-lg border-2 border-black animate-pulse"></div>
                </div>

                {/* Main Form Card Skeleton */}
                <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 animate-pulse">
                    {/* Amount Input Skeleton */}
                    <div className="mb-6">
                        <div className="h-4 w-24 bg-gray-300 rounded-full border-2 border-black mb-2"></div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-16 bg-gray-200 rounded-xl border-3 border-black"></div>
                            <div className="w-20 h-16 bg-gray-300 rounded-xl border-3 border-black"></div>
                        </div>
                        <div className="h-3 w-32 bg-gray-200 rounded-full border-2 border-black mt-2"></div>
                    </div>

                    {/* Recipient Input Skeleton */}
                    <div className="mb-6">
                        <div className="h-4 w-20 bg-gray-300 rounded-full border-2 border-black mb-2"></div>
                        <div className="h-3 w-48 bg-gray-200 rounded-full border-2 border-black mb-2"></div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-14 bg-gray-200 rounded-xl border-3 border-black"></div>
                            <div className="w-14 h-14 bg-purple-300 rounded-xl border-3 border-black"></div>
                        </div>
                    </div>

                    {/* Continue Button Skeleton */}
                    <div className="w-full h-16 bg-pink-300 rounded-xl border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"></div>
                </div>
            </div>
        </div>
    );
});

export default SkeletonLoader;