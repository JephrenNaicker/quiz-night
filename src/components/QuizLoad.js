import React, { useState } from 'react';
import quizdata from './dataContext/quiz-data.json'
import './Quizload.css';  // Import the CSS file for custom styling
import { shoot } from './confetti';
import axios from 'axios';

const movieQuizArray = quizdata[0].movieQuiz;

console.log(movieQuizArray);
console.log(movieQuizArray[0].questions);
console.log(movieQuizArray[0].questions[0].answers);

const QuizLoad = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // State to track selected answers
  const [userName, setUserName] = useState();
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    const correctAnswersCount = calculateCorrectAnswersCount();
  
    if(correctAnswersCount===getTotalQuestionsCount())
    {

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
      setTimeout(shoot, 300);
      alert(`${userName} You got ${correctAnswersCount} out of ${getTotalQuestionsCount()} correct!`);
      
    }
    else{
    alert(`${userName} You got ${correctAnswersCount} out of ${getTotalQuestionsCount()} correct! try again`);
    }
    saveUserScore(userName,correctAnswersCount);
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

  const saveUserScore = (userName, correctAnswersCount) => {
    axios.post('http://localhost:5000/api/save-user-score', { userName, correctAnswersCount })
    .then(response => {
      console.log('User score saved successfully.');
    })
    .catch(error => {
      console.error('Error saving user score:', error);
    });
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
         <div className="input-group mb-3" >
         <input type='text' className="form-control" placeholder="Player Name" required onChange={(e)=>setUserName(e.target.value)}/>
         <div  className="input-group-append">
          <button type="submit" className="btn btn-outline-secondary">Submit</button></div>
         </div>
         
         
      </form>
    </div>
  );
};

export default QuizLoad;