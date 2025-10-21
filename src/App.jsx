import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, Trophy, Moon, Sun, Globe } from 'lucide-react'
import './index.css'
import LandingPage from './components/LandingPage'
import LevelCard from './components/LevelCard'
import Flashcard from './components/Flashcard'
import FillInBlank from './components/FillInBlank'
import ProgressBar from './components/ProgressBar'
import Celebration from './components/Celebration'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { updateProgress, checkStreak } from './services/storage'
import { generateHint } from './services/gemini'

function AppContent() {
  const [view, setView] = useState('landing'); // landing | levels | flashcards | quiz
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [aiHint, setAiHint] = useState('');
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasAutoNavigated, setHasAutoNavigated] = useState(false);
  const [userWantsLanding, setUserWantsLanding] = useState(false);

  const { 
    selectedLanguage, 
    lessons, 
    progress, 
    isLoading, 
    isGeneratingContent,
    translate, 
    changeLanguage, 
    updateProgress: updateProgressContext,
    getCurrentLevel,
    getLanguageInfo
  } = useLanguage();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check streak for current language
    if (selectedLanguage) {
      checkStreak(selectedLanguage);
    }
  }, [selectedLanguage]);

  // Auto-navigate to levels if language is already selected (only on first load)
  useEffect(() => {
    if (selectedLanguage && view === 'landing' && !isLoading && !hasAutoNavigated && !userWantsLanding) {
      // Only auto-navigate once on first load if a language is already selected
      setView('levels');
      setHasAutoNavigated(true);
    }
  }, [selectedLanguage, isLoading, hasAutoNavigated, userWantsLanding]);

  const level = getCurrentLevel(currentLevel);
  const languageInfo = getLanguageInfo();

  const handleLanguageSelect = async (selectedLang) => {
    // Force refresh content for the selected language
    await changeLanguage(selectedLang.code, true);
    setView('levels');
    // Reset the user wants landing flag since they've selected a language
    setUserWantsLanding(false);
  };

  const handleLevelSelect = (lvl) => {
    setCurrentLevel(lvl);
    setCurrentFlashcardIndex(0);
    setCurrentQuizIndex(0);
    setView('flashcards');
  };

  const handleQuizAnswer = (isCorrect) => {
    // Handle individual quiz answer - could be used for scoring
    console.log('Quiz answer:', isCorrect ? 'Correct' : 'Incorrect');
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < level.fillInBlanks.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      // Quiz completed
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    if (!level || !selectedLanguage) return;

    const newProgress = updateProgress(selectedLanguage, {
      xp: progress.xp + level.xpReward,
      wordsLearned: progress.wordsLearned + level.flashcards.length,
      completedLevels: Array.from(new Set([...(progress.completedLevels || []), currentLevel]))
    });

    updateProgressContext(newProgress);

    if (currentLevel < 3) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setCurrentLevel(currentLevel + 1);
        setView('levels');
      }, 1800);
    } else {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setView('levels');
      }, 1800);
    }
  };

  const getHint = async (word) => {
    if (!selectedLanguage) return;
    
    try {
      setIsGeneratingHint(true);
      setAiHint('Generating hint...');
      console.log('Generating hint for word:', word, 'in language:', selectedLanguage);
      
      const hint = await generateHint(word, selectedLanguage);
      console.log('Generated hint:', hint);
      
      if (hint && hint.trim()) {
        setAiHint(hint);
      } else {
        setAiHint('Unable to generate hint. Please try again.');
      }
    } catch (e) {
      console.error('Error in getHint:', e);
      setAiHint('Unable to fetch hint. Please check your internet connection.');
    } finally {
      setIsGeneratingHint(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const goToLanding = () => {
    setView('landing');
    // Reset current level and indices when going back to landing
    setCurrentLevel(1);
    setCurrentFlashcardIndex(0);
    setCurrentQuizIndex(0);
    // Reset auto-navigation flag so user can manually navigate
    setHasAutoNavigated(false);
    // Set flag to indicate user wants to go to landing page
    setUserWantsLanding(true);
    // Clear the selected language so user can choose a new one
    // This will be handled by the language selection process
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your language learning experience...</p>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return <LandingPage onLanguageSelect={handleLanguageSelect} />;
  }

  if (selectedLanguage && (!lessons || !languageInfo)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Generating lessons for {languageInfo?.name || 'your language'}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-modern dark:bg-gradient-modern-dark transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🗣️</div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                {translate('Language Learner', 'Language Learner')}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Master {languageInfo?.name || 'your language'} one word at a time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={goToLanding}
              className="btn-outline flex items-center gap-2"
              title="Change Language"
            >
              <Globe className="h-4 w-4" />
              {translate('Change Language', 'Change Language')}
            </button>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 focus-ring"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </button>
            {view !== 'levels' && (
              <button 
                className="btn-outline flex items-center gap-2"
                onClick={() => setView('levels')}
              >
                <ArrowLeft className="h-4 w-4" />
                {translate('Back to Levels', 'Back to Levels')}
              </button>
            )}
          </div>
        </header>

        {/* Language Indicator */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <span className="text-2xl">{languageInfo.flag}</span>
            <span className="text-lg font-semibold text-slate-800 dark:text-white">
              Learning {languageInfo.name}
            </span>
            {isGeneratingContent && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Generating content...</span>
              </div>
            )}
          </div>
        </div>

        {/* Levels View */}
        {view === 'levels' && (
          <div className="space-y-8 animate-slide-up">
            {/* Progress Section */}
            <div className="modern-card dark:modern-card-dark animate-bounce-in">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {translate('Your Progress', 'Your Progress')}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {translate('Keep up the great work!', 'Keep up the great work!')}
              </p>
              
              <div className="space-y-4">
                <ProgressBar 
                  current={progress.xp || 0} 
                  total={500} 
                  label="XP" 
                  icon="⭐" 
                  color="xp"
                />
                <ProgressBar 
                  current={progress.wordsLearned || 0} 
                  total={50} 
                  label="Words Learned" 
                  icon="📚" 
                  color="words"
                />
                <ProgressBar 
                  current={progress.streak || 0} 
                  total={30} 
                  label="Day Streak" 
                  icon="🔥" 
                  color="streak"
                />
              </div>
              
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {translate('Learning:', 'Learning:')}
                </span>
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-full font-semibold">
                  {languageInfo.flag} {languageInfo.name}
                </div>
              </div>
            </div>

            {/* Level Cards */}
            <div className="space-y-4">
              <LevelCard 
                level={1} 
                title={lessons.level1.title} 
                subtitle={translate('Essential words to get started', 'Essential words to get started')} 
                locked={false} 
                completed={progress.completedLevels?.includes(1)} 
                onClick={() => handleLevelSelect(1)} 
              />
              <LevelCard 
                level={2} 
                title={lessons.level2.title} 
                subtitle={translate('Common phrases for daily life', 'Common phrases for daily life')} 
                locked={false} 
                completed={progress.completedLevels?.includes(2)} 
                onClick={() => handleLevelSelect(2)} 
              />
              <LevelCard 
                level={3} 
                title={lessons.level3.title} 
                subtitle={translate('Finish Level 2 to unlock', 'Finish Level 2 to unlock')} 
                locked={!progress.completedLevels?.includes(2)} 
                completed={progress.completedLevels?.includes(3)} 
                onClick={() => !progress.completedLevels?.includes(2) ? null : handleLevelSelect(3)} 
              />
            </div>
          </div>
        )}

        {/* Flashcards View */}
        {view === 'flashcards' && level && (
          <div className="space-y-8 animate-slide-up">
            {/* Level Progress */}
            <div className="modern-card dark:modern-card-dark">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {level.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Card {currentFlashcardIndex + 1} of {level.flashcards.length}
              </p>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
              {level.flashcards.map((c, index) => (
                index === currentFlashcardIndex && (
                  <Flashcard 
                    key={c.id}
                    word={c.word} 
                    translation={c.translation} 
                    image={c.image} 
                    language={selectedLanguage}
                    onHint={() => getHint(c.word)}
                    isGeneratingHint={isGeneratingHint}
                  />
                )
              ))}
            </div>

            {/* AI Hint Display */}
            {aiHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 max-w-2xl mx-auto"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-300 text-lg">💡</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                        AI Hint
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                        {aiHint}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center gap-4">
              <button
                className="btn-outline flex items-center gap-2"
                onClick={() => {
                  setCurrentFlashcardIndex(Math.max(0, currentFlashcardIndex - 1));
                  setAiHint(''); // Clear hint when navigating
                  setIsGeneratingHint(false); // Clear loading state
                }}
                disabled={currentFlashcardIndex === 0}
              >
                <ArrowLeft className="h-4 w-4" />
                {translate('Previous', 'Previous')}
              </button>

              {currentFlashcardIndex === level.flashcards.length - 1 ? (
                <button 
                  className="btn-primary flex items-center gap-2"
                  onClick={() => {
                    setView('quiz');
                    setAiHint(''); // Clear hint when starting quiz
                    setIsGeneratingHint(false); // Clear loading state
                  }}
                >
                  {translate('Start Quiz', 'Start Quiz')}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button 
                  className="btn-primary flex items-center gap-2"
                  onClick={() => {
                    setCurrentFlashcardIndex(Math.min(level.flashcards.length - 1, currentFlashcardIndex + 1));
                    setAiHint(''); // Clear hint when navigating
                    setIsGeneratingHint(false); // Clear loading state
                  }}
                >
                  {translate('Next', 'Next')}
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz View */}
        {view === 'quiz' && level && (
          <div className="space-y-8 max-w-2xl mx-auto animate-slide-up">
            {/* Quiz Header */}
            <div className="modern-card dark:modern-card-dark">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {translate('Quick Quiz', 'Quick Quiz')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                {translate('Question', 'Question')} {currentQuizIndex + 1} {translate('of', 'of')} {level.fillInBlanks.length}
              </p>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-6">
              {level.fillInBlanks.map((q, index) => (
                index === currentQuizIndex && (
                  <FillInBlank
                    key={`${q.id}-${currentQuizIndex}`}
                    sentence={q.sentence}
                    answer={q.answer}
                    options={q.options}
                    onCorrect={handleQuizAnswer}
                    onNext={handleNextQuestion}
                    isLastQuestion={currentQuizIndex === level.fillInBlanks.length - 1}
                    translate={translate}
                  />
                )
              ))}
            </div>

          </div>
        )}

        <Celebration show={showCelebration} />
      </div>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App