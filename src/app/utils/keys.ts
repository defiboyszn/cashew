export const getPrivateKey = () => {
  let privateKey: string;

  switch (process.env.NEXT_PUBLIC_DEFAULT_NETWORK) {
    case "sepolia":
      privateKey = process.env.NEXT_PUBLIC_SEPOLIA_PRIVATE_KEY ?? "";
      break;
    case "local":
      privateKey = process.env.NEXT_PUBLIC_LOCAL_PRIVATE_KEY ?? "";
      break;

    case "local":
      privateKey = process.env.NEXT_PUBLIC_HELA_PRIVATE_KEY ?? "";
      break;

    default:
      privateKey = process.env.NEXT_PUBLIC_BASE_TESTNET_PRIVATE_KEY ?? "";
  }

  return privateKey;
};
