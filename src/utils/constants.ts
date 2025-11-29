import axios from "axios";
import { ZeroAddress } from "ethers";

export const roundNumber = (number: number) => {
  const decimalPlaces = Math.max(
    0,
    3 - Math.floor(Math.log10(Math.abs(number)))
  );
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor || 0;
};

export function shortenAddress(address: string): string {
  const prefix = address.substr(0, 6);
  const suffix = address.substr(-6);
  return `${prefix}....${suffix}`;
}

export const useDollar = (dollar: number) => {
  let formatCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  });
  let money = formatCurrency.format(dollar);

  return money.replace("US", "");
};

// Initialize an empty cache object
const cache = {} as {
  [x: string]: {
    timestamp: number;
    data: any;
  };
};

/**
 * Function to make a request using Axios with caching and expiration */
export async function $fetch(
  url: string,
  cacheDuration = 14400000 /* 4 hours */
) {
  if (!sessionStorage.getItem("cache")) {
    sessionStorage.setItem("cache", JSON.stringify({}));
  }
  const cache = JSON.parse(sessionStorage.getItem("cache") || "{}");

  const now = Date.now();

  // Check if the data is already in the cache and not expired
  if (cache[url] && now - cache[url].timestamp < cacheDuration) {
    try {
      return JSON.parse(cache[url].data); // Attempt to parse cached data
    } catch (error) {
      // Handle parsing error (optional: return null or default value)
      console.error("Error parsing cached data:", error);
      return null; // Example: return null on parsing error
    }
  }

  try {
    // If not in the cache or expired, fetch the data
    const response = await fetch(url, {
      method: "GET",
      // next: {
      //   revalidate: 86400,
      // },
      // mode: "no-cors"
    });
    const res = await response.json();
    // Store the data in the cache with a timestamp
    if (response.ok) {
      cache[url] = {
        data: JSON.stringify(res),
        timestamp: now,
      };
      sessionStorage.setItem("cache", JSON.stringify(cache));
    }

    return response.ok && res;
  } catch (error) {
    throw error;
  }
}

// https://v3.znsconnect.io/api/resolveDomain?tld=honey&domain=defiboyszn

export const ZNSSearch = async (text: string) => {
  const zns = text.split(".");
  const req = await axios.get(
    `https://v3.znsconnect.io/api/resolveDomain?tld=${zns[1]}&domain=${zns[0]}`
  );
  const res = req.data;
  return {
    address: res?.address ? res?.address : ZeroAddress,
  };
};

export const OneIDSearch = async (text: string) => {
  const req = await axios.get(
    `https://www.vicscan.xyz/api/oneid/search?text=${text}`
  );
  const res = req.data[0];
  return {
    address: res?.address.length > 1 ? res?.address : ZeroAddress,
  };
};
