export const defaultNetwork: string = "camp";


interface TokenAddresses {
  [key: string]: string[];
}

export interface NetworkSetting {
  symbol: string;
  name: string;
  address: string;
  usd: number;
}

export const defaultTokens: TokenAddresses =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? {
      camp: ["0x27aB765e4c3FF46F803027cbF1d0fD7c9f141D98",],
    }
    : {
     camp: ["0x27aB765e4c3FF46F803027cbF1d0fD7c9f141D98",],
    };

export const networkSettings: Record<string, NetworkSetting> = {
  // monad: { symbol: "MON", name: "Monad", address: "", usd: 0 },
  camp: { symbol: "CAMP", name: "Camp", address: "", usd: 0 },
};

export const dexAddresses = {

};
