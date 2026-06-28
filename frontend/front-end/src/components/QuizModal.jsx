import { useState } from "react";
import "./QuizModal.css";
function QuizModal({
  quiz,
  isOpen,
  onClose
}) {

  if (!isOpen || !quiz) return null;

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const question = quiz[currentQuestion];

  const progress =
    ((currentQuestion + 1) / quiz.length) * 100;

  return (

    <div className="quiz-overlay">

      <div className="quiz-modal">

        <button
          className="close-quiz"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="quiz-top">

          <div>

            <h1>🧠 AI Quiz</h1>

            <p>
              Test your knowledge
            </p>

          </div>

        </div>

        <div className="progress">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`
            }}
          ></div>

        </div>

        <h2 className="question-count">

          Question {currentQuestion + 1}

          of

          {quiz.length}

        </h2>

        <div className="question-card">

          <div className="question-icon">
            Q
          </div>

          <h3>
            {question.question}
          </h3>

        </div>

        <div className="options">

          {question.options.map((option, index) => (

            <div

              key={index}

              className={`option ${
                selectedAnswers[currentQuestion] === index
                  ? "selected"
                  : ""
              }`}

              onClick={() =>

                setSelectedAnswers({

                  ...selectedAnswers,

                  [currentQuestion]: index

                })

              }

            >

              <div className="radio"></div>

              <span>
                {option}
              </span>

            </div>

          ))}

        </div>

        <div className="quiz-buttons">

          <button

            className="prev-btn"

            disabled={currentQuestion === 0}

            onClick={() =>

              setCurrentQuestion(

                currentQuestion - 1

              )

            }

          >

            ← Previous

          </button>

          <button

            className="next-btn"

            disabled={
              currentQuestion ===
              quiz.length - 1
            }

            onClick={() =>

              setCurrentQuestion(

                currentQuestion + 1

              )

            }

          >

            Next →

          </button>

        </div>

      </div>

    </div>

  );

}

export default QuizModal;