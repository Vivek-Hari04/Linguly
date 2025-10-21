export const lessons = {
  spanish: {
    level1: {
      title: "Basics & Greetings",
      xpReward: 50,
      flashcards: [
        { id: 1, word: "Hola", translation: "Hello", image: "👋" },
        { id: 2, word: "Adiós", translation: "Goodbye", image: "🖐️" },
        { id: 3, word: "Gracias", translation: "Thank you", image: "🙏" },
        { id: 4, word: "Por favor", translation: "Please", image: "🙂" },
        { id: 5, word: "Sí", translation: "Yes", image: "✅" },
        { id: 6, word: "No", translation: "No", image: "❌" },
        {
          id: 7,
          word: "Buenos días",
          translation: "Good morning",
          image: "🌅",
        },
        {
          id: 8,
          word: "Buenas noches",
          translation: "Good night",
          image: "🌙",
        },
      ],
      fillInBlanks: [
        {
          id: 1,
          sentence: "___, me llamo Juan",
          answer: "Hola",
          options: ["Hola", "Adiós", "Gracias", "Por favor"],
        },
        {
          id: 2,
          sentence: "___, ¿cómo estás?",
          answer: "Hola",
          options: ["Hola", "Adiós", "Sí", "No"],
        },
        {
          id: 3,
          sentence: "___! Hasta mañana",
          answer: "Adiós",
          options: ["Hola", "Adiós", "Buenos días", "Buenas noches"],
        },
      ],
    },
    level2: {
      title: "Numbers & Colors",
      xpReward: 75,
      flashcards: [
        { id: 9, word: "Uno", translation: "One", image: "1️⃣" },
        { id: 10, word: "Dos", translation: "Two", image: "2️⃣" },
        { id: 11, word: "Tres", translation: "Three", image: "3️⃣" },
        { id: 12, word: "Rojo", translation: "Red", image: "🔴" },
        { id: 13, word: "Azul", translation: "Blue", image: "🔵" },
        { id: 14, word: "Verde", translation: "Green", image: "🟢" },
      ],
      fillInBlanks: [
        {
          id: 4,
          sentence: "Tengo ___ manzanas",
          answer: "dos",
          options: ["uno", "dos", "tres", "rojo"],
        },
      ],
    },
    level3: {
      title: "Family & Friends",
      xpReward: 100,
      locked: true,
      flashcards: [],
      fillInBlanks: [],
    },
  },
};


