import './App.css'
import { useState, useEffect, useCallback } from 'react'
import { wordsList } from './data/words';
import StartScreen from './components/startScreen/StartScreen'
import Game from './components/game/Game';
import GameOver from './components/gameOver/GameOver';


const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)



 

  const pickedWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category }
  }, [words]);


  const resetGame = useCallback(() => {
    clearLetterStates();
    const { word, category } = pickedWordAndCategory()
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

  }, [pickedWordAndCategory]);

  const startGame = useCallback(() => {
    //setGameStage(stages[0].name)
    clearLetterStates();
    setScore(0)
    const { word, category } = pickedWordAndCategory()

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)


    setGameStage(stages[1].name)


  }, [pickedWordAndCategory])

  const veriffyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter))
    {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessesLetters) => [
        ...actualGuessesLetters,
        normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  } 

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if(guesses <= 0) {

      clearLetterStates()

      setGameStage(stages[2].name)
    }

  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => ( actualScore += 100))
      resetGame()
    }
  
  }, [guessedLetters, letters, resetGame])

  const retryGame = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
      <Game 
      veriffyLetter={veriffyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters} 
      guessedLetters={guessedLetters} 
      wrongLetters={wrongLetters} 
      guesses={guesses} 
      score={score} />)}

      {gameStage === "end" && <GameOver retryGame={retryGame} score={score}/>}

    </div>
  )
}

export default App
