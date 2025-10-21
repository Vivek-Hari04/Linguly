import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';

export default function Celebration({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: 2,
                delay: 0.2
              }}
              className="text-6xl mb-6"
            >
              🎉
            </motion.div>
            
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Level Complete!
            </h2>
            
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
              Great job! You've mastered this level.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-yellow-500">
              <Trophy className="h-6 w-6" />
              <Star className="h-6 w-6" />
              <Sparkles className="h-6 w-6" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}