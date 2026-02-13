import { useNavigate } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';

const FLAG_EMOJIS = {
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  jp: '🇯🇵',
  cn: '🇨🇳'
};

export default function LanguageCard({ code, name, difficulty, isSelected }) {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate(`/course/${code}`);
  };

  return (
    <button
      onClick={handleSelect}
      className={`p-6 rounded-xl border-2 transition-all text-left w-full ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-300 hover:border-gray-400 hover:shadow-md bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-5xl">{FLAG_EMOJIS[code] || '🌐'}</div>
        <DifficultyBadge difficulty={difficulty} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
      <p className="text-sm text-gray-600">Start learning {name}</p>
    </button>
  );
}