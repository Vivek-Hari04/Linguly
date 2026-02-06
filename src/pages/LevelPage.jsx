import { useParams } from 'react-router-dom';
import LanguageGuard from '../components/shared/LanguageGuard';
import LevelView from '../components/course/LevelView';

export default function LevelPage() {
  const { levelId } = useParams();

  return (
    <LanguageGuard>
      <LevelView levelId={levelId} />
    </LanguageGuard>
  );
}