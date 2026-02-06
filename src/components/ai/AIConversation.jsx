// src/components/ai/AIConversation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { generateConversationResponse, analyzeUserMessage } from '../../services/gemini';
import AIFeedback from './AIFeedback';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'models/gemini-2.5-flash';
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`;

const AIConversation = ({ sublevel, languageCode, languageName, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);
  const hasCompleted = useRef(false);

  const MIN_TURNS = 10;
  const MAX_TURNS = 20;

  // ---------- INITIALIZE (ONCE PER SUBLEVEL) ----------
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      setIsInitializing(true);

      const greeting = {
        role: 'assistant',
        content: `Hola! Practiquemos ${languageName} juntos.`,
        timestamp: new Date()
      };

      setMessages([greeting]);
      setIsInitializing(false);
    };

    init();
  }, [sublevel?.sublevelId, languageName]);

  // ---------- AUTOSCROLL ----------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ---------- SEND MESSAGE ----------
  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading || turnCount >= MAX_TURNS) return;

    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeUserMessage(
        userInput,
        languageCode,
        nextMessages
      );

      if (analysis?.feedback) {
        setFeedback(analysis.feedback);
      }

      const responseText = await generateConversationResponse(
        userInput,
        languageCode,
        languageName,
        nextMessages
      );

      const assistantMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTurnCount(c => c + 1);

    } catch (err) {
      console.error(err);
      setError('AI error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- COMPLETE ----------
  const handleEndConversation = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;

    const score = Math.min(70 + turnCount * 2, 100);

    onComplete?.({
      completed: true,
      score
    });

    setIsComplete(true);
  };

  // ---------- UI ----------
  if (isInitializing) {
    return <div className="p-6 text-center">Loading conversation...</div>;
  }

  if (isComplete) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Conversation Complete</h2>
        <p>Turns: {turnCount}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleEndConversation}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <p>{m.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {feedback && <AIFeedback feedback={feedback} onDismiss={() => setFeedback(null)} />}

      <div className="p-4 border-t">
        <textarea
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          rows={2}
          disabled={isLoading || turnCount >= MAX_TURNS}
          className="w-full border p-2"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !userInput.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>

        {turnCount >= MIN_TURNS && (
          <button
            onClick={handleEndConversation}
            className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default AIConversation;
