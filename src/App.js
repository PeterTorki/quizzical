import './App.css';
import { nanoid } from 'nanoid'
import React from 'react';
import Question from './components/Question'


export default function App() {

  const [questions, setQuestions] = React.useState([]);
  const [start, setStart] = React.useState(false) 
  const [submitted, setSubmitted] = React.useState(false)
  const [isAllSelected, setIsAllSelected] = React.useState(false)
  const [quizzical, setQuizzical] = React.useState(false)
  // GET questions from data and store them in [questions] state
  React.useEffect(() => {
    if(start === true) {
      fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
      .then(response => response.json())
      .then(data => 
      setQuestions(data.results.map(ques => {
        return{
          question: ques.question,
          id: nanoid(),
          options: ques.incorrect_answers.concat([ques.correct_answer])
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value),
          selected: undefined,
          correct: ques.correct_answer
        }
       })))
    }
  }, [start])


  // returns the no. correct answers
  function countCorrect() {
    if(isAllSelected){
      let cnt = 0
      for(let i = 0 ; i < 5 ; i++) {
        console.log(questions[i].correct, questions[i].options[questions[i].selected])
        cnt += (questions[i].options[questions[i].selected] === questions[i].correct)
      } 
      return cnt
    }
  }

  // Check that every ques has a selected option before submitting
  React.useEffect(() => {
    if(questions.length !== 0) {
      const allSelected = questions.every(ques => ques.selected !== undefined)
      if(allSelected) {
        setIsAllSelected(true)
      }
    }
  }, [questions])

  // stores the selected answer in the [question] state
  function chooseAnswer(id, idxOption) {
    setQuestions(oldQues => oldQues.map( ques => {
        return ques.id === id ?{...ques, selected: idxOption}: ques
    }))
  }
  
  // formedQuestions: Build questions to display
  const formedQuestions = questions.map(ques => {
    return (
      <Question 
        key={ques.id}
        id={ques.id}
        question={ques.question}
        choices={ques.options}
        chooseAnswer={chooseAnswer}
        correct={ques.correct}
        selectedAnswer={ques.selected}
        isSubmitted={submitted}
      />
    )
  })
  function playAgain() {
    setQuestions([])
    setIsAllSelected(false)
    setStart(false) 
    setSubmitted(false)
    setQuizzical(false)
  }

  function checkMissed() {
    setQuizzical(true)
    setSubmitted(true && isAllSelected)
  }

  return (
    <div className="App">
      <img className='top--img' alt="top" src="./../imgs/blob1.png" />
      {
      start ?
        <main>
          {formedQuestions}
          {
            submitted && isAllSelected?
            <main>
              <span className='result'>You scored {countCorrect()}/5 correct answers</span>
              <button className="quiz-btn" onClick={playAgain}>Play Again</button>
            </main>
            :
            <main>
              {quizzical && !isAllSelected && <span className='result'>Please make sure that you have a answers for all questions</span>}
              <button className="quiz-btn" onClick={checkMissed}>Check Answer</button>
            </main>
          }
        
        </main>
      :
      <main>
        <h1>Quizzical</h1>
        <h3>Let's Answer some questions</h3>
        <button className="quiz-btn" onClick={() => setStart(true)}>Start quiz</button>
      </main>
    }
    <img className='bottom--img' alt="bottom" src="./../imgs/blob2.png" />
    </div>
  );
}

