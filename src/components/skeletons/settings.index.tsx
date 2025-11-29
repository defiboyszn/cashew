import React from 'react';
import { Back } from "@/components/global/back.global";
// import { block } from 'million/react';

const SkeletonLoader = (function SkeletonLoader() {
    return (
        <div className="flex flex-col w-full space-y-3 sm:pt-12">
            <div className="pt-5">
                <div className="inline-flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
                    <div className="h-7 w-20 bg-gray-200 rounded-xl"></div>
                </div>
            </div>

            <div className="flex flex-col items-center assets-container animate-pulse">
                <div className="h-[734px] w-full md:w-[414px] bg-gray-200 rounded-xl"></div>
            </div>
        </div>

    );
});

export default SkeletonLoader;
