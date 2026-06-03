import { useEffect } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { saveHighScore, getHighScore } from '../utils/quiz'
import DarkModeToggle from '../components/DarkModeToggle'
import { Question, UserAnswer } from '../types'

interface ResultState {
  score: number
  answers: UserAnswer[]
  questions: Question[]
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ResultState | null

  useEffect(() => {
    if (state) saveHighScore(state.score)
  }, [state])

  if (!state) return <Navigate to="/" replace />

  const { score, questions, answers } = state
  const highScore = getHighScore()
  const percentage = Math.round((score / questions.length) * 100)

  const emoji =
    percentage === 100 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 40 ? '😅' : '😢'

  const message =
    percentage === 100
      ? '¡Perfecto! ¡Eres un experto en geografía!'
      : percentage >= 70
        ? '¡Muy bien! Conoces bastante el mundo.'
        : percentage >= 40
          ? 'No estuvo mal, pero puedes mejorar.'
          : 'Sigue practicando, ¡lo lograrás!'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 max-w-md w-full text-center">
        <div className="text-7xl mb-4">{emoji}</div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          ¡Quiz completado!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{message}</p>

        {/* Score */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="bg-indigo-50 dark:bg-gray-700 rounded-2xl px-6 py-4">
            <p className="text-4xl font-bold text-primary">{score}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Correctas</p>
          </div>
          <div className="bg-red-50 dark:bg-gray-700 rounded-2xl px-6 py-4">
            <p className="text-4xl font-bold text-wrong">{questions.length - score}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Incorrectas</p>
          </div>
        </div>

        {/* High Score */}
        <div className="mb-6 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">
            🏆 Mejor puntaje histórico: <span className="font-bold">{highScore} / {questions.length}</span>
          </p>
        </div>

        {/* Resumen por pregunta */}
        <div className="text-left space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 text-xs p-2 rounded-lg
                ${answers[i]?.state === 'correct'
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'}`}
            >
              <span>{answers[i]?.state === 'correct' ? '✅' : '❌'}</span>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200 line-clamp-1">{q.questionText}</p>
                <p className="text-gray-500 dark:text-gray-400">
                  Resp. correcta: <span className="font-semibold">{q.correctAnswer}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/quiz')}
          className="w-full py-3 bg-primary text-white font-semibold rounded-xl
            hover:bg-indigo-600 active:scale-95 transition-all duration-200"
        >
          🔄 Jugar de nuevo
        </button>
        <button
          onClick={() => navigate('/')}
          className="mt-3 w-full py-3 border-2 border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-200 font-semibold rounded-xl
            hover:border-primary hover:text-primary transition-all duration-200"
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  )
}
