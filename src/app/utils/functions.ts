const forge = require('node-forge');
const crypto = require('crypto');
import {isAddress} from "viem";

export const areArraysEqual = <T>(arr1: T[], arr2: T[]): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};

export const downloadWordsAsTxt = (words: string[], filename: string) => {
    const wordsText = words.join(' ');
    const blob = new Blob([wordsText], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
};

export const isValidWalletAddress = (address: string) => {
    return isAddress(address);
};

// Function to encrypt data with a passphrase
export function isValidDomainName(domain: string): boolean {
    const suffix = ".send";
    const result = domain.replace(new RegExp(suffix + "$"), "");
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

    return domainRegex.test(result) && !result.startsWith('-') && !result.endsWith('-');
}

export function encryptWithPassphrase(data: string, passphrase: string) {
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha512');
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encodedData = salt.toString('hex') + iv.toString('hex') + encrypted;
    return encodedData;
}

// Function to decode (decrypt) data with a passphrase
export function decryptWithPassphrase(encodedData: string, passphrase: string) {
    try {
        const salt = Buffer.from(encodedData.slice(0, 32), 'hex');
        const iv = Buffer.from(encodedData.slice(32, 64), 'hex');
        const encrypted = encodedData.slice(64);

        const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha512');

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (e) {
        return "";
    }
}

export const shuffleArray = (array: string[]) => {
    const newArray = array.slice(); // Create a copy of the original array
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const remove0xPrefix = (key: string): string => {
    return key.startsWith('0x') ? key.slice(2) : key;
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeSendSuffix(inputString: string) {
    return inputString.replace(/\.camp\.send$/, '');
}