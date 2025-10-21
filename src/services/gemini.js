import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Language code mapping
const LANGUAGE_NAMES = {
  ES: "Spanish",
  FR: "French",
  DE: "German",
  IT: "Italian",
  JP: "Japanese",
  CN: "Chinese",
};

/**
 * Generate complete lesson content for a specific language
 */
export async function generateLessons(languageCode) {
  const languageName = LANGUAGE_NAMES[languageCode];

  const prompt = `
    You are an expert language tutor creating beginner-friendly content for learning ${languageName}.
    
    CRITICAL: The "word" field must contain the word/phrase in ${languageName}, NOT in English.
    The "translation" field should contain the English translation.
    
    Generate a complete lesson structure with:
    
    1. Level 1 - Basics & Greetings:
       - 8 vocabulary flashcards (word in ${languageName} + English translation + relevant emoji)
       - 4 fill-in-the-blank quiz questions with 4 options each
       - Focus on: greetings, basic words, numbers 1-10, colors
       - Questions should be conversational but with blanks: "___ Ana, ¿cómo estás?" (answer: "Hola")
    
    2. Level 2 - Daily Life:
       - 8 vocabulary flashcards (word in ${languageName} + English translation + relevant emoji)  
       - 4 fill-in-the-blank quiz questions with 4 options each
       - Focus on: family, food, common objects, daily activities
       - Questions should be conversational but with blanks: "Vivo en una ___" (answer: "casa")
    
    3. Level 3 - Conversations:
       - 8 vocabulary flashcards (word in ${languageName} + English translation + relevant emoji)
       - 4 fill-in-the-blank quiz questions with 4 options each
       - Focus on: common phrases, questions, responses, emotions
       - Questions should be conversational but with blanks: "Disculpe, ¿dónde está el ___?" (answer: "baño")
    
    CRITICAL: Quiz questions MUST only use words from the flashcards in the same level. 
    Do not introduce new vocabulary words that weren't studied in the flashcards.
    
    IMPORTANT: Quiz questions must be UNAMBIGUOUS with only ONE correct answer.
    Avoid questions like "My ___ is kind" which could have multiple valid answers.
    Instead use specific context like "I live in a ___" or "I eat ___ every day".
    
    For family vocabulary, avoid subjective questions. Use objective contexts:
    - "I live with my ___" (specific family member)
    - "My ___ drives a car" (specific role)
    - NOT "My ___ is nice" (could be anyone)
    
    AVOID these ambiguous question types:
    - Yes/No questions: "¿Quieres más? ___" (could be Sí or No)
    - Subjective descriptions: "My ___ is kind" (could be anyone)
    - Preference questions: "Do you like ___?" (personal preference)
    - Opinion questions: "What do you think about ___?" (subjective)
    
    USE these unambiguous question types:
    - Specific objects: "I drive a ___" (car)
    - Specific locations: "I live in a ___" (house)
    - Specific actions: "I eat ___ every day" (food)
    - Specific greetings: "___ Ana, ¿cómo estás?" (Hola)
    
    IMPORTANT: Return ONLY a valid JSON object with this exact structure. Do not include any text before or after the JSON.
    
    Example for Spanish:
    {
      "level1": {
        "title": "Basics & Greetings",
        "xpReward": 50,
        "flashcards": [
          {
            "id": 1,
            "word": "Hola",
            "translation": "Hello",
            "image": "👋"
          },
          {
            "id": 2,
            "word": "Gracias",
            "translation": "Thank you",
            "image": "🙏"
          }
        ],
        "fillInBlanks": [
          {
            "id": 1,
            "sentence": "Necesito ___ para estudiar",
            "answer": "libros",
            "options": ["libros", "comida", "agua", "dinero"]
          }
        ]
      }
    }
    
    Make content appropriate for absolute beginners. Keep words simple and commonly used. Use proper ${languageName} spelling and grammar.
    REMEMBER: "word" field = ${languageName} word, "translation" field = English meaning.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract JSON
    let jsonText = text.trim();

    // Remove any markdown code blocks
    jsonText = jsonText.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    // Find the JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const lessons = JSON.parse(jsonMatch[0]);

    // Validate the structure
    if (!lessons.level1 || !lessons.level2 || !lessons.level3) {
      throw new Error("Invalid lesson structure received");
    }

    return lessons;
  } catch (error) {
    console.error("Error generating lessons:", error);
    throw new Error(`Failed to generate lessons for ${languageName}`);
  }
}

/**
 * Generate a hint for a specific word in the target language
 */
export async function generateHint(word, languageCode) {
  const languageName = LANGUAGE_NAMES[languageCode];

  // Fallback hints for common Spanish words
  const fallbackHints = {
    ES: {
      Hola: "This is the most common way to say hello in Spanish!",
      Gracias: "Use this word when someone helps you or gives you something.",
      Sí: "This means 'yes' - the opposite of 'no'.",
      No: "This means 'no' - the opposite of 'sí'.",
      "Por favor":
        "This means 'please' - use it to be polite when asking for something.",
      Adiós: "This is how you say goodbye in Spanish.",
      "Lo siento": "Use this when you want to apologize or say you're sorry.",
      Disculpe:
        "This is a polite way to get someone's attention or say 'excuse me'.",
      Familia:
        "This word refers to your family - parents, siblings, relatives.",
      Comida: "This is what you eat - food!",
      Agua: "This is what you drink when you're thirsty - water.",
      Casa: "This is where you live - your house or home.",
      Coche: "This is what you drive - a car.",
      Libro: "This is what you read - a book.",
      Teléfono: "This is what you use to call people - a phone.",
      Dinero: "This is what you use to buy things - money.",
      Rojo: "This is the color of apples, roses, and stop signs - red!",
      Azul: "This is the color of the sky and ocean - blue.",
      Verde: "This is the color of grass and leaves - green.",
      Amarillo: "This is the color of the sun and bananas - yellow.",
    },
  };

  // Check for fallback hint first
  if (fallbackHints[languageCode] && fallbackHints[languageCode][word]) {
    console.log("Using fallback hint for:", word);
    return fallbackHints[languageCode][word];
  }

  const prompt = `
    Give a helpful, encouraging hint for the word "${word}" in ${languageName}.
    Keep it simple, one sentence, and helpful for a beginner.
    Write the hint in English.
  `;

  try {
    console.log("Calling Gemini API for hint generation...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini API response:", text);
    return text.trim();
  } catch (error) {
    console.error("Error generating hint:", error);
    console.error("Error details:", error.message);
    return `Try to remember this ${languageName} word!`;
  }
}

/**
 * Generate a translation hint for a sentence in the target language
 */
export async function generateTranslationHint(sentence, languageCode) {
  const languageName = LANGUAGE_NAMES[languageCode];

  // Fallback translations for common Spanish questions - COMPLETE SENTENCES
  const fallbackTranslations = {
    ES: {
      "___ Ana, ¿cómo estás?": "Hi Ana, how are you?",
      "___ por la ayuda": "Thanks for the help",
      "¿Quieres café? ___": "Do you want coffee? Yes",
      "¿Tienes hambre? ___": "Are you hungry? No",
      "___ es un saludo común": "Hello is a common greeting",
      "Cuando alguien te ayuda, di ___": "When someone helps you, say thanks",
      "Para ser educado, agrega ___ a las peticiones":
        "To be polite, add please to requests",
      "Cuando cometes un error, di ___": "When you make a mistake, say sorry",
      "Vivo en una ___": "I live in a house",
      "Como ___ todos los días": "I eat food every day",
      "Conduzco un ___ al trabajo": "I drive a car to work",
      "Leo un ___ antes de dormir": "I read a book before bed",
      "Muchas ___": "Many thanks",
      "___ Juan, ¿cómo estás?": "Hi Juan, how are you?",
      "Necesito ___ para estudiar": "I need books to study",
      "Mi ___ es muy grande": "My house is very big",
      "Compro ___ en la tienda": "I buy food at the store",
    },
    FR: {
      "___ Marie, comment allez-vous?": "Hello Marie, how are you?",
      "___ beaucoup pour votre aide": "Thank you very much for your help",
      "J'ai besoin de ___ pour étudier": "I need books to study",
      "Ma ___ est très grande": "My house is very big",
      "J'achète ___ au magasin": "I buy food at the store",
      "___ est une salutation commune": "Hello is a common greeting",
      "Quand quelqu'un vous aide, dites ___":
        "When someone helps you, say thank you",
      "Pour être poli, ajoutez ___ aux demandes":
        "To be polite, add please to requests",
      "Quand vous faites une erreur, dites ___":
        "When you make a mistake, say sorry",
      "Je vis dans une ___": "I live in a house",
      "Je mange ___ tous les jours": "I eat food every day",
      "Je conduis une ___ au travail": "I drive a car to work",
      "Je lis un ___ avant de dormir": "I read a book before bed",
      "Bonjour, ___ vous appelez-vous?": "Hello, what is your name?",
      "___ êtes-vous? Je viens de Paris":
        "Where are you from? I come from Paris",
      "C'était un plaisir, ___!": "It was a pleasure, see you later!",
      "___ et bonne chance!": "Have a good day and good luck!",
    },
  };

  // Check for fallback translation first
  if (
    fallbackTranslations[languageCode] &&
    fallbackTranslations[languageCode][sentence]
  ) {
    return fallbackTranslations[languageCode][sentence];
  }

  const prompt = `
    Translate this ${languageName} sentence to English: "${sentence}"
    
    IMPORTANT: Provide a COMPLETE, natural English translation that fills in the blank with the most likely answer.
    For example: "___ Juan, ¿cómo estás?" should become "Hi Juan, how are you?" (not just "Hello Juan, how are you?")
    For example: "Muchas ___" should become "Many thanks" (not just "Many")
    
    Give the complete sentence with the blank filled in naturally.
    Keep the translation simple and direct.
    Return only the complete English translation, no additional text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating translation hint:", error);
    return "Unable to translate this sentence.";
  }
}

