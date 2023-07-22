import React, { useState } from 'react';

import quizdata from './dataContext/quiz-data.json'
import './Quizload.css';  // Import the CSS file for custom styling
import { shoot } from './confetti';

const movieQuizArray = quizdata[0].movieQuiz;
//const QuestionArray = movieQuizArray.questions.question;
//console.log(QuestionArray);
console.log(movieQuizArray);
console.log(movieQuizArray[0].questions);
console.log(movieQuizArray[0].questions[0].answers);


const QuizLoad = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // State to track selected answers

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    const correctAnswersCount = calculateCorrectAnswersCount();
    if(correctAnswersCount===getTotalQuestionsCount())
    {

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      alert(`You got ${correctAnswersCount} out of ${getTotalQuestionsCount()} correct!`);
      
    }
    else{
    alert(`You got ${correctAnswersCount} out of ${getTotalQuestionsCount()} correct!`);
    }
  };

  const handleAnswerChange = (event, quizIndex, questionIndex) => {
    const updatedAnswers = {
      ...selectedAnswers,
      [`${quizIndex}-${questionIndex}`]: event.target.value,
    };
    setSelectedAnswers(updatedAnswers);
  };

  const calculateCorrectAnswersCount = () => {
    let count = 0;
    movieQuizArray.forEach((quiz, quizIndex) => {
      quiz.questions.forEach((question, questionIndex) => {
        const selectedAnswer = selectedAnswers[`${quizIndex}-${questionIndex}`];
        const correctAnswer = question.answers.find(answer => answer.isCorrect);
        if (selectedAnswer === (correctAnswer && correctAnswer.answer)) {
          count++;
        }
      });
    });
    return count;
  };

  const getTotalQuestionsCount = () => {
    let count = 0;
    movieQuizArray.forEach((quiz) => {
      count += quiz.questions.length;
    });
    return count;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {movieQuizArray.map((quiz, quizIndex) => (

          <div key={quizIndex} className="card">
            <h1>{quiz.name}</h1>
            <h3>Questions</h3>

            {quiz.questions.map((question, questionIndex) => (

              <div key={questionIndex} className="question-card">
                <h4 className="question">{question.question}</h4>

                <div className="answer-grid">
                  {question.answers.map((answer, answerIndex) => (

                    <label key={answerIndex} className="answer-label">
                      <input
                        type="radio"
                        name={`q${quizIndex}-${questionIndex}`}
                        value={answer.answer}
                        checked={selectedAnswers[`${quizIndex}-${questionIndex}`] === answer.answer}
                        onChange={(event) => handleAnswerChange(event, quizIndex, questionIndex)}
                      />
                      <span className="answer-text">{answer.answer}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default QuizLoad;