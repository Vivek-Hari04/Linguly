import { useProgress } from '../../contexts/ProgressContext';

export default function ProgressOverview() {
  const { progress, isLoading } = useProgress();

  if (isLoading || !progress) {
    return null;
  }

  const stats = [
    { label: 'XP', value: progress.xp || 0, icon: '⭐' },
    { label: 'Words', value: progress.wordsLearned || 0, icon: '📚' },
    { label: 'Streak', value: progress.streak || 0, icon: '🔥' },
    { label: 'Completed', value: progress.completedLevels?.length || 0, icon: '✅' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Your Progress
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-4 rounded-lg
                       bg-gradient-to-br from-blue-50 to-purple-50
                       dark:from-gray-700 dark:to-gray-800
                       border border-transparent dark:border-gray-700
                       transition-all"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>

            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stat.value}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
