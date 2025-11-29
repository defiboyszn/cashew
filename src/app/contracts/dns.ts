import {publicClient, walletClient} from "@/app/utils/client";
import {ABI} from "@/app/contracts/abi/dns-abi";
import {getDNS} from "@/app/config/config";
import {Account, Hex} from "viem";
import {removeSendSuffix} from "@/app/utils/functions";


const {contractAddress} = getDNS();

export const getDomain = async (address: string | undefined) => {
    const domain: string = await publicClient.readContract({
        address: contractAddress,
        abi: ABI,
        functionName: 'getName',
        args: [address]
    }) as string;

    return removeSendSuffix(domain);
}

export const checkDomain = async (domainName: string) => {
    const domain: string = await publicClient.readContract({
        address: contractAddress,
        abi: ABI,
        functionName: 'getAddress',
        args: [`${domainName}.camp.send`]
    }) as string;

    return removeSendSuffix(domain);
}

export const getDomainAddress = async (domainName: string) => {
    domainName = removeSendSuffix(domainName);
    return await publicClient.readContract({
        address: contractAddress,
        abi: ABI,
        functionName: 'getAddress',
        args: [`${domainName}.camp.send`]
    }) as string
}

export const createDomain = async (username: string, address: string, account: Hex | Account | undefined) => {
    try {
        const {request} = await publicClient.simulateContract({
            account,
            address: contractAddress,
            abi: ABI,
            functionName: 'registerName',
            args: [`${removeSendSuffix(username)}`, address, ""]
        })
        await walletClient.writeContract(request)
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message); // No type error here
        } else {
            console.log("Unknown error:", e);
        }
    }

    return `${username}`
}

