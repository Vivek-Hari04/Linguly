import { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ChevronRight, Trophy, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { generateTranslationHint } from '../services/gemini';
import { speak, LANGUAGE_CODES } from '../utils/textToSpeech';

export default function FillInBlank({ sentence, answer, options, onCorrect, onNext, isLastQuestion, translate }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [translationHint, setTranslationHint] = useState('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const { selectedLanguage } = useLanguage();

  const handleSelect = (option) => {
    if (hasAnswered) return;
    
    setSelectedOption(option);
    setHasAnswered(true);
    const isCorrect = option === answer;
    
    // Call the onCorrect callback immediately
    onCorrect(isCorrect);
  };

  const handleGetHint = async () => {
    if (isLoadingHint || translationHint) return;
    
    try {
      setIsLoadingHint(true);
      const hint = await generateTranslationHint(sentence, selectedLanguage);
      setTranslationHint(hint);
    } catch (error) {
      console.error('Error getting translation hint:', error);
      setTranslationHint('Unable to get translation hint.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleSpeakOption = (option) => {
    speak(option, LANGUAGE_CODES[selectedLanguage]);
  };

  const getButtonClasses = (option) => {
    if (!hasAnswered) {
      return "w-full py-4 pl-6 pr-16 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all duration-200 focus-ring";
    }
    if (option === answer) {
      return "w-full py-4 pl-6 pr-16 rounded-xl border-2 border-green-500 bg-green-50 text-green-800 font-semibold transition-all duration-200";
    }
    if (option === selectedOption && option !== answer) {
      return "w-full py-4 pl-6 pr-16 rounded-xl border-2 border-red-500 bg-red-50 text-red-800 font-semibold transition-all duration-200";
    }
    return "w-full py-4 pl-6 pr-16 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500 font-semibold transition-all duration-200";
  };

  const getButtonIcon = (option) => {
    if (!hasAnswered) return null;
    if (option === answer) return <CheckCircle2 className="h-5 w-5 ml-2 text-green-600" />;
    if (option === selectedOption && option !== answer) return <XCircle className="h-5 w-5 ml-2 text-red-600" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="modern-card dark:modern-card-dark"
    >
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-xl font-medium text-slate-800 dark:text-white leading-relaxed mb-4">
            {translate(sentence, sentence)}
          </p>
          
          {/* Hint Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGetHint}
              disabled={isLoadingHint || translationHint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-300 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingHint ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span>Getting hint...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4" />
                  <span>{translationHint ? 'Hint shown' : 'Get translation hint'}</span>
                </>
              )}
            </button>
          </div>
          
          {/* Translation Hint */}
          {translationHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
            >
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">English translation:</p>
              <p className="text-blue-700 dark:text-blue-300 italic">{translationHint}</p>
            </motion.div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {options.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative"
            >
              <button
                onClick={() => handleSelect(option)}
                disabled={hasAnswered}
                className={getButtonClasses(option)}
              >
                <div className="flex items-center justify-between">
                  <span>{translate(option, option)}</span>
                  <div className="flex items-center gap-2">
                    {getButtonIcon(option)}
                  </div>
                </div>
              </button>
              
              {/* Voice Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeakOption(option);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200 opacity-70 hover:opacity-100"
                title={`Pronounce "${option}"`}
              >
                <Volume2 className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </button>
            </motion.div>
          ))}
        </div>

        {hasAnswered && selectedOption === answer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center text-green-600 dark:text-green-400 text-lg font-semibold"
          >
            ✓ {translate('Correct!', 'Correct!')}
          </motion.div>
        )}
        {hasAnswered && selectedOption !== answer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center text-red-600 dark:text-red-400 text-lg font-semibold"
          >
            ✗ {translate('The correct answer is:', 'The correct answer is:')} {translate(answer, answer)}
          </motion.div>
        )}

        {/* Next Button */}
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex justify-center pt-4"
          >
            <button
              onClick={onNext}
              className="btn-primary flex items-center gap-2 px-6 py-3"
            >
              {isLastQuestion ? (
                <>
                  {translate('Finish Level', 'Finish Level')}
                  <Trophy className="h-5 w-5" />
                </>
              ) : (
                <>
                  {translate('Next Question', 'Next Question')}
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}