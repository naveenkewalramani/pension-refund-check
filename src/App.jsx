import { useState } from 'react'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import CountrySelect from './components/CountrySelect'
import Question from './components/Question'
import Results from './components/Results'
import { getQuestions } from './data/questions'
import { calculateEligibility } from './utils/eligibility'

export default function App() {
  const [step, setStep] = useState('country') // 'country' | 'questions' | 'results'
  const [country, setCountry] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const visibleQuestions = country ? getQuestions(country.id, answers) : []
  const currentQ = visibleQuestions[questionIndex]

  function handleCountrySelect(c) {
    setCountry(c)
    setQuestionIndex(0)
    setAnswers({})
    setStep('questions')
  }

  function handleAnswerAndContinue(value) {
    const newAnswers = { ...answers, [currentQ.id]: value }
    setAnswers(newAnswers)

    const updatedQuestions = getQuestions(country.id, newAnswers)
    const nextIndex = questionIndex + 1

    if (nextIndex < updatedQuestions.length) {
      setQuestionIndex(nextIndex)
    } else {
      const eligibility = calculateEligibility(country.id, newAnswers)
      setResult(eligibility)
      setStep('results')
    }
  }

  function handleBack() {
    if (step === 'questions') {
      if (questionIndex === 0) {
        setStep('country')
      } else {
        setQuestionIndex((i) => i - 1)
      }
    } else if (step === 'results') {
      setQuestionIndex(visibleQuestions.length - 1)
      setStep('questions')
    }
  }

  function handleRestart() {
    setStep('country')
    setCountry(null)
    setQuestionIndex(0)
    setAnswers({})
    setResult(null)
  }

  const progress =
    step === 'country'
      ? 0
      : step === 'results'
      ? 100
      : Math.round(((questionIndex + 1) / (visibleQuestions.length + 1)) * 95)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        {step !== 'country' && <ProgressBar progress={progress} country={country} />}

        {step === 'country' && <CountrySelect onSelect={handleCountrySelect} />}

        {step === 'questions' && currentQ && (
          <Question
            key={`${country.id}-q${questionIndex}`}
            question={currentQ}
            answer={answers[currentQ.id]}
            onAnswerAndContinue={handleAnswerAndContinue}
            onBack={handleBack}
            isFirst={questionIndex === 0}
            questionNumber={questionIndex + 1}
            totalQuestions={visibleQuestions.length}
          />
        )}

        {step === 'results' && result && (
          <Results result={result} country={country} answers={answers} onRestart={handleRestart} />
        )}
      </main>
      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100">
        © {new Date().getFullYear()} PensionRefund.io · For information purposes only · Not financial advice
      </footer>
    </div>
  )
}
