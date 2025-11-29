import { useState } from "react";
import Icon from "./icons";
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
}

export const NetworkComp: React.FC<CustomDropdownProps> = ({
  options,
  defaultValue,
  onChange,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChain, setSelectedChain] = useState<any>(options);

  const handleSelectChange = (value: string): void => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue || ""
  );
  return (
    <>
      <div className="overflow-y-auto">
        {Object?.keys(selectedChain).map((option) => {
          return (
            <li
              key={option}
              onClick={() => handleSelectChange(option)}
              className={`${
                selectedChain[option].name?.toLowerCase() ===
                  selectedValue?.toLowerCase() && "bg-gray-100"
              } px-4 py-2 hover:bg-gray-100 shrink-0 cursor-pointer flex items-center gap-2`}
            >
              <Icon
                name={selectedChain[option].symbol}
                cName={selectedChain[option].name}
                className="h-6 w-6 sm:h-4 sm:w-4 shrink-0"
              ></Icon>
              <span>{selectedChain[option].name}</span>
            </li>
          );
        })}
      </div>
    </>
  );
};
