// src/components/questions/AudioMCQ.jsx
import React, { useState, useRef } from 'react';

export default function AudioMCQ({ 
  audioUrl = '', 
  options = [], 
  correctIndex = 0, 
  onAnswer = () => {} 
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayAudio = () => {
    if (!audioUrl) {
      console.warn('No audio URL provided');
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play().catch(err => {
          console.error('Audio playback failed:', err);
        });
      }
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSelect = (index) => {
    if (isAnswered) return;

    setSelectedIndex(index);
    setIsAnswered(true);
    
    const isCorrect = index === correctIndex;
    onAnswer(isCorrect, options[index]);
  };

  const getButtonClass = (index) => {
    const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all";
    
    if (!isAnswered) {
      return `${baseClass} border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer`;
    }

    if (index === correctIndex) {
      return `${baseClass} border-green-500 bg-green-100 text-green-800`;
    }

    if (index === selectedIndex && index !== correctIndex) {
      return `${baseClass} border-red-500 bg-red-100 text-red-800`;
    }

    return `${baseClass} border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Listen and select what you hear
        </h3>

        <div className="flex justify-center mb-8">
          <button
            onClick={handlePlayAudio}
            className={`px-8 py-4 rounded-full ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold shadow-lg transition-all`}
          >
            {isPlaying ? '⏸ Stop' : '▶ Play Audio'}
          </button>
        </div>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={handleAudioPlay}
            onEnded={handleAudioEnded}
            className="hidden"
          />
        )}

        {!audioUrl && (
          <div className="text-center text-gray-500 mb-6">
            <p className="text-sm">TODO: Audio file not available</p>
          </div>
        )}

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={isAnswered}
              className={getButtonClass(index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{option}</span>
                {isAnswered && index === correctIndex && (
                  <span className="text-green-600 font-bold">✓</span>
                )}
                {isAnswered && index === selectedIndex && index !== correctIndex && (
                  <span className="text-red-600 font-bold">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`mt-6 p-4 rounded-lg ${selectedIndex === correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-semibold">
              {selectedIndex === correctIndex ? 'Correct!' : 'Incorrect'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}