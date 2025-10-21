import { useState } from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { speak, LANGUAGE_CODES } from '../utils/textToSpeech';

export default function Flashcard({ word, translation, image, language, onHint, isGeneratingHint = false }) {
  const [flipped, setFlipped] = useState(false);
  const { translate } = useLanguage();

  const handleSpeak = () => {
    speak(word, LANGUAGE_CODES[language]);
  };

  return (
    <div className="flashcard-container">
      <motion.div
        className="flashcard"
        onClick={() => setFlipped(!flipped)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="flashcard-front backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-8xl mb-8">{image}</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">
            {translate(word, word)}
          </h2>
          <p className="text-slate-500 text-center text-lg">
            {translate('Tap to reveal', 'Tap to reveal')}
          </p>
        </div>

        {/* Back of card */}
        <div
          className="flashcard-back backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="text-8xl mb-8">{image}</div>
          <h2 className="text-3xl font-bold mb-4 text-center">
            {translate(word, word)}
          </h2>
          <p className="text-center text-xl opacity-90">
            {translate(translation, translation)}
          </p>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-4 justify-center mt-8">
        <button
          className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 focus-ring"
          onClick={handleSpeak}
          title={translate('Pronounce word', 'Pronounce word')}
        >
          <Volume2 className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button
          className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onHint}
          disabled={isGeneratingHint}
          title={translate('Get AI hint', 'Get AI hint')}
        >
          {isGeneratingHint ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-600 border-t-transparent"></div>
          ) : (
            <Lightbulb className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          )}
        </button>
      </div>
    </div>
  );
}