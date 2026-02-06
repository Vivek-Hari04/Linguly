import { useProgress } from '../../contexts/ProgressContext';
import { isLevelUnlocked } from '../../utils/unlockRules';

export default function UnlockGate({ level, children, renderLocked }) {
  const progressHelpers = useProgress();

  if (!level) {
    return children;
  }

  const unlocked = isLevelUnlocked(level, progressHelpers);

  if (!unlocked) {
    if (renderLocked) {
      return renderLocked(level);
    }

    return (
      <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">{level.title}</h3>
        <p className="text-gray-600 mb-4">{level.goal}</p>
        <div className="bg-white rounded p-3">
          <p className="text-sm text-gray-500">
            {getUnlockMessage(level.unlockRule)}
          </p>
        </div>
      </div>
    );
  }

  return children;
}

function getUnlockMessage(unlockRule) {
  if (!unlockRule) return 'Complete previous requirements to unlock';

  switch (unlockRule.type) {
    case 'default':
      return 'Available now';

    case 'previousLevel':
      return `Complete ${unlockRule.levelId} with ${unlockRule.minScore || 0}% to unlock`;

    case 'skillMastery':
      return `Achieve ${unlockRule.minAccuracy || 0}% accuracy in ${unlockRule.skill} to unlock`;

    case 'conversationMastery':
      return `Achieve ${unlockRule.minAccuracy || 0}% conversation accuracy to unlock`;

    default:
      return 'Complete previous requirements to unlock';
  }
}