// src/components/questions/DialogChoice.jsx
import React, { useState } from 'react';

export default function DialogChoice({ 
  prompt = '', 
  choices = [], 
  correctIndex = 0, 
  onAnswer = () => {} 
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (index) => {
    if (isAnswered) return;

    setSelectedIndex(index);
    setIsAnswered(true);
    
    const isCorrect = index === correctIndex;
    onAnswer(isCorrect, choices[index]);
  };

  const getChoiceClass = (index) => {
    const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all";
    
    if (!isAnswered) {
      return `${baseClass} border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer bg-white`;
    }

    if (index === correctIndex) {
      return `${baseClass} border-green-500 bg-green-100 text-green-800`;
    }

    if (index === selectedIndex && index !== correctIndex) {
      return `${baseClass} border-red-500 bg-red-100 text-red-800`;
    }

    return `${baseClass} border-gray-300 bg-gray-50 text-gray-500 opacity-50 cursor-not-allowed`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-lg text-gray-800 font-medium">{prompt}</p>
        </div>

        <div className="space-y-3">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={isAnswered}
              className={getChoiceClass(index)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-base">{choice}</p>
                </div>
                {isAnswered && index === correctIndex && (
                  <span className="text-green-600 font-bold text-xl flex-shrink-0">✓</span>
                )}
                {isAnswered && index === selectedIndex && index !== correctIndex && (
                  <span className="text-red-600 font-bold text-xl flex-shrink-0">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`mt-6 p-4 rounded-lg ${selectedIndex === correctIndex ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
            <p className={`font-semibold ${selectedIndex === correctIndex ? 'text-green-800' : 'text-red-800'}`}>
              {selectedIndex === correctIndex ? 'Great choice! This is the most appropriate response.' : 'Not quite. The better response would be the highlighted one.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}