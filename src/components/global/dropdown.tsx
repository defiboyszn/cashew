import React, { useState, useRef, useEffect, MouseEvent } from "react";
import Icon from "@/components/global/icons";
import { motion } from "framer-motion";
import search from "../../assets/icons/search.svg";

interface Option {
  symbol: string;
  name: string;
  value: string;
}

interface CustomDropdownProps {
  options: any;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClick?: (args?: any) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  defaultValue,
  onChange,
  onClick,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue || ""
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSelectChange = (value: string): void => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

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

  let selectedLabel: string = defaultValue || "";
  for (const option in options) {
    if (option === selectedValue) {
      selectedLabel = option;
      break;
    }
  }
  return (
    <>
      <div ref={dropdownRef} className="relative inline-block">
        <button
          onClick={handleToggleDropdown}
          className="border border-gray-300 z-[9999999999999] relative flex gap-2 items-center px-2 py-2 bg-white bg-primary/5 hover:bg-primary/10 rounded-full text-gray-700 font-semibold focus:outline-none"
        >
          <Icon
            name={options[selectedLabel]?.symbol}
            className="h-6 w-6 sm:h-4 sm:w-4"
            cName={options[selectedLabel]?.name}
          />
          <span className={"hidden sm:inline"}>
            {options[selectedLabel]?.name}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            className="transform rotate-90 hidden sm:block"
          >
            <g id="tabler-icon-chevron-right">
              <path
                id="Vector"
                d="M9 6L15 12L9 18"
                stroke="#667085"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </button>
        {isOpen && (
        <motion.ul
          className="absolute right-0 z-10 mt-2 py-1 w-[300px] overflow-y-auto h-fit bg-white border border-gray-300 rounded shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
         
          <div>
            {Object.keys(options).map((option) => {
              return (
                <li
                  key={option}
                  onClick={() => handleSelectChange(option)}
                  className={`${
                    options[option].name?.toLowerCase() ===
                      selectedValue?.toLowerCase() && "bg-gray-100"
                  } px-4 py-2 hover:bg-gray-100 shrink-0 cursor-pointer flex items-center gap-2`}
                >
                  <Icon
                    name={options[option].symbol}
                    cName={options[option].name}
                    className="h-6 w-6 sm:h-4 sm:w-4 shrink-0"
                  ></Icon>
                  <span>{options[option].name}</span>
                </li>
              );
            })}
          </div>
        </motion.ul>
      )}
      </div>

    </>
  );
};

export default CustomDropdown;
