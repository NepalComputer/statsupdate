'use client';

import { useState } from 'react';

type Question = {
  questionText: string;
  options: string[];
  correctIndex: number;
};

type QuizBlockProps = {
  title: string;
  description?: string;
  questions: Question[];
};

export default function QuizBlock({ title, description, questions }: QuizBlockProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const submitQuiz = () => {
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctIndex) calculatedScore++;
    });
    setScore(calculatedScore);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="my-12 bg-white border border-gray-200 rounded-3xl p-8 shadow">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold">{title}</h3>
        {description && <p className="mt-3 text-gray-600">{description}</p>}
      </div>

      <div className="space-y-12">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border-l-4 border-blue-600 pl-6">
            <h4 className="font-semibold text-xl mb-5">
              {qIndex + 1}. {q.questionText}
            </h4>
            <div className="grid gap-3">
              {q.options.map((option, optIndex) => {
                const isSelected = selectedAnswers[qIndex] === optIndex;
                const isCorrect = showResults && optIndex === q.correctIndex;
                const isWrong = showResults && isSelected && !isCorrect;

                return (
                  <button
                    key={optIndex}
                    onClick={() => handleSelect(qIndex, optIndex)}
                    disabled={showResults}
                    className={`w-full text-left p-5 rounded-2xl border-2 text-lg transition-all ${
                      isCorrect
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : isWrong
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        {!showResults ? (
          <button
            onClick={submitQuiz}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-2xl text-lg font-medium"
          >
            Submit Quiz
          </button>
        ) : (
          <div>
            <p className="text-5xl font-bold text-blue-600 mb-2">
              {score} / {questions.length}
            </p>
            <p className="text-2xl font-medium mt-2">
              {score === questions.length
                ? "🏆 Perfect Score! You're a true expert!"
                : score >= Math.ceil(questions.length * 0.7)
                ? "🔥 Excellent! Great job!"
                : "😊 Good effort! Try again?"}
            </p>
            <button
              onClick={resetQuiz}
              className="mt-6 text-blue-600 hover:underline text-lg"
            >
              Try Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}