import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, label, icon, color }) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  const getColorClass = () => {
    switch (color) {
      case 'xp':
        return 'progress-xp';
      case 'words':
        return 'progress-words';
      case 'streak':
        return 'progress-streak';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </span>
        </div>
        <span className="text-lg font-bold text-slate-600 dark:text-slate-400">
          {current}/{total}
        </span>
      </div>
      
      <div className="progress-container">
        <motion.div
          className={`progress-fill ${getColorClass()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: 0.2
          }}
        />
      </div>
    </div>
  );
}