// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { checkDomain, createDomain } from "@/app/contracts/dns";
import { Address, privateKeyToAccount } from "viem/accounts";
// import { publicClient, walletClient } from '@/app/utils/client';
import { TransactionReceipt, createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { getDNS } from "@/app/config/config";
import { getNetwork } from '@/app/config/networks';

const { network, rpcUrl } = getDNS();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string, receipt?: TransactionReceipt }>
) {
    if (req.method === 'POST') {
        try {
            const { fromAddress, toAddress, amount } = req.body;
            const publicClient = createPublicClient({
                chain: getNetwork(network?.name),
                transport: http(rpcUrl),
            })
            const client = createWalletClient({
                account: fromAddress,
                chain: getNetwork(network?.name),
                transport: http(rpcUrl),
            })
            // const domainAddress = await checkDomain(username);
            // @ts-ignore
            const hash = await client.sendTransaction({
                to: toAddress as Address,
                value: parseEther(amount),
            })
            const receipt = await publicClient.waitForTransactionReceipt({ hash })

            return res.status(200).json({ message: `${amount} Tokens sent to ${toAddress}`, receipt });
        } catch (error) {
            console.error('Error sending:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        return res.status(415).json({ message: 'Method not supported' })
    } else if (req.method === 'GET') {
        return res.status(415).json({ message: 'Method not supported' })
    } else {
        return res.status(415).json({ message: 'Method not supported' })
    }
}