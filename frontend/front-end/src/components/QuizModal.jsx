import { useEffect } from "react";
const [currentQuestion, setCurrentQuestion] = useState(0);

const [selectedAnswers, setSelectedAnswers] = useState({});

const [submitted, setSubmitted] = useState(false);

const [showSubmitModal, setShowSubmitModal] = useState(false);
const score = quiz.reduce((total, q, index) => {

  if (selectedAnswers[index] === q.answer) {
    return total + 1;
  }

  return total;

}, 0);
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