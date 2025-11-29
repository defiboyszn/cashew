import React, { useState, useRef, useEffect, MouseEvent, useMemo } from "react";
import copy from "@/assets/icons/copy.svg";
import copied_img from "@/assets/icons/copied.svg";
import settings from "@/assets/icons/settings.svg";
import accounts from "@/assets/icons/account.svg";
import send from "@/assets/logos/send-logo-no-text.svg";
import help from "@/assets/icons/help.svg";
import lock from "@/assets/icons/lock.svg";
import { minidenticon } from "minidenticons";
import Link from "next/link";
import { motion } from "framer-motion";
import { copyToClipboard } from "../wallet/cryptopin/cryptopin.index";

interface CustomDropdownProps {
  options: any;
  children: any;
  username: string;
}

export const Avatar = ({
  username,
  saturation,
  lightness,
  ...props
}: {
  username: string;
  saturation?: string;
  lightness?: string;
  [x: string]: any;
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return <img src={svgURI} alt={username} {...props} />;
};

const NavDropdown: React.FC<CustomDropdownProps> = ({
  options,
  username,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleToggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block z-[99999999999999]">
      <button onClick={handleToggleDropdown}>
        {isOpen ? (
          <div className="flex z-[99999999] relative flex-row items-center gap-2 justify-center rounded-none bg-white hover:bg-red-100 px-3 sm:px-4 py-2.5 font-bold text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="black"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          children
        )}
      </button>

      {isOpen && (
        <>
          <motion.div
            className="absolute -right-3 md:right-0 z-[99999] mt-4 w-[350px] md:w-[320px] bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* User Profile Section */}
            <div className="p-4 bg-gradient-to-br from-purple-200 to-pink-200 border-b-4 border-black">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white rounded-full border-3 border-black overflow-hidden flex items-center justify-center">
                  <Avatar
                    username={username}
                    saturation="90"
                    width="45"
                    height="45"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Username</p>
                  <p className="text-lg font-black text-black">${username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  copyToClipboard(username);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 4000);
                }}
                className="w-full px-3 py-2 bg-cyan-300 hover:bg-cyan-400 border-3 border-black rounded-lg font-bold text-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                {copied ? (
                  <>
                    <img src={copied_img?.src} alt="Copied" className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <img src={copy?.src} alt="Copy" className="w-4 h-4" />
                    Copy Username
                  </>
                )}
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                onClick={() => setIsOpen(false)}
                href={"/account"}
                className="flex items-center gap-3 px-3 py-3 hover:bg-blue-100 rounded-lg transition-colors group border-2 border-transparent hover:border-black mb-1"
              >
                <div className="w-10 h-10 bg-blue-300 rounded-lg border-2 border-black flex items-center justify-center group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <img src={accounts?.src} alt="accounts" className="w-5 h-5" />
                </div>
                <span className="font-bold text-black text-sm">Manage Accounts</span>
              </Link>

              <Link
                onClick={() => setIsOpen(false)}
                href={"/settings"}
                className="flex items-center gap-3 px-3 py-3 hover:bg-purple-100 rounded-lg transition-colors group border-2 border-transparent hover:border-black mb-1"
              >
                <div className="w-10 h-10 bg-purple-300 rounded-lg border-2 border-black flex items-center justify-center group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <img src={settings?.src} alt="Settings" className="w-5 h-5" />
                </div>
                <span className="font-bold text-black text-sm">Settings</span>
              </Link>
            </div>
          </motion.div>
        </>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-[9998] transition-all duration-500" />
      )}
    </div>
  );
};

export default NavDropdown;