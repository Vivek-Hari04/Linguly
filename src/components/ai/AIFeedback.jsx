// src/components/ai/AIFeedback.jsx
import React from 'react';

const AIFeedback = ({ feedback, onDismiss }) => {
  if (!feedback) return null;

  const { grammarIssues = [], suggestions = [], naturalness = 0, overall = '' } = feedback;

  const getNaturalnessColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNaturalnessLabel = (score) => {
    if (score >= 80) return 'Natural';
    if (score >= 60) return 'Understandable';
    return 'Needs Work';
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-semibold text-gray-800">Feedback on your message</h4>
            {naturalness > 0 && (
              <span className={`text-sm font-medium ${getNaturalnessColor(naturalness)}`}>
                {getNaturalnessLabel(naturalness)} ({naturalness}%)
              </span>
            )}
          </div>

          {overall && (
            <p className="text-sm text-gray-700 mb-3">{overall}</p>
          )}

          {grammarIssues.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Grammar Issues:</p>
              <ul className="list-disc list-inside space-y-1">
                {grammarIssues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    <span className="line-through">{issue.incorrect}</span>
                    {' → '}
                    <span className="text-green-700 font-medium">{issue.correct}</span>
                    {issue.explanation && (
                      <span className="text-gray-500"> ({issue.explanation})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-gray-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="ml-4 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss feedback"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AIFeedback;