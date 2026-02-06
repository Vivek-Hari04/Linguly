// src/components/questions/ErrorCorrection.jsx
import React, { useState } from 'react';

export default function ErrorCorrection({ 
  sentence = '', 
  incorrectPart = '', 
  correctPart = '', 
  onSubmit = () => {} 
}) {
  const [editedSentence, setEditedSentence] = useState(sentence);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct = editedSentence.includes(correctPart) && !editedSentence.includes(incorrectPart);
    setIsCorrect(correct);
    setIsSubmitted(true);
    onSubmit(correct, editedSentence);
  };

  const handleReset = () => {
    setEditedSentence(sentence);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const highlightError = (text) => {
    if (!incorrectPart || isSubmitted) return text;
    
    const parts = text.split(incorrectPart);
    if (parts.length === 1) return text;

    return (
      <>
        {parts[0]}
        <span className="bg-red-200 text-red-800 px-1 rounded">{incorrectPart}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Find and correct the error in this sentence
        </h3>

        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <p className="text-lg text-gray-800">
            {highlightError(sentence)}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your correction:
          </label>
          <textarea
            value={editedSentence}
            onChange={(e) => setEditedSentence(e.target.value)}
            disabled={isSubmitted}
            rows="3"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        {isSubmitted && (
          <div className={`mb-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">
              {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
            </p>
            {!isCorrect && (
              <div className="text-sm mt-2">
                <p>The error was: <span className="line-through">{incorrectPart}</span></p>
                <p>It should be: <strong>{correctPart}</strong></p>
              </div>
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
                disabled={editedSentence === sentence}
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