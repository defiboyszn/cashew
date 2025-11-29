import {useEffect, useState} from 'react';

// Custom hook to interact with browser session storage
const useBrowserSession = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    // Get the stored value from session storage or use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    useEffect(() => {
        setValue(storedValue)
    }, []);

    // Update the stored value and also update session storage
    const setValue = (value: T) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
        }
    };

    return [storedValue, setValue];
};

export default useBrowserSession;
