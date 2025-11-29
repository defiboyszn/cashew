// import {Address, createPublicClient, http} from "viem";
// import {getNetwork} from "@/app/config/networks";
// import {UNISWAP_V2_FACTORY_ABI, UNISWAP_V2_PAIR_ABI} from "@/app/contracts/abi/dex.global";
// import {dexAddresses} from "@/app/config/settings";
//
// export const getTokenPriceFromDex = async (
//     tokenAddress: string,
//     network = ''
// ): Promise<number | null> => {
//     const publicClient = createPublicClient({
//         chain: getNetwork(network),
//         transport: http(),
//     });
//
//     try {
//         const pairAddress = await publicClient.readContract({
//             address: dexAddresses[network.toLowerCase()].router as Address,
//             abi: UNISWAP_V2_FACTORY_ABI,
//             functionName: 'getPair',
//             args: [tokenAddress, dexAddresses[network.toLowerCase()].wrapper as Address],
//         });
//
//
//         const pairContract = await publicClient.readContract({
//             address: pairAddress as Address,
//             abi: UNISWAP_V2_PAIR_ABI,
//             functionName: 'getReserves',
//             args: [],
//         });
//
//         const [tokenReserves, ethReserves]: any = pairContract;
//         const tokenPriceInETH = parseFloat(ethReserves) / parseFloat(tokenReserves);
//
//         return parseFloat(tokenPriceInETH.toFixed(6));
//     } catch (error) {
//         console.log('Error fetching token price:', error);
//         return null;
//     }
// };
