export const Questions = [
  {
    id: Math.random(),
    question: "Who is the Founder of Cashew by Sendtokens ?",
    correctAnswer: "Defiboy",
    wrongAnswers: ["DefiDevrel", "Defidevboy", "Defiman"],
  },

  {
    id: Math.random(),
    question: "Which of these can be stored publicly?",
    correctAnswer: "Address",
    wrongAnswers: ["Hot address", "Private Key", "Seed Phrase"],
  },

  {
    id: Math.random(),
    question: "Cashew by Sendtokens is a self custody with .... powers.",
    correctAnswer: "Super",
    wrongAnswers: ["Big", "Explosive", "Fire"],
  },

  {
    id: Math.random(),
    question: "What do i receive when i provide liquidity to the pool ?",
    correctAnswer: "Lending Pool",
    wrongAnswers: ["Lock Pool", "Liquid Pool", "Lend Pool"],
  },
  {
    id: Math.random(),
    question: "What does DEX means ?",
    correctAnswer: "Decentralized Exchange",
    wrongAnswers: ["Decentralized Extra", "Degen Exchange", "DePin with Extra"],
  },
  {
    id: Math.random(),
    question: "What is the token symbol for Cashew by Sendtokens",
    correctAnswer: "SEND",
    wrongAnswers: ["SENDT", "ST", "SENDTOKEN"],
  },

  {
    id: Math.random(),
    question: "What year did Cashew by Sendtokens launch ?",
    correctAnswer: "2023",
    wrongAnswers: ["2024", "2022", "2021"],
  },

  {
    id: Math.random(),
    question: "What is blockchain technology, and how does it work?",
    correctAnswer:
      "Blockchain is a decentralized, distributed ledger technology that records transactions across multiple computers in a way that is transparent, secure, and immutable.",
    wrongAnswers: [
      "Blockchain is a centralized database controlled by a single entity.",
      "Blockchain is a type of cloud storage where data is stored on a single server.",
      "Blockchain is a form of artificial intelligence used for data analysis and prediction.",
    ],
  },

  {
    id: Math.random(),
    question: "Explain the concept of decentralization in blockchain.",
    correctAnswer:
      "Decentralization means that no single entity has control over the blockchain network, ensuring transparency and resilience.",
    wrongAnswers: [
      "Decentralization means that a central authority governs the blockchain network, providing better control and security.",
      "Decentralization refers to the process of consolidating power and control within a single entity to improve efficiency.",
      "Decentralization is a term used to describe the distribution of physical assets across different locations for redundancy.",
    ],
  },
];

const shuffleAnswers = (answers: Array<string>) => {
  if (answers.length < 2)
    throw new Error("Array of answers must contain at least 2 elements");

  const shuffledAnswers = answers
    .map((answer) => ({ _id: Math.random(), value: answer })) // giving ids
    .sort((a, b) => a._id - b._id) // sorting by given ids
    .map((obj) => obj.value); // returning values without ids

  return shuffledAnswers;
};

export default shuffleAnswers;
