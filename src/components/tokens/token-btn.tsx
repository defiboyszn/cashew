// TokensButton.tsx
import React, { useState, useEffect } from "react";
import Icon from "@/components/global/icons";
import NetworkIcon from "@/components/global/network.icon";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/app/utils/functions";
import { useDollar } from "@/utils/constants";
import { Token } from "@/app/hooks/useTokens";

interface TokensButtonProps {
    routePrefix?: string;
    data: Token;
    network: {
        symbol: string
        name: string
    };
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    see?: boolean
}

export const TokensButton: React.FC<TokensButtonProps> = ({ data, routePrefix, network, onClick, see }) => {
    const content = (
        <div className="flex flex-col gap-3">
            {/* Top Row: Icon, Name, Price */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {data.address === "" ?
                        <Icon className="w-8 h-8" name={network.symbol} cName={network?.name} /> :
                        <NetworkIcon cName={network?.name} network={network.symbol}
                            token={data.symbol.toLowerCase()} />}
                    <div className="flex flex-col text-left">
                        <p className="font-black text-black text-base">
                            {data?.name.toLowerCase() !== "ethereum" && data.symbol.toLowerCase() === "eth"
                                ? capitalizeFirstLetter("Ethereum")
                                : data?.name.toLowerCase() !== "ethereum" && data.symbol.toLowerCase() === "reeth"
                                    ? capitalizeFirstLetter("Real Ethereum")
                                    : capitalizeFirstLetter(data?.name)}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-600">
                                {useDollar(data?.usd)}
                            </p>
                            {data.value !== "+NaN%" && data?.pnl === "gain" ? (
                                <span className="text-xs font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full border-2 border-black">
                                    ↑ {data?.value}
                                </span>
                            ) : data.value !== "+NaN%" && data?.pnl === "lost" ? (
                                <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full border-2 border-black">
                                    ↓ {data?.value}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M9 6L15 12L9 18"
                        stroke="black"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Bottom Row: Balance & Value */}
            <div className="flex justify-between items-center pt-2 border-t-2 border-black">
                <div>
                    <p className="text-sm font-bold text-gray-600">Balance</p>
                    <p className="font-black text-black text-lg">
                        {see ? (data?.balance?.toLocaleString() + " " + data.symbol) : (Number(data?.balance?.toLocaleString()) > 3
                            ? "*".repeat(String(((data?.balance?.toLocaleString()))?.replace("$", "")).length)
                            : "*****")}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-600">Value</p>
                    <p className="font-black text-black text-lg">
                        {see ? useDollar(data?.balance * data?.usd) : (Number(data?.balance * data?.usd) > 3
                            ? `${"*".repeat(String((useDollar(data?.balance * data?.usd)?.replace("$", ""))).length)}`
                            : "*****")}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {routePrefix ? ((data.name && data.symbol) && (
                <Link href={`${routePrefix}/${data.address === "" ? 'native' : data.address}`}
                    className="block p-4 bg-white border-3 border-black hover:bg-yellow-50 transition-colors">
                    {content}
                </Link>
            )) : ((data.name && data.symbol) && (
                <button onClick={onClick} className="w-full p-4 bg-white border-3 border-black hover:bg-yellow-50 transition-colors text-left">
                    {content}
                </button>
            ))}
        </>
    )
}

export const TokensButton1: React.FC<TokensButtonProps> = ({ data, routePrefix, network, onClick, see }) => {
    const content = (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {data.address === "" ?
                    <Icon className="w-8 h-8" name={network.symbol} cName={network?.name} /> :
                    <NetworkIcon cName={network?.name} network={network.symbol}
                        token={data.symbol.toLowerCase()} />}
                <div className="flex flex-col text-left">
                    <p className="font-bold text-black text-sm">
                        {data?.name.toLowerCase() !== "ethereum" && data.symbol.toLowerCase() === "eth"
                            ? capitalizeFirstLetter("Ethereum")
                            : data?.name.toLowerCase() !== "ethereum" && data.symbol.toLowerCase() === "reeth"
                                ? capitalizeFirstLetter("Real Ethereum")
                                : capitalizeFirstLetter(data?.name)}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-gray-600">
                            {useDollar(data?.usd)}
                        </p>
                        {data.value !== "+NaN%" && data?.pnl === "gain" ? (
                            <span className="text-xs font-bold text-green-600">
                                ↑ {data?.value}
                            </span>
                        ) : data.value !== "+NaN%" && data?.pnl === "lost" ? (
                            <span className="text-xs font-bold text-red-600">
                                ↓ {data?.value}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-black text-sm">
                    {see ? (data?.balance?.toLocaleString() + " " + data.symbol) : (Number(data?.balance?.toLocaleString()) > 3
                        ? "*".repeat(String(((data?.balance?.toLocaleString()))?.replace("$", "")).length)
                        : "*****")}
                </p>
                <p className="text-xs font-medium text-gray-600">
                    {see ? useDollar(data?.balance * data?.usd) : (Number(data?.balance * data?.usd) > 3
                        ? `${"*".repeat(String((useDollar(data?.balance * data?.usd)?.replace("$", ""))).length)}`
                        : "*****")}
                </p>
            </div>
        </div>
    );

    return (
        <>
            {routePrefix ? ((data.name && data.symbol) && (
                <button className="w-full p-3 bg-white hover:bg-gray-50 transition-colors border-b-2 border-gray-200 last:border-b-0">
                    {content}
                </button>
            )) : ((data.name && data.symbol) && (
                <button onClick={onClick} className="w-full p-3 bg-white hover:bg-gray-50 transition-colors border-b-2 border-gray-200 last:border-b-0 text-left">
                    {content}
                </button>
            ))}
        </>
    )
}