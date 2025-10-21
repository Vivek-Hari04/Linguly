import { Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function LevelCard({ level, title, subtitle, locked, completed, onClick }) {
  const { translate } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: locked ? 1 : 1.02 }}
      className={`level-card ${locked ? 'level-card-locked' : ''} dark:level-card-dark ${locked ? 'dark:level-card-locked-dark' : ''}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {title}
            </h3>
            {completed && (
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                <CheckCircle className="h-4 w-4" />
                {translate('Completed', 'Completed')}
              </div>
            )}
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>
        {locked && (
          <div className="flex-shrink-0 ml-4">
            <Lock className="h-6 w-6 text-slate-400" />
          </div>
        )}
      </div>
      
      <button
        onClick={onClick}
        disabled={locked}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 focus-ring ${
          locked 
            ? 'btn-disabled' 
            : completed 
            ? 'btn-secondary' 
            : 'btn-primary'
        }`}
      >
        {locked 
          ? translate('Locked', 'Locked')
          : completed 
          ? translate('Practice Again', 'Practice Again')
          : translate('Start Level', 'Start Level')
        }
      </button>
    </motion.div>
  );
}