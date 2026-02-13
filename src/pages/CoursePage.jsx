import { useState } from "react";
import CourseView from "../components/course/CourseView";
import LevelView from "../components/course/LevelView";
import PracticePage from "./PracticePage";

export default function CoursePage() {
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeSublevel, setActiveSublevel] = useState(null);

  // Practice mode
  if (activeLevel && activeSublevel) {
    return (
      <PracticePage
        level={activeLevel}
        sublevel={activeSublevel}
        onExit={() => setActiveSublevel(null)}
      />
    );
  }

  // Level mode
  if (activeLevel) {
    return (
      <LevelView
        level={activeLevel}
        onBack={() => setActiveLevel(null)}
        onSelectSublevel={setActiveSublevel}
      />
    );
  }

  // Course roadmap
  return <CourseView onSelectLevel={setActiveLevel} />;
}
