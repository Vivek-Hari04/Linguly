import MCQ from "../questions/MCQ";
import Flashcard from "../questions/Flashcard";
import FillInBlank from "../questions/FillInBlank";

export default function QuestionRenderer({ 
  question, 
  questionIndex, 
  onQuestionViewed,
  sourceLanguage,
  targetLanguage = "en"
}) {
  if (!question) {
    return (
      <div className="text-gray-500">
        No question available.
      </div>
    );
  }

  switch (question.type) {
    case "mcq":
      return (
        <MCQ 
          key={questionIndex} 
          data={question} 
          onViewed={onQuestionViewed}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
        />
      );

    case "flashcard":
      return (
        <Flashcard 
          key={questionIndex} 
          data={question} 
          onViewed={onQuestionViewed}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
        />
      );

    case "fill_blank":
      return (
        <FillInBlank 
          key={questionIndex} 
          data={question} 
          onViewed={onQuestionViewed}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
        />
      );

    default:
      return (
        <div className="text-gray-500">
          Unknown question type: {question.type}
        </div>
      );
  }
}
