import { HDNodeWallet, ethers } from "ethers";
import { getShardFromAddress } from "quais/lib/utils";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";
import {
  ByteArray,
  Hex,
  PrivateKeyAccount,
  ToHexParameters,
  boolToHex,
  bytesToHex,
  numberToHex,
  stringToHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { quais } from "quais";

type Opts = {
  path: string;
  startingIndex: number;
};

export function toHex(
  value: string | number | bigint | boolean | ByteArray,
  opts: ToHexParameters = {}
): Hex {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean") return boolToHex(value, opts);
  return bytesToHex(value, opts);
}

export const mnemonicToAccount = (phrase: string, opts: Opts) => {
  let found = false;
  let childNode;
  let shard = "zone-0-0";
  let account;
  while (!found) {
    const seed = mnemonicToSeedSync(phrase);

    childNode = HDKey.fromMasterSeed(seed).derive(
      opts.path + "/" + opts.startingIndex.toString()
    );
    account = privateKeyToAccount(toHex(childNode.privateKey!));
    let addrShard = getShardFromAddress(account.address);
    if (addrShard != undefined) {
      if (addrShard === shard) {
        found = true;
      }
    }
    opts.startingIndex++;
  }
  return account as PrivateKeyAccount;
};

export function getShardAddressChildNode(
  hdnode: quais.utils.HDNode,
  path: string,
  startingIndex: number,
  shard: string
) {
  let found = false;
  let childNode;
  while (!found) {
    childNode = hdnode.derivePath(path + "/" + startingIndex.toString());
    const addrShard = getShardFromAddress(childNode.address);
    // Check if address is in a shard
    if (addrShard !== undefined) {
      // Check if address is in correct shard
      if (addrShard === shard) {
        found = true;
        break;
      }
    }
    startingIndex++;
  }
  return childNode as quais.utils.HDNode;
}

// export const getAccountQuai = (hdnode: HDNode) => {
//   derivePath("m/44'/994'/0'/0"+ "/"+ (0).toString())
// }
