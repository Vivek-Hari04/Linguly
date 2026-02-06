// src/components/questions/Paraphrase.jsx
import React, { useState } from 'react';

export default function Paraphrase({ 
  sentence = '', 
  expectedKeywords = [], 
  onSubmit = () => {} 
}) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const inputLower = userInput.toLowerCase();
    const matched = expectedKeywords.filter(keyword => 
      inputLower.includes(keyword.toLowerCase())
    );

    const calculatedScore = expectedKeywords.length > 0 
      ? Math.round((matched.length / expectedKeywords.length) * 100)
      : 100;

    setMatchedKeywords(matched);
    setScore(calculatedScore);
    setIsSubmitted(true);

    const isAcceptable = calculatedScore >= 60;
    onSubmit(isAcceptable, userInput, calculatedScore);
  };

  const handleReset = () => {
    setUserInput('');
    setIsSubmitted(false);
    setMatchedKeywords([]);
    setScore(0);
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = () => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Paraphrase the following sentence
        </h3>

        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-lg text-gray-800 italic">"{sentence}"</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your paraphrase:
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isSubmitted}
            rows="4"
            placeholder="Write the sentence in your own words..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Try to use different words while keeping the same meaning
          </p>
        </div>

        {isSubmitted && (
          <div className={`mb-6 p-4 rounded-lg ${getScoreBackground()}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-800">
                Paraphrase Quality
              </p>
              <p className={`text-xl font-bold ${getScoreColor()}`}>
                {score}%
              </p>
            </div>
            
            {expectedKeywords.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-700 mb-1">
                  Key concepts found: {matchedKeywords.length} / {expectedKeywords.length}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expectedKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs ${
                        matchedKeywords.includes(keyword)
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mt-3">
              {score >= 80 ? 'Excellent paraphrase!' : score >= 60 ? 'Good effort! Try to include more key concepts.' : 'Try again and include the key concepts.'}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Paraphrase
            </button>
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