import {useState, useEffect} from 'react';
import {defaultNetwork, networkSettings} from "@/app/config/settings";

// Define the type for the data you want to store in local storage
type LocalStorageDataType = {
    key: string;
    value: any;
};

// Custom hook to interact with local storage
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    // Get the stored value from local storage or use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            if (key === "network") {
                const data = initialValue as any;
                initialValue = networkSettings[data.name.toLowerCase()] as T;
                if (!JSON.parse(item as string).name) {
                    return initialValue;
                }
            }
            return JSON.parse(item as string) ? JSON.parse(item as string) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    useEffect(() => {
        setValue(storedValue)
    }, []);


    const setValue = (value: T) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
