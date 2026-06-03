import { Country, Question } from '../types'

/** Mezcla un array de forma aleatoria (Fisher-Yates) */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Genera 10 preguntas mezcladas a partir de la lista de países */
export function generateQuestions(countries: Country[]): Question[] {
  // Filtrar países que tengan capital válida para preguntas de capital
  const withCapital = countries.filter(
    (c) => c.capital && c.capital.length > 0 && c.capital[0].trim() !== '',
  )

  const pool = shuffle(countries).slice(0, 40)
  const poolWithCapital = shuffle(withCapital).slice(0, 40)
  const questions: Question[] = []
  const types: Array<'capital' | 'flag' | 'population'> = [
    'capital', 'capital', 'capital', 'capital',
    'flag', 'flag', 'flag',
    'population', 'population', 'population',
  ]

  for (let i = 0; i < 10; i++) {
    const type = shuffle(types)[i] as 'capital' | 'flag' | 'population'

    if (type === 'capital') {
      const correct = poolWithCapital[i]
      const distractors = poolWithCapital
        .filter((_, idx) => idx !== i)
        .filter((c) => c.capital && c.capital[0])
        .slice(0, 3)

      const cap = correct.capital![0]
      const questionText = `¿Cuál es la capital de ${correct.name.common}?`
      const options = shuffle([
        cap,
        ...distractors.map((c) => c.capital![0]),
      ])
      questions.push({ type, questionText, options, correctAnswer: cap })
      continue
    }

    if (type === 'flag') {
      const correct = pool[i]
      const distractors = pool.filter((_, idx) => idx !== i).slice(0, 3)

      const questionText = '¿A qué país pertenece esta bandera?'
      const correctAnswer = correct.name.common
      const flagUrl = correct.flags.svg || correct.flags.png
      const options = shuffle([
        correct.name.common,
        ...distractors.map((c) => c.name.common),
      ])
      questions.push({ type, questionText, options, correctAnswer, flagUrl })
      continue
    }

    // population
    const correct = pool[i]
    const distractors = pool.filter((_, idx) => idx !== i).slice(0, 3)
    const correctAnswer = correct.population.toLocaleString('es')
    const questionText = `¿Cuál es la población aproximada de ${correct.name.common}?`
    const options = shuffle([
      correctAnswer,
      ...distractors.map((c) => c.population.toLocaleString('es')),
    ])
    questions.push({ type, questionText, options, correctAnswer })
  }

  return questions
}

/** Lee el high score de localStorage */
export const getHighScore = (): number =>
  parseInt(localStorage.getItem('highScore') ?? '0', 10)

/** Guarda el high score solo si supera el anterior */
export const saveHighScore = (score: number): void => {
  const current = getHighScore()
  if (score > current) localStorage.setItem('highScore', String(score))
}
