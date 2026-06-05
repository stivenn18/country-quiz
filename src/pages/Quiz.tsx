import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Country, Question, UserAnswer } from '../types'
import { generateQuestions } from '../utils/quiz'
import { useTimer } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import TimerBar from '../components/TimerBar'
import OptionButton from '../components/OptionButton'
import ProgressDots from '../components/ProgressDots'
import DarkModeToggle from '../components/DarkModeToggle'

// En desarrollo: primero el proxy de Vite (/api/countries) para evitar CORS
// En producción (Netlify): el proxy no existe, cae al segundo o tercer URL
const API_URLS = import.meta.env.DEV
  ? [
      '/api/countries?fields=name,capital,flags,population,cca2,region',
      'https://restcountries.com/v3.1/all?fields=name,capital,flags,population,cca2,region',
      'https://restcountries.com/v3.1/all',
    ]
  : [
      'https://restcountries.com/v3.1/all?fields=name,capital,flags,population,cca2,region',
      'https://restcountries.com/v3.1/all',
    ]

async function fetchCountriesWithFallback(): Promise<Country[]> {
  let lastError: Error = new Error('No se pudo conectar a la API')

  for (const url of API_URLS) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) return data as Country[]
      throw new Error('Respuesta vacía')
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw lastError
}

export default function Quiz() {
  const navigate = useNavigate()
  const { playSuccess, playError } = useSound()

  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(UserAnswer | null)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const answered = answers[current] !== undefined && answers[current] !== null

  const handleExpire = useCallback(() => {
    if (answered) return
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = { selected: '', state: 'wrong' }
      return next
    })
    playError()
  }, [answered, current, playError])

  const { timeLeft, reset } = useTimer(
    !answered && questions.length > 0,
    handleExpire,
  )

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCountriesWithFallback()
      const qs = generateQuestions(data)
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(null))
      setCurrent(0)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error desconocido al cargar los países',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const handleAnswer = (option: string) => {
    if (answered) return
    const isCorrect = option === questions[current].correctAnswer
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = { selected: option, state: isCorrect ? 'correct' : 'wrong' }
      return next
    })
    if (isCorrect) playSuccess()
    else playError()
  }

  const handleNavigate = (index: number) => {
    setCurrent(index)
    reset()
  }

  const handleNext = () => {
    const allAnswered = answers.every((a) => a !== null)
    if (!allAnswered && current < questions.length - 1) {
      let next = current + 1
      while (next < questions.length && answers[next] !== null) next++
      if (next < questions.length) {
        setCurrent(next)
        reset()
        return
      }
    }
    const score = answers.filter((a) => a?.state === 'correct').length
    navigate('/result', { state: { score, answers, questions } })
  }

  // ── Cargando ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin inline-block">🌐</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
            Cargando preguntas...
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Conectando con la API de países
          </p>
        </div>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-lg">
          <div className="text-5xl mb-4">😵</div>
          <p className="text-red-500 font-semibold mb-2 text-lg">
            Error al cargar los países
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 break-words">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={loadQuestions}
              className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-indigo-600 transition font-semibold"
            >
              🔄 Reintentar
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:border-primary transition font-semibold"
            >
              🏠 Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) return null

  // ── Quiz activo ───────────────────────────────────────────────────────────
  const q = questions[current]
  const answerStates = answers.map(
    (a) => a?.state ?? 'unanswered',
  ) as ('unanswered' | 'correct' | 'wrong')[]
  const allAnswered = answers.every((a) => a !== null)

  const getOptionState = (
    option: string,
  ): 'default' | 'correct' | 'wrong' | 'disabled' => {
    if (!answered) return 'default'
    if (option === q.correctAnswer) return 'correct'
    if (option === answers[current]?.selected) return 'wrong'
    return 'disabled'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-700 dark:text-gray-200 text-sm">
            Pregunta {current + 1} de {questions.length}
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            {q.type === 'capital' ? '🏙 Capital' : q.type === 'flag' ? '🚩 Bandera' : '👥 Población'}
          </span>
        </div>

        <TimerBar timeLeft={timeLeft} />

        <ProgressDots
          total={questions.length}
          current={current}
          answers={answerStates}
          onNavigate={handleNavigate}
        />

        {q.flagUrl && (
          <div className="flex justify-center my-4">
            <img
              src={q.flagUrl}
              alt="Bandera del país"
              className="h-28 object-contain rounded-lg shadow border border-gray-200 dark:border-gray-600"
            />
          </div>
        )}

        <p className="text-gray-800 dark:text-white font-semibold text-base md:text-lg mb-4 text-center">
          {q.questionText}
        </p>

        <div className="grid gap-3">
          {q.options.map((opt) => (
            <OptionButton
              key={opt}
              label={opt}
              state={getOptionState(opt)}
              onClick={() => handleAnswer(opt)}
            />
          ))}
        </div>

        {answered && (
          <button
            onClick={handleNext}
            className="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-indigo-600 active:scale-95 transition-all duration-200"
          >
            {allAnswered || current === questions.length - 1 ? '🏁 Ver resultados' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  )
}
