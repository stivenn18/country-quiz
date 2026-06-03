interface ProgressDotsProps {
  total: number
  current: number
  answers: ('unanswered' | 'correct' | 'wrong')[]
  onNavigate: (index: number) => void
}

const dotStyle: Record<string, string> = {
  unanswered: 'bg-gray-300 dark:bg-gray-600',
  correct: 'bg-correct',
  wrong: 'bg-wrong',
}

export default function ProgressDots({
  total,
  current,
  answers,
  onNavigate,
}: ProgressDotsProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center my-4">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          title={`Pregunta ${i + 1}`}
          className={`w-7 h-7 rounded-full text-xs font-bold transition-all duration-200
            ${dotStyle[answers[i] ?? 'unanswered']}
            ${i === current ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900 scale-110' : ''}
            text-white`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}
