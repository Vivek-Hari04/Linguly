import { useLanguage } from '../../contexts/LanguageContext';
import LanguageCard from './LanguageCard';

export default function LanguageGrid() {
  const { getAllLanguages, selectedLanguage } = useLanguage();
  const languages = getAllLanguages();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {languages.map(({ code, name, difficulty }) => (
        <LanguageCard
          key={code}
          code={code}
          name={name}
          difficulty={difficulty}
          isSelected={selectedLanguage === code}
        />
      ))}
    </div>
  );
}