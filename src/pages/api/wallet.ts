// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/app/config/db";
import { checkDomain, createDomain } from "@/app/contracts/dns";
import { privateKeyToAccount } from "viem/accounts";
import { getPrivateKey } from "@/app/utils/keys";
import { remove0xPrefix } from "@/app/utils/functions";

const privateKey = remove0xPrefix(getPrivateKey());

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method === "POST") {
    try {
      const { address, username } = req.body;
      const domainAddress = await checkDomain(username);

      if (parseInt(domainAddress) === 0) {
        const account = privateKeyToAccount(`0x${privateKey}`);

        await createDomain(username, address, account);
      }

      // await db("accounts")
      //   .select()
      //   .where("address", address)
      //   .then((rows) => {
      //     if (rows.length === 0) {
      //       db.insert({ address, enabledTokens: {} });
      //     }
      //   });
      return res.status(200).json({ message: "Address saved to the database" });
    } catch (error) {
      console.error("Error saving address:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    return res.status(415).json({ message: "Method not supported" });
  } else if (req.method === "GET") {
    return res.status(415).json({ message: "Method not supported" });
  } else {
    return res.status(415).json({ message: "Method not supported" });
  }
}
