import { useState } from 'react';

export default function StyleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      question: "Which style resonates with you?",
      options: ["Modern", "Scandinavian", "Industrial", "Bohemian"]
    },
    {
      question: "Preferred color palette?",
      options: ["Neutral tones", "Bold colors", "Pastels", "Dark moody"]
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit quiz
      console.log("Quiz completed:", newAnswers);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {questions[currentQuestion].question}
      </h2>
      <div className="space-y-4">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full px-4 py-3 bg-gray-100 hover:bg-indigo-100 rounded-lg text-left transition"
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 text-gray-500">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  );
}