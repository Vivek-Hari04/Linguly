import { generateLessons, translateUI } from "./gemini.js";
import {
  getCachedLessons,
  cacheLessons,
  getCachedTranslations,
  cacheTranslations,
} from "./storage.js";

/**
 * Dynamic lesson service that generates content using Gemini AI
 */

/**
 * Get lessons for a specific language (cached or generated)
 */
export async function getLessonsForLanguage(
  languageCode,
  forceRefresh = false
) {
  try {
    // First, try to get cached lessons (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedLessons = getCachedLessons(languageCode);
      if (cachedLessons) {
        console.log(`Using cached lessons for ${languageCode}`);
        return cachedLessons;
      }
    }

    // If no cache or force refresh, generate new lessons
    console.log(`Generating new lessons for ${languageCode}`);
    const lessons = await generateLessons(languageCode);

    // Cache the generated lessons
    cacheLessons(languageCode, lessons);

    return lessons;
  } catch (error) {
    console.error(`Error getting lessons for ${languageCode}:`, error);

    // Return fallback lessons if generation fails
    return getFallbackLessons(languageCode);
  }
}

/**
 * Get translations for a specific language (cached or generated)
 */
export async function getTranslationsForLanguage(languageCode) {
  try {
    // First, try to get cached translations
    const cachedTranslations = getCachedTranslations(languageCode);
    if (cachedTranslations) {
      console.log(`Using cached translations for ${languageCode}`);
      return cachedTranslations;
    }

    // If no cache, generate new translations
    console.log(`Generating new translations for ${languageCode}`);
    const translations = await translateUI(languageCode);

    // Cache the generated translations
    cacheTranslations(languageCode, translations);

    return translations;
  } catch (error) {
    console.error(`Error getting translations for ${languageCode}:`, error);

    // Return fallback translations if generation fails
    return getFallbackTranslations();
  }
}

/**
 * Fallback lessons when Gemini generation fails
 */
