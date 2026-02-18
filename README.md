# Linguly — AI-Powered Language Learning Platform

A structured, multi-level language learning web application powered by AI-generated practice, conversation training, and persistent progress tracking.

🌐 **Live App:** https://linguly.vercel.app

---

## 📌 Overview

Linguly is a full-course language learning platform built using React + Vite.  
It is designed around a progression-based learning model rather than simple quizzes.

The system uses structured course data to dynamically generate:

- Levels  
- Sublevels  
- Skills  
- Questions  
- AI-assisted conversations  

The architecture is scalable and allows easy addition of new languages, levels, and practice types.

---

## 🚀Highlights

- Designed a scalable, data-driven course engine for language learning
- Integrated Google Gemini AI for dynamic content generation and conversations
- Built reusable question systems supporting multiple practice formats
- Implemented progress tracking with unlock logic
- Developed modular sublevel routing architecture
- Optimized for expansion to multiple languages

---

## 🧠 Core Architecture

Linguly follows a structured hierarchy:

Language → Levels → Sublevels → Skills → Questions

All course flow is controlled using structured data instead of hardcoded UI logic.  
This makes the system highly extensible and production-ready.

---

## 🎯 Features

### Level 1 — Foundations
- Vocabulary learning
- Sentence completion
- Basic grammar
- Pronunciation training
- Mixed checkpoint evaluation

### Level 2 — Sentence Builder
- Syntax construction
- Verb usage
- Sentence reordering

### Level 3 — Grammar Core
- Error correction
- Grammar explanation logic
- Stability tracking

### Level 4 — Conversation & Usage
- Situational language
- Dialog-based training
- Listening comprehension
- Cultural usage patterns

### Level 5 — Advanced + AI
- Complex sentence mastery
- Idioms & tone control
- Paraphrasing
- Natural speech listening
- AI conversation practice

---

## 🤖 AI Integration (Google Gemini)

Linguly uses Google Gemini for:

- Generating practice questions
- AI conversation responses
- Grammar analysis
- Naturalness feedback
- Smart hints

---

## 🔑 Gemini API Key Requirement

This project requires a Google Gemini API key for AI features.

Without an API key:
- Course navigation works
- Previously generated content loads
- New AI content generation is disabled
- AI conversation features are disabled

Users can enter their API key inside the app.  
The key is stored locally in the browser.

### Developer Setup

Create a `.env` file:

VITE_GEMINI_API_KEY=your_api_key_here


Get an API key from:
https://aistudio.google.com/app/apikey

---

## 🧩 Tech Stack

**Frontend**
- React
- Vite
- TailwindCSS

**State Management**
- React Context API

**AI**
- Google Gemini API

**Persistence**
- LocalStorage (progress + content caching)

---

## 📂 System Design Highlights

- Data-driven course schema
- Modular question renderer
- AI content generator service
- Content caching engine
- Unlock rules + scoring logic
- Multi-language expansion support

---

## 🌍 Supported Languages

- Spanish
- French
- German
- Italian
- Japanese
- Chinese

Special handling exists for script-based languages.

---

## 🧪 Running Locally

npm install

npm run dev


Open:
http://localhost:5173


---

## 📈 Future Scope

- More languages
- Adaptive difficulty
- Backend sync for cross-device progress
- Deeper AI evaluation
- TypeScript model layer

---

## 👨‍💻 Author

Developed as a structured AI-assisted language learning platform focused on scalability, modular design, and real learning progression.

---

## ⭐ Why This Project Stands Out

- Full course engine (not just quizzes)
- Strong AI integration
- Scalable architecture
- Data-driven design
- Portfolio-grade system complexity
