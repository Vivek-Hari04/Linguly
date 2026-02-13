// src/components/questions/ReorderSentence.jsx
import React, { useState, useEffect } from 'react';

export default function ReorderSentence({ 
  words = [], 
  correctOrder = [], 
  onComplete = () => {} 
}) {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const handleWordClick = (word, fromSelected = false) => {
    if (isSubmitted) return;

    if (fromSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setShuffledWords(prev => [...prev, word]);
    } else {
      setSelectedWords(prev => [...prev, word]);
      setShuffledWords(prev => prev.filter(w => w !== word));
    }
  };

  const handleSubmit = () => {
    const correct = JSON.stringify(selectedWords) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setIsSubmitted(true);
    onComplete(correct, selectedWords);
  };

  const handleReset = () => {
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Arrange the words to form a correct sentence
        </h3>

        <div className="mb-6 min-h-20 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {selectedWords.length > 0 ? (
              selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, true)}
                  disabled={isSubmitted}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {word}
                </button>
              ))
            ) : (
              <p className="text-gray-400 text-center w-full">Click words below to build your sentence</p>
            )}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {shuffledWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordClick(word, false)}
                disabled={isSubmitted}
                className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-800 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {isSubmitted && (
          <div className={`mb-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            {!isCorrect && (
              <p className="text-sm mt-1">
                Correct order: <strong>{correctOrder.join(' ')}</strong>
              </p>
            )}
          </div>
        )}

        <div className="flex justify-center gap-3">
          {!isSubmitted ? (
            <>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Reset
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedWords.length === 0}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            </>
          ) : (
            <button
              onClick={handleReset}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}