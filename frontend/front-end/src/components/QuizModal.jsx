import { useEffect } from "react";

function QuizModal({
  quiz,
  isOpen,
  onClose
}) {

  useEffect(() => {
    console.log("Quiz:", quiz);
  }, [quiz]);

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

        <h1>🧠 AI Quiz</h1>

        <pre>
          {JSON.stringify(quiz, null, 2)}
        </pre>

      </div>

    </div>
  );
}

export default QuizModal;