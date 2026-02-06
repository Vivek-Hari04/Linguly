import { useSettings } from "../../contexts/SettingsContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useSettings();

  return (
    <button
      onClick={toggleTheme}
      className="
        w-10 h-10 rounded-full
        flex items-center justify-center
        border shadow-sm
        bg-white text-gray-800
        hover:bg-gray-100
        dark:bg-gray-800 dark:text-yellow-300 dark:border-gray-600
        transition
      "
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
