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

const [submitted, setSubmitted] = useState(false);

const [reviewMode, setReviewMode] = useState(false);

const [showSubmitModal, setShowSubmitModal] = useState(false);
  if (submitted) {

    return (

        <div className="quiz-overlay">

            <div className="quiz-modal">

                <h1>🎉 Quiz Completed</h1>

                <h2>

                    Your Score

                </h2>

                <div className="score-circle">

                    {score}/{quiz.length}

                </div>

                <p>

                    You answered

                    <strong>

                        {" "}
                        {score}

                    </strong>

                    {" "}out of{" "}

                    <strong>

                        {quiz.length}

                    </strong>

                    {" "}questions correctly.

                </p>

                <div className="quiz-buttons">

                    <button

                        className="prev-btn"

                        onClick={() => {

                            setSubmitted(false);

                            setCurrentQuestion(0);

                            setSelectedAnswers({});

                        }}

                    >

                        🔄 Retake Quiz

                    </button>

                    <button

                        className="submit-btn"

                        onClick={onClose}

                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

}

const question = quiz[currentQuestion];

const score = quiz.reduce((total, q, index) => {

    if (selectedAnswers[index] === q.answer)
        return total + 1;

    return total;

}, 0);

const percentage = Math.round(
    (score / quiz.length) * 100
  );
  const performance = () => {

    if (percentage === 100)
        return "🌟 Perfect Score!";

    if (percentage >= 80)
        return "🏆 Excellent!";

    if (percentage >= 60)
        return "👍 Good Job!";

    if (percentage >= 40)
        return "📚 Keep Practicing!";

    return "💪 Don't Give Up!";
};
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

         {
currentQuestion === quiz.length - 1 ?

(

<button
className="submit-btn"
onClick={() => setShowSubmitModal(true)}
>
🚀 Submit Quiz
</button>

)

:

(

<button
className="next-btn"
onClick={() =>
setCurrentQuestion(currentQuestion + 1)
}
>
Next →
</button>

)
}

        </div>

      </div>
    {
showSubmitModal && (

<div className="modal-overlay">

<div className="delete-modal">

<h2>
Submit Quiz?
</h2>

<p>
After submitting you won't be able to change your answers.
</p>

<div className="modal-buttons">

<button
className="cancel-btn"
onClick={() =>
setShowSubmitModal(false)
}
>
Cancel
</button>

<button
className="confirm-delete-btn"
onClick={()=>{
setSubmitted(true);
setShowSubmitModal(false);
}}
>
Submit
</button>

</div>

</div>

</div>

)
}
    </div>

  );

}

export default QuizModal;