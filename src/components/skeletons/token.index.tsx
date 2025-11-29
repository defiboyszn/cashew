import React from 'react';
import { Back } from "@/components/global/back.global";
// import { block } from 'million/react';

const SkeletonLoader = (function SkeletonLoader() {
    return (
        <div className="flex flex-col w-full space-y-6 md:space-y-3 sm:pt-12 h-full">
            <div className="pt-5">
                <div className="flex animate-pulse flex-col md:flex-row items-center justify-center md:justify-between gap-2 mt-20 md:mt-5 mb-3 h-9">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="w-[198.09px] h-[60px] bg-gray-200 rounded-lg"></div>
                    <div className="flex flex-row gap-7 items-center">
                        <div className="w-[60px] h-[60px] md:w-[95.81px] md:h-[40px] bg-gray-200 rounded-full md:rounded-lg"></div>
                        <div className="w-[60px] h-[60px] md:w-[95.81px] md:h-[40px] bg-gray-200 rounded-full md:rounded-lg"></div>
                        <div className="w-[60px] h-[60px] md:w-[95.81px] md:h-[40px] bg-gray-200 rounded-full md:rounded-lg"></div>
                    </div>
                </div>
            </div>

            <div className="w-[90.81px] md:block hidden h-[20px] bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex flex-col items-center assets-container animate-pulse">
                <button className="w-full h-[81px] bg-gray-200"></button>
                <button className="w-full h-[81px] bg-gray-200"></button>
                <button className="w-full h-[81px] bg-gray-200"></button>
            </div>
        </div>

    );
});

export default SkeletonLoader;
