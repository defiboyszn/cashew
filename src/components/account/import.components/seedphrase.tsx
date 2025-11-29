// SeedPhraseInput.tsx

import React, {useEffect, useState} from 'react';
import {areArraysEqual, shuffleArray} from "@/app/utils/functions"

interface SeedPhraseInputProps {
    attempt: boolean
    seedError: string
    allSeedWords: string[];
    setSeedErrors: (val: string) => void
    setAttemptedForm2Submit: (val: boolean) => void
}

const SeedPhraseInput: React.FC<SeedPhraseInputProps> =
    ({allSeedWords, setSeedErrors, setAttemptedForm2Submit, seedError, attempt}) => {
        const [selectedWords, setSelectedWords] = useState<string[]>([]);

        const correct = !seedError;

        const handleWordClick = (word: string) => {
            if (!selectedWords.includes(word)) {
                setSelectedWords(prevSelectedWords => [...prevSelectedWords, word]);
            } else {
                handleRemoveWord(word);
            }
        };

        const [shuffleWords, setShuffleWords] = useState<string[]>([]);

        useEffect(() => {
            if (shuffleWords.length === 0) {
                const arr = shuffleArray(allSeedWords);
                setShuffleWords(arr);
            }
        }, [])


        useEffect(() => {
            setAttemptedForm2Submit(false);

            if (selectedWords.length === allSeedWords.length) {
                if (areArraysEqual(selectedWords, allSeedWords)) {
                    setSeedErrors("")
                } else {
                    setSeedErrors("Seed phrase is incorrect")
                }
            } else {
                setSeedErrors("")
            }

            if (selectedWords.length < allSeedWords.length) {
                selectedWords.length < 1 ?
                    setSeedErrors("The seed phrase selection is required") : setSeedErrors("The seed phrase selection is incomplete")
            } else {
                setSeedErrors("")
            }

        }, [selectedWords])


        const handleRemoveWord = (word: string) => {
            setSelectedWords(prevSelectedWords => prevSelectedWords.filter(w => w !== word));
        };

        return (
            <div>
                <div className="mt-4">
                    <div
                        className={`min-h-[180px] resize-none p-1 py-4 w-full border-2 rounded-[8px] content-center flex items-center justify-center ${selectedWords.length === allSeedWords.length && correct ? "border-green-500" : !correct && attempt ? "border-red-500" : ""}`}>
                        <div className='text-center'>
                            {selectedWords.map((word, index) => (
                                <React.Fragment key={index}>
                                    {(index > 0 && index % 4 === 0) &&
                                        <div className="mb-3"></div>} {/* Create a new div after every fourth word */}
                                    <span
                                        className="inline-block p-1 my-1 text-xs text-center rounded-full cursor-pointer sm:text-sm bg-cgray-100"
                                        onClick={() => handleRemoveWord(word)}
                                    >
                                    <span className='pr-1 font-medium'>{index + 1}:</span>
                                        {word}
                                </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    {(seedError && (attempt || selectedWords.length === allSeedWords.length)) &&
                        <div
                            className="text-red-500 text-sm">{seedError}</div>}
                </div>

                <div className="my-4">Select Seed Phrase:</div>
                <div className="flex flex-wrap gap-2">
                    {shuffleWords.map((word, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => handleWordClick(word)}
                            className={`px-2 border rounded ${selectedWords.includes(word) ? 'bg-primary/70 text-white' : 'bg-cgray-300 text-cgray-700'}`}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

export default SeedPhraseInput;
