import { useState } from "react";

function QuizModal({
  quiz,
  isOpen,
  onClose
}) {

  if (!isOpen || !quiz) return null;

  return (
    <div className="quiz-overlay">

      <div className="quiz-modal">

        <button
          className="close-quiz"
          onClick={onClose}
        >
          ✕
        </button>

        <h1>
          🧠 AI Quiz
        </h1>

      </div>

    </div>
  );
}

export default QuizModal;