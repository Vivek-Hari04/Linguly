// src/components/sublevels/SentenceSublevel.jsx
import React, { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import QuestionRenderer from '../QuestionRenderer';

const SentenceSublevel = ({ sublevel, languageCode, content }) => {
  const { updateSublevelProgress } = useProgress();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const generatedQuestions = generateSentenceQuestions(content);
    setQuestions(generatedQuestions);
  }, [content]);

  const generateSentenceQuestions = (content) => {
    if (!content || !Array.isArray(content)) {
      return [];
    }

    return content.map((item, index) => ({
      type: 'fill-in-blank',
      id: `sentence-${index}`,
      prompt: item.prompt,
      answer: item.answer,
      options: item.options || []
    }));
  };

  const handleAnswer = (answer, isCorrect) => {
    const newAnswers = [...answers, { answer, isCorrect }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
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

  if (questions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">No sentence questions available for this language yet.</p>
        <p className="text-sm text-gray-500 mt-2">TODO: Generate sentence completion questions</p>
      </div>
    );
  }

  if (isComplete) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / answers.length) * 100);

    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Section Complete!</h2>
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <QuestionRenderer
        question={currentQuestion}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default SentenceSublevel;