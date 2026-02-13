import { getSublevelById } from '../../utils/unlockRules';
import VocabularyPractice from '../sublevels/VocabularyPractice';
import GrammarPractice from '../sublevels/GrammarPractice';
import SentencePractice from '../sublevels/SentencePractice';
import ListeningPractice from '../sublevels/ListeningPractice';
import ConversationPractice from '../sublevels/ConversationPractice';
import PronunciationPractice from '../sublevels/PronunciationPractice';
import Assessment from '../sublevels/Assessment';

// Skill to component mapping - data-driven routing
const SKILL_COMPONENT_MAP = {
  vocabulary: VocabularyPractice,
  grammar: GrammarPractice,
  sentence: SentencePractice,
  syntax: SentencePractice,
  listening: ListeningPractice,
  conversation: ConversationPractice,
  speaking: ConversationPractice,
  pronunciation: PronunciationPractice,
  pragmatics: ConversationPractice,
  expression: SentencePractice
};

export default function SublevelRenderer({ levelId, sublevelId, sublevel, onComplete }) {
  const sublevelData = sublevel || getSublevelById(levelId, sublevelId);

  if (!sublevelData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-xl font-semibold">Sublevel not found</div>
          <div className="text-gray-600 mt-2">
            {levelId} / {sublevelId}
          </div>
        </div>
      </div>
    );
  }

  const { type, skills } = sublevelData;

  // Route by type first (e.g., assessment)
  if (type === 'assessment') {
    return (
      <Assessment
        levelId={levelId}
        sublevel={sublevelData}
        onComplete={onComplete}
      />
    );
  }

  // Route based on primary skill
  const primarySkill = skills?.[0];

  if (!primarySkill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-2xl mb-4">🚧</div>
          <div className="font-semibold text-gray-700 mb-2">
            TODO: No skills defined for this sublevel
          </div>
          <div className="text-sm text-gray-500">
            {sublevelData.sublevelId}
          </div>
        </div>
      </div>
    );
  }

  const Component = SKILL_COMPONENT_MAP[primarySkill];

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg max-w-md">
          <div className="text-2xl mb-4">🚧</div>
          <div className="font-semibold text-gray-700 mb-2">
            TODO: Component not yet implemented
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Skill: <span className="font-medium">{primarySkill}</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded">
            <div className="font-medium mb-1">Sublevel Info:</div>
            <div>{sublevelData.title}</div>
            <div className="mt-1">Skills: {skills.join(', ')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Component
      levelId={levelId}
      sublevel={sublevelData}
      onComplete={onComplete}
    />
  );
}