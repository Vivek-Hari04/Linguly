import "./index.css";

import { useState } from "react";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { SettingsProvider } from "./contexts/SettingsContext";

import LandingPage from "./pages/LandingPage";
import CourseView from "./components/course/CourseView";
import LevelView from "./components/course/LevelView";
import PracticePage from "./pages/PracticePage";

/* NEW */
import AppHeader from "./components/layout/AppHeader";

function AppContent() {
  const { selectedLanguage, isLoading } = useLanguage();

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [practiceState, setPracticeState] = useState(null);
  // practiceState = { level, sublevel }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // 1️⃣ Landing
  if (!selectedLanguage) {
    return <LandingPage />;
  }

  // 4️⃣ Practice
  if (practiceState) {
    return (
      <PracticePage
        level={practiceState.level}
        sublevel={practiceState.sublevel}
        onExit={() => setPracticeState(null)}
      />
    );
  }

  // 3️⃣ Level
  if (selectedLevel) {
    return (
      <LevelView
        level={selectedLevel}
        onBack={() => setSelectedLevel(null)}
        onSelectSublevel={(sublevel) =>
          setPracticeState({ level: selectedLevel, sublevel })
        }
      />
    );
  }

  // 2️⃣ Course
  return <CourseView onSelectLevel={setSelectedLevel} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <SettingsProvider>

          {/* 🌙 GLOBAL HEADER (theme toggle lives here) */}
          <AppHeader />

          {/* Page content */}
          <AppContent />

        </SettingsProvider>
      </ProgressProvider>
    </LanguageProvider>
  );
}
