import { useNavigate } from 'react-router-dom'
import DarkModeToggle from '../components/DarkModeToggle'
import { getHighScore } from '../utils/quiz'

export default function Home() {
  const navigate = useNavigate()
  const highScore = getHighScore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
        {/* Globo decorativo */}
        <div className="text-7xl mb-4">🌍</div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Country Quiz
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm md:text-base">
          Pon a prueba tus conocimientos sobre países del mundo.
          10 preguntas · 15 segundos cada una.
        </p>

        {highScore > 0 && (
          <div className="mb-6 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
            <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">
              🏆 Mejor puntaje: <span className="font-bold">{highScore} / 10</span>
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/quiz')}
          className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-xl
            hover:bg-indigo-600 active:scale-95 transition-all duration-200 text-lg shadow-md"
        >
          ¡Comenzar!
        </button>
      </div>
    </div>
  )
}