function getFallbackLessons(languageCode) {
  const languageNames = {
    ES: "Spanish",
    FR: "French",
    DE: "German",
    IT: "Italian",
    JP: "Japanese",
    CN: "Chinese",
  };

  const languageName = languageNames[languageCode] || "Spanish";

  // Generate language-specific fallback content
  const getLanguageSpecificContent = (languageCode) => {
    const content = {
      ES: {
        level1: {
          title: "Basics & Greetings",
          xpReward: 50,
          flashcards: [
            { id: 1, word: "Hola", translation: "Hello", image: "👋" },
            { id: 2, word: "Gracias", translation: "Thank you", image: "🙏" },
            { id: 3, word: "Sí", translation: "Yes", image: "✅" },
            { id: 4, word: "No", translation: "No", image: "❌" },
            { id: 5, word: "Por favor", translation: "Please", image: "🙏" },
            { id: 6, word: "Adiós", translation: "Goodbye", image: "👋" },
            { id: 7, word: "Lo siento", translation: "Sorry", image: "😔" },
            { id: 8, word: "Disculpe", translation: "Excuse me", image: "🤝" },
          ],
          fillInBlanks: [
            {
              id: 1,
              sentence: "___ es un saludo común",
              answer: "Hola",
              options: ["Hola", "Adiós", "Gracias", "Por favor"],
            },
            {
              id: 2,
              sentence: "Cuando alguien te ayuda, di ___",
              answer: "Gracias",
              options: ["Hola", "Gracias", "Sí", "No"],
            },
            {
              id: 3,
              sentence: "Para ser educado, agrega ___ a las peticiones",
              answer: "Por favor",
              options: ["Hola", "Gracias", "Por favor", "Lo siento"],
            },
            {
              id: 4,
              sentence: "Cuando cometes un error, di ___",
              answer: "Lo siento",
              options: ["Hola", "Gracias", "Lo siento", "Sí"],
            },
          ],
        },
        level2: {
          title: "Daily Life",
          xpReward: 75,
          flashcards: [
            { id: 1, word: "Familia", translation: "Family", image: "👨‍👩‍👧‍👦" },
            { id: 2, word: "Comida", translation: "Food", image: "🍎" },
            { id: 3, word: "Agua", translation: "Water", image: "💧" },
            { id: 4, word: "Casa", translation: "House", image: "🏠" },
            { id: 5, word: "Coche", translation: "Car", image: "🚗" },
            { id: 6, word: "Libro", translation: "Book", image: "📚" },
            { id: 7, word: "Teléfono", translation: "Phone", image: "📱" },
            { id: 8, word: "Dinero", translation: "Money", image: "💰" },
          ],
          fillInBlanks: [
            {
              id: 1,
              sentence: "Vivo en una ___",
              answer: "Casa",
              options: ["Casa", "Coche", "Libro", "Teléfono"],
            },
            {
              id: 2,
              sentence: "Como ___ todos los días",
              answer: "Comida",
              options: ["Comida", "Agua", "Dinero", "Familia"],
            },
            {
              id: 3,
              sentence: "Conduzco un ___ al trabajo",
              answer: "Coche",
              options: ["Casa", "Coche", "Libro", "Teléfono"],
            },
            {
              id: 4,
              sentence: "Leo un ___ antes de dormir",
              answer: "Libro",
              options: ["Comida", "Agua", "Libro", "Dinero"],
            },
          ],
        },
        level3: {
          title: "Conversations",
          xpReward: 100,
          flashcards: [
            {
              id: 1,
              word: "¿Cómo estás?",
              translation: "How are you?",
              image: "😊",
            },
            {
              id: 2,
              word: "¿Cómo te llamas?",
              translation: "What's your name?",
              image: "👤",
            },
            {
              id: 3,
              word: "¿De dónde eres?",
              translation: "Where are you from?",
              image: "🌍",
            },
            {
              id: 4,
              word: "Mucho gusto",
              translation: "Nice to meet you",
              image: "🤝",
            },
            {
              id: 5,
              word: "Hasta luego",
              translation: "See you later",
              image: "👋",
            },
            {
              id: 6,
              word: "Que tengas buen día",
              translation: "Have a good day",
              image: "☀️",
            },
            {
              id: 7,
              word: "Buena suerte",
              translation: "Good luck",
              image: "🍀",
            },
            {
              id: 8,
              word: "Felicidades",
              translation: "Congratulations",
              image: "🎉",
            },
          ],
          fillInBlanks: [
            {
              id: 1,
              sentence: "___ Ana, ¿cómo estás?",
              answer: "Hola",
              options: ["Hola", "Adiós", "Gracias", "Por favor"],
            },
            {
              id: 2,
              sentence: "___ por la ayuda",
              answer: "Gracias",
              options: ["Gracias", "Por favor", "Disculpe", "Lo siento"],
            },
            {
              id: 3,
              sentence: "¿Quieres café? ___",
              answer: "Sí",
              options: ["Sí", "No", "Gracias", "Por favor"],
            },
            {
              id: 4,
              sentence: "¿Tienes hambre? ___",
              answer: "No",
              options: ["Sí", "No", "Gracias", "Hola"],
            },
          ],
        },
      },
      // Add other languages as needed
      FR: {
        level1: {
          title: "Basics & Greetings",
          xpReward: 50,
          flashcards: [
            { id: 1, word: "Bonjour", translation: "Hello", image: "👋" },
            { id: 2, word: "Merci", translation: "Thank you", image: "🙏" },
            { id: 3, word: "Oui", translation: "Yes", image: "✅" },
            { id: 4, word: "Non", translation: "No", image: "❌" },
            {
              id: 5,
              word: "S'il vous plaît",
              translation: "Please",
              image: "🙏",
            },
            { id: 6, word: "Au revoir", translation: "Goodbye", image: "👋" },
            { id: 7, word: "Désolé", translation: "Sorry", image: "😔" },
            {
              id: 8,
              word: "Excusez-moi",
              translation: "Excuse me",
              image: "🤝",
            },
          ],
          fillInBlanks: [
            {
              id: 1,
              sentence: "___ Marie, comment allez-vous?",
              answer: "Bonjour",
              options: ["Bonjour", "Au revoir", "Merci", "Désolé"],
            },
            {
              id: 2,
              sentence: "___ beaucoup pour votre aide",
              answer: "Merci",
              options: ["Bonjour", "Merci", "Oui", "Non"],
            },
            {
              id: 3,
              sentence: "Voulez-vous du café? ___",
              answer: "Oui",
              options: ["Oui", "Non", "Merci", "Bonjour"],
            },
            {
              id: 4,
              sentence: "Avez-vous faim? ___",
              answer: "Non",
              options: ["Oui", "Non", "Merci", "Bonjour"],
            },
          ],
        },
        level2: {
          title: "Daily Life",
          xpReward: 75,
          flashcards: [
            { id: 1, word: "Famille", translation: "Family", image: "👨‍👩‍👧‍👦" },
            { id: 2, word: "Nourriture", translation: "Food", image: "🍎" },
            { id: 3, word: "Eau", translation: "Water", image: "💧" },
            { id: 4, word: "Maison", translation: "House", image: "🏠" },
            { id: 5, word: "Voiture", translation: "Car", image: "🚗" },
            { id: 6, word: "Livre", translation: "Book", image: "📚" },
            { id: 7, word: "Téléphone", translation: "Phone", image: "📱" },
            { id: 8, word: "Argent", translation: "Money", image: "💰" },
          ],
          fillInBlanks: [
            {
              id: 1,
              sentence: "J'habite dans une belle ___",
              answer: "maison",
              options: ["maison", "voiture", "livre", "téléphone"],
            },
            {
              id: 2,
              sentence: "Je mange de la ___ délicieuse",
              answer: "nourriture",
              options: ["nourriture", "eau", "argent", "famille"],
            },
            {
              id: 3,
              sentence: "Je conduis ma ___ au travail",
              answer: "voiture",
              options: ["maison", "voiture", "livre", "téléphone"],
            },
            {
              id: 4,
              sentence: "Je lis un bon ___ avant de dormir",
              answer: "livre",
              options: ["nourriture", "eau", "livre", "argent"],
            },
          ],
        },
        level3: {
          title: "Conversations",
          xpReward: 100,
          flashcards: [
            {
              id: 1,
              word: "Comment allez-vous?",
              translation: "How are you?",
              image: "😊",
            },
            {
              id: 2,
              word: "Comment vous appelez-vous?",
              translation: "What's your name?",
              image: "👤",
            },
            {
              id: 3,
              word: "D'où êtes-vous?",
              translation: "Where are you from?",
              image: "🌍",
            },
            {
              id: 4,
              word: "Enchanté",
              translation: "Nice to meet you",
              image: "🤝",
            },
            {
              id: 5,
              word: "À bientôt",
              translation: "See you later",
              image: "👋",
            },
            {
              id: 6,
              word: "Bonne journée",
              translation: "Have a good day",
              image: "☀️",
            },
            {
              id: 7,
              word: "Bonne chance",
              translation: "Good luck",
              image: "🍀",
            },
            {
              id: 8,
              word: "Félicitations",
              translation: "Congratulations",
              image: "🎉",
            },
          ],
          fillInBlanks: [
            {
              id: 1,
              sentence: "Bonjour, ___ vous appelez-vous?",
              answer: "comment",
              options: ["comment", "pourquoi", "quand", "où"],
            },
            {
              id: 2,
              sentence: "___ êtes-vous? Je viens de Paris",
              answer: "D'où",
              options: ["Comment", "Pourquoi", "D'où", "Quand"],
            },
            {
              id: 3,
              sentence: "C'était un plaisir, ___!",
              answer: "à bientôt",
              options: [
                "enchanté",
                "bonne journée",
                "à bientôt",
                "bonne chance",
              ],
            },
            {
              id: 4,
              sentence: "___ et bonne chance!",
              answer: "Bonne journée",
              options: [
                "Bonne chance",
                "Bonne journée",
                "Félicitations",
                "Comment allez-vous?",
              ],
            },
          ],
        },
      },
    };

    return content[languageCode] || content.ES; // Default to Spanish if language not found
  };

  return getLanguageSpecificContent(languageCode);
}

