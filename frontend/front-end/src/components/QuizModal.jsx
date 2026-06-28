import { useState, useEffect } from "react";

function QuizModal({
  quiz,
  isOpen,
  onClose
}) {

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  const [submitted, setSubmitted] =
    useState(false);

  const [showSubmitModal, setShowSubmitModal] =
    useState(false);

  useEffect(() => {
    console.log("Quiz:", quiz);
  }, [quiz]);

  if (!isOpen || !quiz) return null;

  const score = quiz.reduce((total, q, index) => {

    if (selectedAnswers[index] === q.answer) {
      return total + 1;
    }

    return total;

  }, 0);
   const question = quiz[currentQuestion];

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

        <div className="quiz-progress">

    <div
        className="progress-fill"
        style={{
            width: `${((currentQuestion + 1) / quiz.length) * 100}%`
        }}
    />

</div>

<h3 className="question-number">
    Question {currentQuestion + 1} of {quiz.length}
</h3>

<div className="question-card">

    <h2>
        {question.question}
    </h2>

</div>

<div className="options">

    {
        question.options.map((option, index) => (

            <label
                key={index}
                className="option-card"
            >

                <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={
                        selectedAnswers[currentQuestion] === index
                    }
                    onChange={() =>
                        setSelectedAnswers({
                            ...selectedAnswers,
                            [currentQuestion]: index
                        })
                    }
                />

                {option}

            </label>

        ))
    }

</div>

<div className="quiz-buttons">

    <button
        disabled={currentQuestion === 0}
        onClick={() =>
            setCurrentQuestion(currentQuestion - 1)
        }
    >
        ← Previous
    </button>

    {
        currentQuestion < quiz.length - 1 ? (

            <button
                onClick={() =>
                    setCurrentQuestion(currentQuestion + 1)
                }
            >
                Next →
            </button>

        ) : (

            <button
                onClick={() =>
                    setShowSubmitModal(true)
                }
            >
                Submit Quiz
            </button>

        )
    }

</div>

      </div>

    </div>

  );
}

export default QuizModal;