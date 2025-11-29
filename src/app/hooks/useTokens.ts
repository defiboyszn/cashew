import { useState, useEffect } from 'react';
import { getSymbol, getTokenBalance, getTokenCurrency, getTokenName } from '@/app/contracts/erc20';
import { NetworkSetting, defaultTokens, networkSettings } from "@/app/config/settings";
import { getNetwork } from "@/app/config/networks";
import { getNativeBalance, getNativeCurrency } from '../contracts/native';
import useLocalStorage from './useLocalStorage';
import { getPrice, getTokenPrice } from '../contracts/price';

export interface Token {
    address: string;
    name: string;
    symbol: string;
    usd: number;
    usd_balance: number;
    balance: number;
    value: string;
    pnl: string;
}

async function getTokenData(address: string, network: string, pubKey: string): Promise<Token> {
    const symbol = await getSymbol(address, network);
    const name = await getTokenName(address, network);
    const usd_balance = (await getTokenCurrency(symbol?.toLowerCase(), network) as number)
    const price = await getTokenPrice(network, symbol?.toLowerCase())
    const balance = await getTokenBalance(address as string, pubKey, network);
    return { address, name, symbol, usd: usd_balance, usd_balance: usd_balance * balance, balance, ...price };
}
async function getNativeBalanceUSD(baseToken: NetworkSetting, address: string): Promise<Token> {
    const usd = (await getNativeCurrency(baseToken?.name) as number)
    const balance = await getNativeBalance(address, baseToken?.name)
    const price = await getPrice(baseToken?.name)
    return { address: baseToken?.address, name: baseToken?.name, symbol: baseToken?.symbol, usd: usd, usd_balance: usd * balance, balance, ...price };
}

interface UseTokenListProps {
    initialTokens?: string[];
    network: string
}

