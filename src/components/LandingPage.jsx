import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Sparkles, CheckCircle } from 'lucide-react';
import { languages, getDifficultyColor } from '../data/languages';
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingPage({ onLanguageSelect }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { selectedLanguage: currentLanguage, getLanguageInfo } = useLanguage();

  const handleLanguageClick = async (language) => {
    setSelectedLanguage(language);
    setIsTranslating(true);
    
    try {
      // Simulate translation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the parent handler
      onLanguageSelect(language);
    } catch (error) {
      console.error('Language selection failed:', error);
      // Still proceed with language selection
      onLanguageSelect(language);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="relative inline-block">
              <div className="text-6xl mb-2">🗣️</div>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-slate-800 mb-4"
          >
            Choose Your Language
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6"
          >
            Start your journey to fluency. Pick a language and learn at your own pace with interactive lessons.
          </motion.p>

          {/* Current Language Indicator */}
          {currentLanguage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 px-6 py-3 rounded-full shadow-sm"
            >
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Currently learning: {getLanguageInfo()?.flag} {getLanguageInfo()?.name}
              </span>
            </motion.div>
          )}
        </div>

        {/* Popular Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-slate-600" />
            <h2 className="text-2xl font-semibold text-slate-800">
              Popular Languages
            </h2>
          </div>
        </motion.div>

        {/* Language Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {languages.map((language, index) => (
            <motion.div
              key={language.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
              onClick={() => handleLanguageClick(language)}
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 group-hover:border-gray-200">
                {/* Language Code */}
                <div className="text-4xl font-bold text-slate-800 mb-4">
                  {language.code}
                </div>
                
                {/* Language Names */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">
                    {language.name}
                  </h3>
                  <p className="text-slate-600 text-lg">
                    {language.nativeName}
                  </p>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {language.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        tag === 'Popular' 
                          ? 'bg-gray-100 text-gray-700'
                          : getDifficultyColor(language.difficulty)
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Learner Count */}
                <div className="text-slate-500 text-sm font-medium">
                  {language.learners} learners
                </div>
                
                {/* Selection Indicator */}
                {selectedLanguage?.code === language.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 flex items-center justify-center"
                  >
                    {isTranslating ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-sm font-medium">Setting up your learning experience...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Current Language Indicator */}
                {currentLanguage === language.code && selectedLanguage?.code !== language.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 flex items-center justify-center"
                  >
                    <div className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Currently Learning</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Overlay */}
        {isTranslating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Setting up your learning experience...
              </h3>
              <p className="text-slate-600">
                Generating personalized lessons for {selectedLanguage?.name}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}