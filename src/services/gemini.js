// src/services/gemini.js
function getApiKey() {
  return (
    localStorage.getItem("gemini_key") ||
    import.meta.env.VITE_GEMINI_API_KEY
  );
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateConversationResponse = async (userMessage, languageCode, languageName, conversationHistory = []) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('Gemini API key not configured');
    return getFallbackResponse(languageCode);
  }

  try {
    const systemPrompt = `You are a friendly language learning assistant helping someone practice ${languageName}. 
Your role is to:
1. Have a natural conversation in ${languageName}
2. Keep responses concise (2-3 sentences max)
3. Match the user's language level
4. Ask follow-up questions to keep the conversation flowing
5. Be encouraging and supportive

Respond naturally in ${languageName}. Do not provide translations or explanations unless specifically asked.`;

    const conversationContext = conversationHistory
      .slice(-6)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `${systemPrompt}

Previous conversation:
${conversationContext}

User: ${userMessage}

Respond naturally in ${languageName}:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response generated');
    }

    return generatedText.trim();

  } catch (error) {
    console.error('Error generating conversation response:', error);
    return getFallbackResponse(languageCode);
  }
};

export const analyzeUserMessage = async (userMessage, languageCode, conversationHistory = []) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { feedback: null };
  }

  try {
    const languageMap = {
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      jp: 'Japanese',
      cn: 'Chinese'
    };

    const languageName = languageMap[languageCode] || 'the target language';

    const prompt = `You are a language learning assistant. Analyze this ${languageName} message for grammar and naturalness.

User message: "${userMessage}"

Provide feedback in JSON format with:
{
  "grammarIssues": [{"incorrect": "text", "correct": "text", "explanation": "brief"}],
  "suggestions": ["suggestion1", "suggestion2"],
  "naturalness": 0-100,
  "overall": "brief overall comment"
}

Keep feedback concise and constructive. Only include significant issues. If the message is good, say so.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return { feedback: null };
    }

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const feedback = JSON.parse(jsonMatch[0]);
      return { feedback };
    }

    return { feedback: null };

  } catch (error) {
    console.error('Error analyzing message:', error);
    return { feedback: null };
  }
};

const getFallbackResponse = (languageCode) => {
  const fallbacks = {
    es: '¡Interesante! Cuéntame más sobre eso.',
    fr: 'Intéressant! Parlez-moi davantage de cela.',
    de: 'Interessant! Erzählen Sie mir mehr darüber.',
    it: 'Interessante! Raccontami di più.',
    jp: '面白いですね！もっと教えてください。',
    cn: '有趣！请告诉我更多。'
  };

  return fallbacks[languageCode] || 'Please tell me more.';
};

export const checkGeminiAvailability = () => {
  return !!getApiKey();
};

export const generateHint = async (word, languageCode) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return `Think about how "${word}" is commonly used.`;
  }

  try {
    const languageMap = {
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      jp: 'Japanese',
      cn: 'Chinese'
    };

    const languageName = languageMap[languageCode] || 'the target language';

    const prompt = `You are helping someone learn ${languageName}.
Give a short, helpful hint (1 sentence max) for understanding or remembering this word:

"${word}"

Do NOT give the translation directly.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 60,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Gemini request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text?.trim() || `Try using "${word}" in a simple sentence.`;

  } catch (err) {
    console.error('Error generating hint:', err);
    return `Try using "${word}" in a simple sentence.`;
  }
};
