export const hlusd_address = "0x808F1e4D10f939E9005eCda74F92C176CFD2C346";
export const usdt_address = "0xAa1e1faea95a3dAF75B25b90742c291C1F273517";
export const usdc_address = "0x1F1A692E002E73e7b8D3136f8B12384f9E2F1244";
export const Hela_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "latestAnswer",
    "outputs": [{ "name": "", "type": "int256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  }
];
export const bnb_address = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526";


export const Bnb_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]