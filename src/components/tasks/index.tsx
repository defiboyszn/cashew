import { defaultNetwork, networkSettings } from "@/app/config/settings";
import { getUserData } from "@/app/contracts/quiz";
import useBrowserSession from "@/app/hooks/useBrowserSession";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { decryptWithPassphrase } from "@/app/utils/functions";
import win from "@/assets/icons/confetti.svg";
import { Back } from "@/components/global/back.global";
import shuffleAnswers, { Questions } from "@/utils/questions";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

// const $address = {
//   hela: "0xDE46E2d8E5F49Cc620A9f22d970af7382Dca541E",
//   //   toothwood: "0xb68643C2940d692b4106b50dDDD3009F7B706acF",
// };
type Question = {
  id: number;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
};

let availableIndices = Array.from(
  { length: Questions.length },
  (_, index) => index
);

function getRandomIndex() {
  if (availableIndices.length === 0) {
    availableIndices = Array.from(
      { length: Questions.length },
      (_, index) => index
    );
  }
  const randomIndex = Math.floor(Math.random() * availableIndices.length);
  return availableIndices.splice(randomIndex, 1)[0];
}

function TasksComp() {
  const [network] = useLocalStorage<any>(
    "network",
    networkSettings[defaultNetwork]
  );
  const [password] = useBrowserSession<any>("authPassword", "");
  const [walletMnemonic] = useLocalStorage<string>("walletMnemonic", "");
  const [privateKey] = useLocalStorage<string>("privateKey", "");
  const [decWM, setDecWM] = useState<string>("");
  const [decPK, setDecPK] = useState<string>("");
  const [step, setStep] = useState(0);
  const [quest, setQuest] = useState(getRandomIndex());
  const [question, setQuestion] = useState(padQuestions(quest) as Question);
  // @ts-ignore
  const [options, setOptions] = useState(
    shuffleAnswers([
      ...question?.wrongAnswers,
      question?.correctAnswer,
    ]) as string[]
  );
  const [pubKey] = useLocalStorage("pubKey", "");
  const [selected_answer, setSelectedAnswer] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const maxIncorrectAllowed = 5;
  const [score, setScore] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [remainingQuestions, setRemainingQuestions] = useState(
    10 - (answeredQuestions - incorrectAnswers)
  );

  function padQuestions(index: number) {
    return Questions[index];
  }

  useEffect(() => {
    // setTimeout(() => {
    if (!(decPK || decWM)) {
      if (walletMnemonic) {
        setDecWM(decryptWithPassphrase(walletMnemonic, password));
      } else if (privateKey) {
        setDecPK(decryptWithPassphrase(privateKey, password));
      } else {
        router.push("/").then();
      }
    }
    // }, 100)
  }, []);

  useEffect(() => {
    setQuestion(padQuestions(quest));
    setOptions(
      shuffleAnswers([
        ...padQuestions(quest)?.wrongAnswers,
        padQuestions(quest)?.correctAnswer,
      ])
    );
    setRemainingQuestions(10 - (answeredQuestions - incorrectAnswers));
  }, [quest]);
  const handleAnswerClick = (selectedOption: string) => {
    if (!quizComplete) {
      setAnsweredQuestions((prevCount) => prevCount + 1);
      if (selectedOption !== question.correctAnswer) {
        setIncorrectAnswers((prevCount) => prevCount + 1);
        // setScore((prev) => prev - 10);
        if (incorrectAnswers >= maxIncorrectAllowed - 1) {
          setQuizComplete(true);
          return; // Stop further execution
        }
      } else {
        setCorrectAnswers((prevCount) => prevCount + 1);
        setScore((prev) => prev + 10);
        setRewards((prev) => prev + 10);
      }
      if (answeredQuestions === 9 || incorrectAnswers >= maxIncorrectAllowed) {
        setQuizComplete(true);
      }
    }
  };

  function reserveNumber(currentStep: number) {
    const maxValue = 10;
    return maxValue - currentStep + 1;
  }
  async function sendpoints() {}

  async function $getUserData() {
    const data = await getUserData({
      mnemonic: decWM,
      privateKey: decPK,
      network: network?.name,
    });
  }

  useEffect(() => {
    $getUserData().then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col w-full pb-4 sm:pt-12">
        <div className="z-10 pt-5 pb-3 top-20 bg-cgray-25">
          <Back
            onBack={(back) => {
              if (step < 1 || step == 2) {
                back();
              } else {
                setStep(step - 1);
                // setQuest(Math.floor(Math.random() * Questions.length));
                // setQuestion(padQuestions(quest));
                // setOptions(
                //   shuffleAnswers([
                //     ...question?.wrongAnswers,
                //     question?.correctAnswer,
                //   ])
                // );
              }
            }}
          />
          <div className="flex flex-col items-start justify-start gap-2 mt-5 mb-3 h-9">
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="self-stretch text-cgray-900 text-[28px] font-medium leading-9">
                Questions
              </h1>
              {step === 1 && <p>{reserveNumber(remainingQuestions)}/10</p>}
            </div>
            {step < 1 || step == 2 ? null : (
              <p className="text-zinc-400 text-[15px] font-normal leading-loose">
                Answer the questions to earn $SEND Point
              </p>
            )}
          </div>
        </div>

        {step === 0 ? (
          <div className="pt-10 flex flex-col justify-center items-center gap-4 h-full">
            <div className="flex flex-col justify-center items-center gap-1">
              <p className="text-stone-900 text-[19px] font-medium capitalize leading-tight tracking-wider">
                Rewards
              </p>
              <p className="text-center text-stone-900 text-[28px] font-bold font-gt-bold leading-tight">
                {rewards} $SEND Points
              </p>
            </div>
            <div className="pt-10 flex flex-col justify-center items-center gap-1.5">
              <button
                onClick={() => setStep(1)}
                className="w-[343px] h-12 px-4 py-3 bg-violet-700 rounded-lg border border-violet-500 justify-center flex-row items-center gap-2 flex"
              >
                <p className="text-center text-white text-base font-light font-gt-light leading-tight">
                  Start Quiz
                </p>
              </button>
            </div>
          </div>
        ) : step === 1 ? (
          <div className="flex flex-col gap-3 items-start justify-start">
            <div className="flex flex-row justify-start items-start pt-5">
              <div>
                <span className="text-primary-dark font-bold">
                  Score = {score} Points
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start w-full">
              <h1 className="font-semibold text-black text-xl">
                {question?.question}
              </h1>
              <div className="pt-3">
                <span className="text-zinc-400">
                  Choose <span className="text-primary-dark">one</span> correct
                  answer
                </span>
              </div>
              <div className="flex flex-col items-start gap-3 justify-start w-full pt-2 pb-6">
                {options.map((data, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedAnswer(data);
                    }}
                    className={`${
                      selected_answer === data
                        ? "bg-violet-600/90 text-violet-50"
                        : ""
                    } w-full hover:bg-violet-600/90 hover:text-violet-50 rounded-xl text-violet-800 bg-violet-100 border border-violet-800 px-3 py-3`}
                  >
                    {data}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (correctAnswers == 9) {
                    setRewards((prev) => prev);
                    setScore((prev) => prev);
                  }
                  if (quizComplete) {
                    setStep(2);
                  }
                  setSelectedAnswer("");
                  handleAnswerClick(selected_answer);
                  setQuest(getRandomIndex());
                  setQuestion(padQuestions(quest));
                  setOptions(
                    // @ts-ignore
                    shuffleAnswers([
                      ...question?.wrongAnswers,
                      question?.correctAnswer,
                    ])
                  );
                }}
                className="w-full rounded-xl pt-4 text-violet-100 bg-violet-800 border border-violet-800 px-3 py-3"
              >
                Submit
              </button>
            </div>
          </div>
        ) : step === 2 ? (
          <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-opacity-70 fixed inset-0 bg-black z-10"></div>
              <div className="bg-white p-6 rounded-lg shadow-lg z-20 max-w-[90%] w-[450px]">
                <div className="w-full flex flex-col justify-center items-center">
                  <img src={win?.src} alt="win" />
                  <p className="text-3xl font-bold text-black">
                    {score < 80 ? "You Lost" : "You Won"}
                  </p>
                  <p className="text-sm">+{score} Points</p>
                </div>
                <div className="flex justify-end space-x-2 mt-6 w-full">
                  <button
                    className="w-full py-2 bg-violet-800 text-white rounded-lg hover hover:bg-gray-800"
                    onClick={() => {
                      setStep(0);
                      setScore(0);
                      setCorrectAnswers(0);
                      setSelectedAnswer("");
                      setIncorrectAnswers(0);
                      setQuizComplete(false);
                      setAnsweredQuestions(0);
                      setRemainingQuestions(10);
                    }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default TasksComp;
