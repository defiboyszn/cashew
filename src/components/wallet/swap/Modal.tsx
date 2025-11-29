import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react';
import Icon from "@/components/global/icons";


export const TokenSwapModal = ({ isOpen, onClose, swappableTokens, enableToken }: any) => {
    const [filteredToken, setFilteredToken] = useState({} as any);
    const [selectedToken, setSelectedToken] = useState(swappableTokens as any);

    useEffect(()=> {
        setSelectedToken(swappableTokens)
    },[swappableTokens])

    const handleTokenClick = (token: any) => {
        setFilteredToken(token);
        enableToken(token)
        onClose();
        // You can perform the swap logic here or trigger it in your main application.
    };

    const handleSearch = (text: string) => {
        setSelectedToken(swappableTokens.filter((data: any) => data.name.includes(text) || data.symbol.includes(text)))
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-[99999] inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 filter drop-shadow-md" />
                <div className="z-[9999] mx-4 sm:mx-0 p-4 font-gt-regular bg-[#fff] rounded-2xl shadow-lg w-[440px] h-full pb-2">
                    <Dialog.Title className="text-lg font-medium">
                        <div
                            className="rounded-t-box flex flex-row items-center justify-between px-4"
                            style={{ height: 60, paddingTop: 3, paddingBottom: 6 }}
                        >
                            {/* <span
                                className="flex min-w-[65px] flex-row items-center justify-start"
                            >
                                <span className="flex flex-row gap-3 text-sm">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="transition-all group flex items-center justify-center rounded-full text-[rgba(255,255,255,0.6)]"
                                    >
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth={0}
                                            viewBox="0 0 320 512"
                                            className="transition-all"
                                            height={20}
                                            width={20}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
                                        </svg>
                                    </button>
                                </span>
                            </span> */}
                            <span
                                className="text-xl font-semibold font-gt-bold"
                                style={{ color: "#111" }}
                            >
                                Select asset
                            </span>
                            <button
                                onClick={onClose}
                                className="flex min-w-[65px] flex-row items-center justify-end">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <g id="tabler-icon-x">
                                        <path
                                            id="Vector"
                                            d="M18 6L6 18M6 6L18 18"
                                            stroke="#101828"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                </svg>

                            </button>
                        </div>

                    </Dialog.Title>
                    <div className="mt-2">
                        <div>
                            <div className="flex flex-row items-center gap-2 p-3 text-lg">
                                <div className="relative flex w-full items-center">
                                    <span className="absolute left-[13px] flex items-center">
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth={0}
                                            viewBox="0 0 24 24"
                                            className="text-[#8363EE] w-5 h-5"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search name or paste address"
                                        className=" border-2 border-gray-300 h-[48px] max-h-[48px] w-full rounded bg-transparent py-2 pl-[35px] text-lg text-[#111] outline-none focus:outline-none"
                                        onChange={(e) => handleSearch(e.target.value)}
                                        style={{ borderRadius: 24 }}
                                    />
                                </div>
                            </div>

                        </div>
                        <ul className="!text-black">
                            {(selectedToken || swappableTokens).map((token: any) => (
                                <li className="flex w-full items-center min-h-[66px]">
                                    <button
                                        key={token.name}
                                        onClick={() => handleTokenClick(token)}
                                        type="button"
                                        className="mb-0 flex h-full w-full flex-row items-center justify-center px-5 hover:bg-base-200 gap-3"
                                    >
                                        <span className="relative flex h-10 w-10 flex-col items-center justify-center p-1.5">
                                            <span className="relative flex items-center justify-center p-1 w-[44px] h-[44px]">
                                                <Icon className="h-auto w-10 bg-base-100 bg-opacity-60 rounded-full" name={token.symbol?.toLowerCase() === "wtlos" ? "tlos" : token.symbol?.toLowerCase()} cName={token?.name} />
                                            </span>
                                        </span>
                                        <span
                                            className="flex w-full flex-row items-center justify-between text-base"
                                            style={{ lineHeight: "1.1rem" }}
                                        >
                                            <span className="grow">
                                                <span className="flex w-full flex-row items-center justify-between">
                                                    <span className="flex flex-col items-start gap-1">
                                                        <span className="flex flex-row gap-1 font-semibold">
                                                            <span>{token.name}</span>
                                                        </span>
                                                        <span className="text-sm text-neutral-content">{token?.symbol}</span>
                                                    </span>
                                                    <span className="flex flex-col items-end gap-1" />
                                                </span>
                                            </span>
                                            {filteredToken === token ? <span className="ml-[20px]">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="none"
                                                    strokeWidth={2}
                                                    viewBox="0 0 24 24"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="grow-0 text-[hsl(181_59%_44%)]"
                                                    height={20}
                                                    width={20}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </span> : ''}

                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};