import React from 'react';
import {Back} from "@/components/global/back.global";
// import { block } from 'million/react';

const SkeletonLoader = (function SkeletonLoader() {
    return (
        <div className="flex flex-col w-full space-y-3 sm:pt-12">
            <div className="pt-5">
                <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
                    <div className="h-7 w-20 bg-gray-200 rounded-xl"></div>
                </div>
            </div>

            <div className="flex flex-col items-center  animate-pulse">
                <div className="flex flex-col items-center w-full gap-6">
                    <div
                        className="w-full h-80 rounded-xl bg-gray-200 flex-col justify-start items-start gap-2 inline-flex">
                    </div>
                    <div className="w-full h-[84px] flex-col justify-start items-start gap-2 inline-flex">
                        <div className="h-16 w-full bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>

    );
});

export default SkeletonLoader;