/**
 * Fallback translations when Gemini generation fails
 */
function getFallbackTranslations() {
  return {
    "Choose Your Language": "Choose Your Language",
    "Start your journey to fluency. Pick a language and learn at your own pace with interactive lessons.":
      "Start your journey to fluency. Pick a language and learn at your own pace with interactive lessons.",
    "Popular Languages": "Popular Languages",
    "Your Progress": "Your Progress",
    "Keep up the great work!": "Keep up the great work!",
    "Learning:": "Learning:",
    "Start Level": "Start Level",
    "Practice Again": "Practice Again",
    Locked: "Locked",
    Previous: "Previous",
    Next: "Next",
    "Start Quiz": "Start Quiz",
    "Finish Level": "Finish Level",
    "Next Question": "Next Question",
    "Quick Quiz": "Quick Quiz",
    Question: "Question",
    of: "of",
    "Correct!": "Correct!",
    "The correct answer is:": "The correct answer is:",
    "Tap to reveal": "Tap to reveal",
    "Pronounce word": "Pronounce word",
    "Get AI hint": "Get AI hint",
    "Change Language": "Change Language",
    "Back to Levels": "Back to Levels",
    "Language Learner": "Language Learner",
    "Master Spanish one word at a time": "Master Spanish one word at a time",
    Completed: "Completed",
    "Basics & Greetings": "Basics & Greetings",
    "Essential words to get started": "Essential words to get started",
    "Daily Life": "Daily Life",
    "Common phrases for daily life": "Common phrases for daily life",
    Conversations: "Conversations",
    "Build your conversational skills": "Build your conversational skills",
    "Finish Level 2 to unlock": "Finish Level 2 to unlock",
  };
}

