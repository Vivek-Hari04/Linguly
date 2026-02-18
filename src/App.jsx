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
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  // 🔑 On startup: load key OR show popup once if missing
  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_key");
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (storedKey) {
      setApiKey(storedKey);
    } else if (envKey) {
      setApiKey(envKey);
    } else {
      // No key anywhere → ask user once at startup
      setShowKeyPrompt(true);
    }
  }, []);

  // Listen for AI features requesting the key later
  useEffect(() => {
    const handler = () => setShowKeyPrompt(true);
    window.addEventListener("missing-api-key", handler);
    return () => window.removeEventListener("missing-api-key", handler);
  }, []);

  const handleSaveKey = () => {
        if (!inputKey.trim()) return;

        const key = inputKey.trim();
        localStorage.setItem("gemini_key", key);
        setApiKey(key);
        setShowKeyPrompt(false);
        setInputKey("");

        // Update header button visibility
        window.dispatchEvent(new Event("api-key-updated"));

        // Tell PracticePage to retry content generation
        window.dispatchEvent(new Event("api-key-added"));
};


  return (
    <LanguageProvider>
      <ProgressProvider>
        <SettingsProvider>

          {/* 🌙 GLOBAL HEADER */}
          <AppHeader />

          {/* Page content */}
          <AppContent />

          {/* 🔐 API KEY OVERLAY */}
          {showKeyPrompt && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
                
                <h2 className="text-xl font-semibold mb-3">
                  Enter your Gemini API Key
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  Use AI-powered features by adding your key. You can also continue without it.
                </p>

                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste your API key here"
                  className="w-full border rounded-lg px-3 py-2 mb-4 dark:bg-gray-800"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveKey}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save API Key
                  </button>

                  <button
                    onClick={() => setShowKeyPrompt(false)}
                    className="flex-1 border py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Continue without AI
                  </button>
                </div>
              </div>
            </div>
          )}

        </SettingsProvider>
      </ProgressProvider>
    </LanguageProvider>
  );
}
