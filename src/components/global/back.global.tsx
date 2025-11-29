import { useRouter } from 'next/router';
import React from "react";


export function Back({ space = false, onBack }: { space?: boolean, onBack?: (go_back: () => void) => void }) {
    const router = useRouter();

    const go_back = () => router.back();

    return (

        <div onClick={onBack ? ()=> {
                onBack(go_back)
        } : go_back} className="cursor-pointer flex w-full items-center space-x-[8px]">
            <button type="button" className={`${space ? "px-4" : ""}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M5 12L9 16M5 12L9 8" stroke="#667085" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <p>Back</p>
        </div>
    )
}