/**
 * Clear all cached data for a language
 */
export function clearLanguageCache(languageCode) {
  try {
    // Clear lessons cache
    const allLessons = JSON.parse(
      localStorage.getItem("language_learner_lessons") || "{}"
    );
    delete allLessons[languageCode];
    localStorage.setItem(
      "language_learner_lessons",
      JSON.stringify(allLessons)
    );

    // Clear translations cache
    const allTranslations = JSON.parse(
      localStorage.getItem("language_learner_translations") || "{}"
    );
    delete allTranslations[languageCode];
    localStorage.setItem(
      "language_learner_translations",
      JSON.stringify(allTranslations)
    );

    console.log(`Cleared cache for ${languageCode}`);
  } catch (error) {
    console.error(`Error clearing cache for ${languageCode}:`, error);
  }
}

// Debug function to force regenerate content for a language
export async function forceRegenerateContent(languageCode) {
  console.log(`Force regenerating content for ${languageCode}...`);
  clearLanguageCache(languageCode);
  const newLessons = await getLessonsForLanguage(languageCode, true);
  console.log("New lessons generated:", newLessons);
  return newLessons;
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(languageCode) {
  const languageNames = {
    ES: "Spanish",
    FR: "French",
    DE: "German",
    IT: "Italian",
    JP: "Japanese",
    CN: "Chinese",
  };

  return languageNames[languageCode] || "Spanish";
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(languageCode) {
  const flags = {
    ES: "🇪🇸",
    FR: "🇫🇷",
    DE: "🇩🇪",
    IT: "🇮🇹",
    JP: "🇯🇵",
    CN: "🇨🇳",
  };

  return flags[languageCode] || "🇪🇸";
}
