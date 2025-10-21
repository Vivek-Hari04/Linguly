export const languages = [
  {
    code: "ES",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    difficulty: "Easy",
    learners: "24M",
    tags: ["Popular", "Easy"],
    color: "from-green-400 to-green-500",
  },
  {
    code: "FR",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    difficulty: "Medium",
    learners: "18M",
    tags: ["Popular", "Medium"],
    color: "from-blue-400 to-blue-500",
  },
  {
    code: "DE",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    difficulty: "Medium",
    learners: "12M",
    tags: ["Popular", "Medium"],
    color: "from-yellow-400 to-yellow-500",
  },
  {
    code: "IT",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    difficulty: "Easy",
    learners: "8M",
    tags: ["Popular", "Easy"],
    color: "from-green-400 to-green-500",
  },
  {
    code: "JP",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    difficulty: "Hard",
    learners: "6M",
    tags: ["Popular", "Hard"],
    color: "from-red-400 to-red-500",
  },
  {
    code: "CN",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    difficulty: "Hard",
    learners: "15M",
    tags: ["Popular", "Hard"],
    color: "from-orange-400 to-orange-500",
  },
];

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

