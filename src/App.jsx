import "./index.css";

import { useState, useEffect } from "react";
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
  const [apiKey, setApiKey] = useState(null);
  const [inputKey, setInputKey] = useState("");

  useEffect(() => {
  const storedKey = localStorage.getItem("gemini_key");
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (storedKey) {
    setApiKey(storedKey);
  } else if (envKey) {
    setApiKey(envKey);
  }
}, []);


  const handleSaveKey = () => {
    if (!inputKey.trim()) return;
    localStorage.setItem("gemini_key", inputKey.trim());
    setApiKey(inputKey.trim());
  };

  return (
    <LanguageProvider>
      <ProgressProvider>
        <SettingsProvider>

          {/* 🌙 GLOBAL HEADER */}
          <AppHeader />

          {/* Page content */}
          <AppContent />

          {/* 🔐 ONE-TIME API KEY OVERLAY */}
          {!apiKey && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
                <h2 className="text-xl font-semibold mb-3">
                  Enter your Gemini API Key
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  This is required to use AI features. It will be stored locally in your browser.
                </p>

                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste your API key here"
                  className="w-full border rounded-lg px-3 py-2 mb-4 dark:bg-gray-800"
                />

                <button
                  onClick={handleSaveKey}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save API Key
                </button>
              </div>
            </div>
          )}

        </SettingsProvider>
      </ProgressProvider>
    </LanguageProvider>
  );
}
