// Tipos globales del proyecto

export interface Country {
  name: { common: string; official: string }
  capital?: string[]
  region: string
  flags: { svg: string; png: string; alt?: string }
  population: number
  cca2: string
}

export interface Question {
  type: 'capital' | 'flag' | 'population'
  questionText: string
  options: string[]
  correctAnswer: string
  flagUrl?: string
}

export type AnswerState = 'unanswered' | 'correct' | 'wrong'

export interface UserAnswer {
  selected: string
  state: AnswerState
}