/**
 * Translate UI elements to the target language
 */
export async function translateUI(languageCode) {
  const languageName = LANGUAGE_NAMES[languageCode];

  const elementsToTranslate = [
    "Choose Your Language",
    "Start your journey to fluency. Pick a language and learn at your own pace with interactive lessons.",
    "Popular Languages",
    "Your Progress",
    "Keep up the great work!",
    "Learning:",
    "Start Level",
    "Practice Again",
    "Locked",
    "Previous",
    "Next",
    "Start Quiz",
    "Finish Level",
    "Next Question",
    "Quick Quiz",
    "Question",
    "of",
    "Correct!",
    "The correct answer is:",
    "Tap to reveal",
    "Pronounce word",
    "Get AI hint",
    "Change Language",
    "Back to Levels",
    "Language Learner",
    "Master Spanish one word at a time",
    "Completed",
    "Basics & Greetings",
    "Essential words to get started",
    "Daily Life",
    "Common phrases for daily life",
    "Conversations",
    "Build your conversational skills",
    "Finish Level 2 to unlock",
  ];

  const prompt = `
    Translate these English UI elements to ${languageName}:
    ${elementsToTranslate
      .map((element, index) => `${index + 1}. ${element}`)
      .join("\n")}
    
    IMPORTANT: Return ONLY a JSON object with the English text as keys and ${languageName} translations as values.
    Keep translations natural and appropriate for a language learning app.
    Do not include any text before or after the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Clean up the response to extract JSON
    let jsonText = text.trim();

    // Remove any markdown code blocks
    jsonText = jsonText.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    // Extract JSON from response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in translation response");
    }

    const translations = JSON.parse(jsonMatch[0]);

    // Validate that we have translations for all elements
    const missingTranslations = elementsToTranslate.filter(
      (element) => !translations[element]
    );
    if (missingTranslations.length > 0) {
      console.warn(
        `Missing translations for: ${missingTranslations.join(", ")}`
      );
      // Add missing translations as fallbacks
      missingTranslations.forEach((element) => {
        translations[element] = element;
      });
    }

    return translations;
  } catch (error) {
    console.error("Error translating UI:", error);
    // Return original elements as fallback
    const fallback = {};
    elementsToTranslate.forEach((element) => {
      fallback[element] = element;
    });
    return fallback;
  }
}

/**
 * Generate additional flashcards for a specific topic
 */
export async function generateAdditionalFlashcards(
  languageCode,
  topic,
  count = 5
) {
  const languageName = LANGUAGE_NAMES[languageCode];

  const prompt = `
    Generate ${count} additional vocabulary flashcards for learning ${languageName} about "${topic}".
    
    Return ONLY a JSON array with this structure:
    [
      {
        "id": 1,
        "word": "word in ${languageName}",
        "translation": "English translation", 
        "image": "relevant emoji"
      }
    ]
    
    Make words appropriate for beginners and related to the topic.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating additional flashcards:", error);
    return [];
  }
}

// Legacy function for backward compatibility - removed duplicate
