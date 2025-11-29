import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import Icon from '@/components/global/icons';
import NetworkIcon from '@/components/global/network.icon';
import { getSymbol } from '@/app/contracts/erc20';

interface Option {
    symbol: string;
    name: string;
    value: string;
}

interface CustomDropdownProps {
    options: any;
    defaultValue?: string;
    onChange?: (value: string) => void;
    network?: any;
}

const SwapDropdown: React.FC<CustomDropdownProps> = ({ options, defaultValue, onChange, network, }) => {
    const [symbol, setSymbol] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [default_tokens, setDefaultTokens] = useState<any>({});
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setDefaultTokens(defaultValue?.toLowerCase() === "native" ? options.filter((data: any) => data?.symbol?.toLowerCase() === network.symbol?.toLowerCase())[0] : options.filter((data: any) => data?.symbol?.toLowerCase() === defaultValue?.toLowerCase())[0])
        setSeletedTokens(defaultValue?.toLowerCase() === "native" ? options.filter((data: any) => data?.symbol?.toLowerCase() === network.symbol?.toLowerCase())[0] : options.filter((data: any) => data?.symbol?.toLowerCase() === defaultValue?.toLowerCase())[0])
    }, [default_tokens])
    const [selected_tokens, setSeletedTokens] = useState<any>(default_tokens);

    const handleSelectChange = (value: any): void => {
        setSeletedTokens(value);
        setIsOpen(false);
        if (onChange) {
            onChange(value);
        }
    };


    const handleToggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent): void => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside as any);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as any);
        };
    }, []);


    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                onClick={handleToggleDropdown}
                className="flex gap-2 items-center px-2 py-2 rounded-lg text-gray-700 font-semibold focus:outline-none"
            >
                {/* {selected_tokens?.address === "" ?
                    <Icon name={network?.symbol} className="h-6 w-6 sm:h-4 sm:w-4" />
                    :
                    <NetworkIcon className="h-6 w-6 sm:h-4 sm:w-4" miniClassName={"w-5 h-5"} network={network?.symbol}
                        token={selected_tokens?.symbol?.toLowerCase()} />
                    } */}
                {/* <NetworkIcon className="h-10 w-10 sm:h-8 sm:w-8" miniClassName={"w-5 h-5 sm:w-3 sm:h-3"} network={network.symbol}
                    token={selected_tokens?.symbol?.toLowerCase() || network?.symbol?.toLowerCase()} cName={selected_tokens?.name || network?.name?.toLowerCase()} /> */}
                <span className={"hidden sm:inline"}>{(selected_tokens?.address === "" ? network?.symbol : selected_tokens?.symbol) || (network?.symbol)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-6 h-6 ${isOpen ? "transform rotate-180" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>

            </button>
            {isOpen && (
                <ul className="absolute right-0 z-10 mt-2 py-1 w-[200px] bg-white border border-gray-300 rounded shadow-lg">
                    {(options).map((option: any) => (
                        <li
                            key={option.symbol}
                            onClick={() => handleSelectChange(option)}
                            className="px-4 py-2 hover:bg-gray-100 shrink-0 cursor-pointer flex items-center gap-2"
                        >


                            <NetworkIcon className="h-6 w-6 sm:h-4 sm:w-4 shrink-0" miniClassName={"w-5 h-5"} network={option?.symbol}
                                token={symbol?.toLowerCase()} cName={option?.name} />

                            <span>{option?.symbol}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SwapDropdown;
