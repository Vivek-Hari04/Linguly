// src/components/sublevels/ConversationSublevel.jsx
import React, { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import QuestionRenderer from '../QuestionRenderer';

const ConversationSublevel = ({ sublevel, languageCode, content }) => {
  const { updateSublevelProgress } = useProgress();
  const [scenarios, setScenarios] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const generatedScenarios = generateConversationScenarios(sublevel, content);
    setScenarios(generatedScenarios);
  }, [sublevel, content]);

  const generateConversationScenarios = (sublevel, content) => {
    // TODO: Load scenario-based conversation data from content
    const placeholderScenarios = [
      {
        id: 'scenario-1',
        title: 'At a Restaurant',
        context: 'You are ordering food at a restaurant',
        turns: [
          {
            type: 'npc',
            text: 'Welcome! What would you like to order?'
          },
          {
            type: 'player',
            prompt: 'How do you respond?',
            options: [
              { text: 'I would like the menu, please', correct: true },
              { text: 'Give me food now', correct: false },
              { text: 'Where is bathroom?', correct: false }
            ]
          },
          {
            type: 'npc',
            text: 'Here is the menu. Take your time.'
          },
          {
            type: 'player',
            prompt: 'What do you say?',
            options: [
              { text: 'Thank you', correct: true },
              { text: 'No thanks', correct: false },
              { text: 'More water', correct: false }
            ]
          }
        ]
      },
      {
        id: 'scenario-2',
        title: 'Asking for Directions',
        context: 'You need to find the train station',
        turns: [
          {
            type: 'npc',
            text: 'Hello, can I help you?'
          },
          {
            type: 'player',
            prompt: 'Ask for directions',
            options: [
              { text: 'Excuse me, where is the train station?', correct: true },
              { text: 'I am lost', correct: false },
              { text: 'Give me directions', correct: false }
            ]
          }
        ]
      }
    ];

    return placeholderScenarios;
  };

  const handleAnswer = (answer, isCorrect) => {
    const newAnswers = [...answers, { answer, isCorrect }];
    setAnswers(newAnswers);

    const currentScenario = scenarios[currentScenarioIndex];
    
    if (currentTurnIndex < currentScenario.turns.length - 1) {
      setCurrentTurnIndex(currentTurnIndex + 1);
    } else if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setCurrentTurnIndex(0);
    } else {
      completeSection(newAnswers);
    }
  };

  const completeSection = (finalAnswers) => {
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / finalAnswers.length) * 100);

    updateSublevelProgress(sublevel.sublevelId, {
      completed: true,
      score,
      attempts: finalAnswers.length
    });

    setIsComplete(true);
  };

  if (scenarios.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Loading conversation scenarios...</p>
        <p className="text-sm text-gray-500 mt-2">TODO: Load scenario data from content</p>
      </div>
    );
  }

  if (isComplete) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / answers.length) * 100);

    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Scenarios Complete!</h2>
        <p className="text-xl mb-2">Score: {score}%</p>
        <p className="text-gray-600 mb-6">
          {correctCount} out of {answers.length} correct
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];
  const currentTurn = currentScenario.turns[currentTurnIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">{currentScenario.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{currentScenario.context}</p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Scenario {currentScenarioIndex + 1} of {scenarios.length}
        </span>
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        {currentScenario.turns.slice(0, currentTurnIndex + 1).map((turn, idx) => (
          <div key={idx}>
            {turn.type === 'npc' ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  👤
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                  <p className="text-gray-800">{turn.text}</p>
                </div>
              </div>
            ) : idx === currentTurnIndex ? (
              <div className="mt-6">
                <p className="text-gray-700 font-medium mb-3">{turn.prompt}</p>
                <div className="space-y-2">
                  {turn.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(option.text, option.correct)}
                      className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationSublevel;