import { useLanguage } from "../../contexts/LanguageContext";

export default function LanguageGuard({ children, fallback = null }) {
  const { selectedLanguage, isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!selectedLanguage) {
    return fallback;
  }

  return children;
}