const useTokenList = ({ initialTokens = [], network }: UseTokenListProps) => {

    const [tokenList, setTokenList] = useState<Token[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [pubKey,] = useLocalStorage("pubKey", "");
  
    useEffect(() => {
      const fetchTokenData = async () => {
        const default_tokens = defaultTokens[network?.toLowerCase()];
        const baseToken = networkSettings[network?.toLowerCase()];
  
        const [defaultTokenData, tokenData] = await Promise.all([
          Promise?.all(default_tokens?.map((token) => getTokenData(token, network, pubKey))),
          Promise?.all(initialTokens?.map((token) => getTokenData(token, network, pubKey))),
        ]);
  
        const structed_baseToken = await getNativeBalanceUSD(baseToken, pubKey);
  
        const combinedTokens = [...defaultTokenData, ...tokenData];
  
        // Sort by balance in descending order (high to low)
        const sortedTokenData = combinedTokens.sort((a, b) => b.balance - a.balance);
  
        setTokenList([structed_baseToken, ...sortedTokenData]);
      };
  
      fetchTokenData().then();
    }, []);
  
    const addToken = async (newAddress: string) => {
      const existingToken = tokenList.find(token => token.address === newAddress);
      if (existingToken) return;
  
      const newTokenData = await getTokenData(newAddress, network, pubKey);
  
      // Insert the new token at the appropriate position based on balance
      setTokenList(prevList => {
        const index = prevList.findIndex(token => newTokenData.balance > token.balance);
        return index !== -1 ? [
          ...prevList.slice(0, index),
          newTokenData,
          ...prevList.slice(index),
        ] : [...prevList, newTokenData];
      });
    };
  
    const filterTokens = (searchTerm: string) => {
      setSearchTerm(searchTerm);
    };
  
    const filteredTokenList = tokenList.filter(
      token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return { tokenList: filteredTokenList, addToken, filterTokens };
  };


  

export default useTokenList;


// import { useState, useEffect } from 'react';
// import { getSymbol, getTokenBalance, getTokenCurrency, getTokenName } from '@/app/contracts/erc20';
// import { NetworkSetting, defaultTokens, networkSettings } from "@/app/config/settings";
// import { getNetwork } from "@/app/config/networks";
// import { getNativeBalance, getNativeCurrency } from '../contracts/native';
// import useLocalStorage from './useLocalStorage';
// import { getPrice, getTokenPrice } from '../contracts/price';

// export interface Token {
//     networks: any;
//     network: any;
//     address: string;
//     name: string;
//     symbol: string;
//     usd: number;
//     usd_balance: number;
//     balance: number;
//     value: string;
//     pnl: string;
// }

// async function getTokenData(address: string, network: string, pubKey: string): Promise<Token> {
//     const symbol = await getSymbol(address, network);
//     const name = await getTokenName(address, network);
//     const usd_balance = (await getTokenCurrency(symbol?.toLowerCase(), network) as number)
//     const price = await getTokenPrice(network, symbol?.toLowerCase())
//     const balance = await getTokenBalance(address as string, pubKey, network);
//     return { address, name, symbol, usd: usd_balance, usd_balance: usd_balance * balance, balance, ...price, network, networks: [network] };
// }

// async function getNativeBalanceUSD(baseToken: NetworkSetting, address: string,network: string): Promise<Token> {
//     const usd = (await getNativeCurrency(baseToken?.name) as number)
//     const balance = await getNativeBalance(address, baseToken?.name)
//     const price = await getPrice(baseToken?.name)
//     return { address: baseToken?.address, name: baseToken?.name, symbol: baseToken?.symbol, usd: usd, usd_balance: usd * balance, balance, ...price, network: baseToken.name, networks: [network] };
// }

// interface UseTokenListProps {
//     initialTokens?: string[];
//     // network: string
// }

// const useTokenList = ({ initialTokens = [] }: UseTokenListProps) => {
//   const [tokenList, setTokenList] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [pubKey] = useLocalStorage("pubKey", "");

//   useEffect(() => {
//     const fetchTokenData = async () => {
//       const allNetworks = Object.keys(defaultTokens);

//       const allTokensData = await Promise.all(
//         allNetworks.map(async (network) => {
//           const default_tokens = defaultTokens[network.toLowerCase()];
//           const baseToken = networkSettings[network.toLowerCase()];

//           const [defaultTokenData, tokenData] = await Promise.all([
//             Promise.all(default_tokens.map((token) => getTokenData(token, network, pubKey))),
//             Promise.all(initialTokens.map((token) => getTokenData(token, network, pubKey))),
//           ]);

//           const structed_baseToken = await getNativeBalanceUSD(baseToken, pubKey,network);
//           const allNetworkTokens = [structed_baseToken, ...defaultTokenData, ...tokenData];

//           return allNetworkTokens;
//         })
//       );

//       const flatTokenData = allTokensData.flat();

//       const groupedTokens = flatTokenData.reduce((acc: any, token) => {
//         const existingGroup = acc.find((group: any) => group.symbol === token.symbol);

//         if (existingGroup) {
//           existingGroup.networks.push(token.network);
//           existingGroup.datas.push(token);
//         } else {
//           acc.push({
//             symbol: token.symbol,
//             networks: [token.network],
//             datas: [token],
//           });
//         }

//         return acc;
//       }, []);

//       setTokenList(groupedTokens);
//     };

//     fetchTokenData().then();
//   }, [initialTokens, pubKey]);

//   const addToken = async (newAddress: string, network: string) => {
//     const newTokenData = await getTokenData(newAddress, network, pubKey);

//     setTokenList((prevList) => {
//       const existingGroup = prevList.find((group: any) => group.symbol === newTokenData.symbol);

//       if (existingGroup) {
//         existingGroup.networks.push(network);
//         existingGroup.datas.push(newTokenData);
//       } else {
//         prevList.push({
//           symbol: newTokenData.symbol,
//           networks: [network],
//           datas: [newTokenData],
//         });
//       }

//       return [...prevList];
//     });
//   };

//   const filterTokens = (term: string) => {
//     setSearchTerm(term);
//   };

//   const filteredTokenList = tokenList.filter((group) =>
//     group.datas?.some(
//       (token: any) =>
//         token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   return { tokenList: filteredTokenList, addToken, filterTokens };
// };

// export default useTokenList;
